import { SQSEvent } from "aws-lambda";
import {
  Attribute,
  AttributeType,
  EnrichmentStatus,
  PrismaClient,
  Product,
  ProductAttribute,
  ProductLastUpdatedBy,
} from "@prisma/client";
import { webSearcher } from "./lib/prompts/webSearcher";
import { ocrAnalyzer } from "./lib/prompts/ocrAnalyzer";
import { getUpsertManyProductAttributesQuery } from "./lib/query/productAttributeUpsertMany";
import { batchAttributeEnrichment } from "./lib/batch";
import { getUpsertManyProductAttributeChangelogQuery } from "./lib/query/productAttributeChangelogUpsert";

interface QueueMessage {
  taskId: string;
  supplierId: number;
  productIds: string[];
  attributeIds: string[];
}

let prisma: PrismaClient;
const getPrismaClient = () => {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
};

type ProductWithAttributes = Pick<Product, "id" | "name"> & {
  attributes: (Pick<ProductAttribute, "value" | "productId"> & {
    attribute: Attribute;
  })[];
};

export const handler = async (event: SQSEvent) => {
  const db = getPrismaClient();
  const failedMessageIds: string[] = [];

  for (const record of event.Records) {
    let taskId: string | undefined;
    let supplierId: number | undefined;
    try {
      const message = JSON.parse(record.body) as QueueMessage;

      console.log("Processing:", message);

      if (!message.taskId) {
        failedMessageIds.push(record.messageId);
        console.error(`Task ID is required`);
        continue;
      }

      taskId = message.taskId;
      supplierId = message.supplierId;
      const [attributesToEnrich, products] = await Promise.all([
        db.attribute.findMany({
          where: {
            supplierId: message.supplierId,
            id:
              message.attributeIds && message.attributeIds.length > 0
                ? { in: message.attributeIds }
                : undefined,
            enrichmentEnabled: true,
            type: {
              notIn: [AttributeType.DATE, AttributeType.MEDIA],
            },
          },
          select: {
            id: true,
            name: true,
            description: true,
            type: true,
            enrichmentInstructions: true,
            selectOptions: true,
            measureUnits: true,
          },
        }),
        db.product.findMany({
          where: {
            id: { in: message.productIds },
            supplierId: message.supplierId,
          },
          select: {
            id: true,
            name: true,
            attributes: {
              select: {
                value: true,
                productId: true,
                attribute: true,
                changeLog: true,
              },
            },
          },
        }),
      ]);

      if (attributesToEnrich.length === 0) {
        failedMessageIds.push(record.messageId);
        console.error(`No attributes to enrich for task ${taskId}`);
        continue;
      }

      console.log("Attributes to enrich:", attributesToEnrich);

      const getProductContextData = async (product: ProductWithAttributes) => {
        const productAttributes = product.attributes;
        const formattedAttributes = productAttributes
          .filter(
            (attr) =>
              // Skip date and media attributes to be used in context retrieval
              attr.attribute.type !== AttributeType.DATE &&
              attr.attribute.type !== AttributeType.MEDIA &&
              attr.attribute.type !== AttributeType.HTML
          )
          .map((attr) => {
            return {
              name: attr.attribute.name,
              value: attr.value,
              description: attr.attribute.description,
            };
          });

        const productPrimaryMediaUrls = productAttributes
          .filter((attr) => attr.attribute.primaryMedia && !!attr.value)
          .map((i) => i.value) as string[];

        const [webSearchResponse, ocrResponse] = await Promise.all([
          webSearcher(product.name, formattedAttributes),
          ocrAnalyzer(productPrimaryMediaUrls),
        ]);

        return {
          productId: product.id,
          webContent: webSearchResponse,
          ocrContent: ocrResponse,
        };
      };

      // Enrichment loop
      for (const product of products) {
        const contextData = await getProductContextData(product);
        console.log("Context data:", contextData);

        // Do not enrich user-updated attribute values.
        const filteredAttributesToEnrich = attributesToEnrich.filter((attr) => {
          const productAttribute = product.attributes.find(
            (productAttribute) => productAttribute.attribute.id === attr.id
          );

          if (productAttribute?.changeLog) {
            return (
              productAttribute.changeLog.updatedBy !== ProductLastUpdatedBy.USER
            );
          }

          return true;
        });

        const enrichmentResponse = await batchAttributeEnrichment({
          productName: product.name,
          ocrContent: contextData.ocrContent || "",
          webSearchResults: contextData.webContent || "",
          attributesToEnrich: filteredAttributesToEnrich,
        });
        console.log("Enrichment response:", enrichmentResponse);

        const productAttributesUpdateInput = enrichmentResponse.map((attr) => ({
          productId: product.id,
          attributeId: attr.id,
          value: attr.value,
        }));

        if (
          productAttributesUpdateInput &&
          productAttributesUpdateInput.length > 0
        ) {
          // Raw query because Prisma doesn't support upsertMany different values
          const { query, params } = getUpsertManyProductAttributesQuery(
            productAttributesUpdateInput
          );
          const updatedProductAttributeResponse = await db.$queryRawUnsafe<
            Array<{ id: string }>
          >(query, ...params);

          const updatedProductAttributeIds =
            updatedProductAttributeResponse.map((i) => i.id);

          console.log(
            "Updated product attribute ids:",
            updatedProductAttributeIds
          );

          if (updatedProductAttributeIds.length > 0) {
            const { query, params } =
              getUpsertManyProductAttributeChangelogQuery(
                updatedProductAttributeIds.map((id) => ({
                  productAttributeId: id,
                  updatedBy: ProductLastUpdatedBy.ENRICHMENT,
                  updatedByReferenceId: taskId || "",
                }))
              );
            await db.$queryRawUnsafe(query, ...params);
          }
        }
      }

      await db.enrichmentTask.update({
        where: {
          id: taskId,
          supplierId,
        },
        data: {
          status: EnrichmentStatus.COMPLETED,
        },
      });
    } catch (error) {
      console.error(`Error processing message ${record.messageId}:`, error);

      await db.enrichmentTask.update({
        where: {
          id: taskId,
          supplierId,
        },
        data: {
          status: EnrichmentStatus.FAILED,
        },
      });

      failedMessageIds.push(record.messageId);
    }
  }

  prisma?.$disconnect();

  return failedMessageIds.length > 0
    ? {
        batchItemFailures: failedMessageIds.map((id) => ({
          itemIdentifier: id,
        })),
      }
    : null;
};
