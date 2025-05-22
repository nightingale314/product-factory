import {
  GetObjectCommand,
  GetObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";
import { Readable } from "stream";

const s3Client = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID as string,
    secretAccessKey: process.env.SECRET_ACCESS_KEY as string,
  },
});

export async function downloadFileFromS3({
  bucket,
  fileKey,
}: {
  bucket: string;
  fileKey: string;
}): Promise<Readable | null> {
  try {
    const params: GetObjectCommandInput = {
      Key: fileKey,
      Bucket: bucket,
    };

    // Get S3 object
    const command = new GetObjectCommand(params);
    const { Body } = await s3Client.send(command);

    if (!Body) {
      throw new Error("Empty response from S3");
    }

    if (Body instanceof Readable) {
      return Body;
    }

    const stream = Body as unknown as Readable;

    return stream;
  } catch (err) {
    const error = err as Error;
    console.error("Error downloading file from S3:", error);
    return null;
  }
}
