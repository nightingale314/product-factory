export const getUpsertManyProductAttributesQuery = (
  attributes: {
    productId: string;
    attributeId: string;
    value: any;
  }[]
) => {
  const dedupedAttributes = Object.values(
    attributes.reduce((acc, attr) => {
      const key = `${attr.productId}:${attr.attributeId}`;
      acc[key] = attr; // last one wins
      return acc;
    }, {} as Record<string, (typeof attributes)[0]>)
  );

  const valuesClause = dedupedAttributes
    .map(
      (_, i) =>
        `(gen_random_uuid(), $${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3}::json)`
    )
    .join(", ");

  const params = dedupedAttributes.flatMap(
    ({ productId, attributeId, value }) => [
      productId,
      attributeId,
      JSON.stringify(value),
    ]
  );

  const query = `
    INSERT INTO "product_attribute" ("id", "productId", "attributeId", "value")
    VALUES ${valuesClause}
    ON CONFLICT ("productId", "attributeId")
    DO UPDATE SET "value" = EXCLUDED."value"
    RETURNING "id";
  `;

  return {
    query,
    params,
  };
};
