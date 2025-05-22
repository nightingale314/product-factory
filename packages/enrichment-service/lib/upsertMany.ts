export const getUpsertManyProductAttributesQuery = (
  attributes: {
    productId: string;
    attributeId: string;
    value: any;
  }[]
) => {
  const columns = ["productId", "attributeId", "value"];
  const valuesClause = attributes
    .map(
      (_, i) =>
        `($${i * columns.length + 1}, $${i * columns.length + 2}, $${
          i * columns.length + 3
        })`
    )
    .join(", ");

  const params = attributes.flatMap(({ productId, attributeId, value }) => [
    productId,
    attributeId,
    JSON.stringify(value),
  ]);

  const query = `
  INSERT INTO "product_attribute" ("productId", "attributeId", "value")
  VALUES ${valuesClause}
  ON CONFLICT ("productId", "attributeId")
  DO UPDATE SET "value" = EXCLUDED."value"
`;

  return {
    query,
    params,
  };
};
