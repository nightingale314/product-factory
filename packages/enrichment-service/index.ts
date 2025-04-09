export const handler = async () => {
  try {
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: "Enriched",
        },
        null,
        2
      ),
    };
  } catch (err) {
    const error = err as Error;
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
