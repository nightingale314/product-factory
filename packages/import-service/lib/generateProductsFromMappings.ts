import { Attribute, Prisma, Product } from "@prisma/client";
import { Readable } from "stream";
import csv from "csv-parser";
import { RESERVED_ATTRIBUTE_IDS } from "../enums";
import { isReservedAttribute, parseAttributeValue } from "./attribute";
import { InputJsonValue } from "@prisma/client/runtime/library";

type CsvRow = string[];

export type ImportProductsAttributeMapping = {
  targetAttributeId: string;
  columnIndex: number;
};

type ImportProductsParams = {
  csvStream: Readable;
  selectedHeaderIdx: number;
  attributeMappings: ImportProductsAttributeMapping[];
  attributes: Attribute[];
};

type ImportProductsRowIssue = {
  rowIndex: number;
  error: string;
};

type ImportProductsResult = {
  error?: string;
  products: Array<{
    product: Pick<Product, "name" | "skuId">;
    attributes: Array<{
      attributeId: string;
      value: InputJsonValue | typeof Prisma.JsonNull;
    }>;
  }>;
  rowWithIssues?: Array<ImportProductsRowIssue>;
};

export const generateProductsFromMappings = async ({
  selectedHeaderIdx,
  attributeMappings,
  csvStream,
  attributes,
}: ImportProductsParams): Promise<ImportProductsResult> => {
  return new Promise((resolve, reject) => {
    const products: ImportProductsResult["products"] = [];
    let rowIndex = 0;
    let rowWithIssues: ImportProductsRowIssue[] = []; // Row with issues are skipped.

    csvStream
      .pipe(csv({ headers: false }))
      .on("data", (row: CsvRow) => {
        // Find reserved mappings
        const nameMapping = attributeMappings.find(
          (m) => m.targetAttributeId === RESERVED_ATTRIBUTE_IDS.PRODUCT_NAME
        );
        const skuIdMapping = attributeMappings.find(
          (m) => m.targetAttributeId === RESERVED_ATTRIBUTE_IDS.SKU_ID
        );

        const productName = nameMapping
          ? row?.[nameMapping.columnIndex]
          : undefined;

        const skuId = skuIdMapping
          ? row?.[skuIdMapping.columnIndex]
          : undefined;

        // Skip header row
        if (rowIndex !== selectedHeaderIdx) {
          if (!skuId) {
            rowWithIssues.push({
              rowIndex,
              error: "Invalid SKU ID",
            });
            return;
          }

          try {
            // Create product base
            const product: Pick<Product, "name" | "skuId"> = {
              name: productName ?? `Imported Product ${rowIndex + 1}`,
              skuId,
            };

            // Process regular attributes (excluding reserved ones)
            const productAttributes = attributeMappings
              .filter(
                (mapping) => !isReservedAttribute(mapping.targetAttributeId)
              )
              .map((mapping) => {
                const mappedAttribute = attributes.find(
                  (a) => a.id === mapping.targetAttributeId
                );
                if (!mappedAttribute) return null;

                const rawValue = row[mapping.columnIndex];

                return {
                  attributeId: mapping.targetAttributeId,
                  value: parseAttributeValue(rawValue, mappedAttribute),
                };
              })
              .filter(
                (
                  attr
                ): attr is { attributeId: string; value: InputJsonValue } =>
                  attr !== null && attr?.value !== null
              );

            products.push({
              product,
              attributes: productAttributes,
            });
          } catch (error) {
            reject({
              success: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Unknown error processing row",
              products: [],
            });
          }
        }
        rowIndex += 1;
      })
      .on("end", () => {
        resolve({
          products,
          rowWithIssues: rowWithIssues.length > 0 ? rowWithIssues : undefined,
        });
      })
      .on("error", (error) => {
        reject({
          success: false,
          error: error.message,
          products: [],
        });
      });
  });
};
