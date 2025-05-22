import { downloadFileFromS3 } from "./lib/s3";

export const handler = async (event: any) => {
  try {
    const stream = await downloadFileFromS3({
      bucket: process.env.PRODUCT_IMPORT_BUCKET_NAME as string,
      fileKey: event?.fileKey,
    });

    console.log(stream);
  } catch (err) {
    console.error({ err });
  }
};
