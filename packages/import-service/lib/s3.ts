import {
  GetObjectCommand,
  GetObjectCommandInput,
  HeadObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Readable } from "stream";

export async function downloadFileFromS3(
  s3Url: string
): Promise<Readable | null> {
  const s3Client = new S3Client({ region: process.env.AWS_REGION });

  try {
    // Extract bucket and key from S3 URL
    const url = new URL(s3Url);
    const bucket = url.hostname.split(".")[0];
    const key = url.pathname.slice(1);

    const params: GetObjectCommandInput = {
      Key: key,
      Bucket: bucket,
    };

    // Check if the file exists
    const headObjCommand = new HeadObjectCommand(params);
    await s3Client.send(headObjCommand);

    // Get S3 object
    const command = new GetObjectCommand(params);
    const { Body } = await s3Client.send(command);

    if (!Body) {
      throw new Error("Empty response from S3");
    }

    const stream = Body.transformToWebStream() as unknown as Readable;

    return stream;
  } catch (err) {
    const error = err as Error;
    console.error("Error downloading file from S3:", error);
    return null;
  }
}
