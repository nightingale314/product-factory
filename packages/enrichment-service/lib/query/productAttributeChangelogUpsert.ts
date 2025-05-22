import { ProductLastUpdatedBy } from "@prisma/client";

export const getUpsertManyProductAttributeChangelogQuery = (
  attributes: {
    productAttributeId: string;
    updatedBy: ProductLastUpdatedBy;
    updatedByReferenceId: string;
  }[]
) => {
  const valuesClause = attributes
    .map(
      (_, i) =>
        `($${i * 3 + 1}, NOW(), $${i * 3 + 2}::"ProductLastUpdatedBy", $${
          i * 3 + 3
        })`
    )
    .join(", ");

  const params = attributes.flatMap(
    ({ productAttributeId, updatedBy, updatedByReferenceId }) => [
      productAttributeId,
      updatedBy,
      updatedByReferenceId,
    ]
  );

  const query = `
    INSERT INTO "product_attribute_change_log" (
      "productAttributeId",
      "updatedAt",
      "updatedBy",
      "updatedByReferenceId"
    )
    VALUES ${valuesClause}
    ON CONFLICT ("productAttributeId")
    DO UPDATE SET
      "updatedAt" = EXCLUDED."updatedAt",
      "updatedBy" = EXCLUDED."updatedBy",
      "updatedByReferenceId" = EXCLUDED."updatedByReferenceId";
  `;

  return {
    query,
    params,
  };
};
