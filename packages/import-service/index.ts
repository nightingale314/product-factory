import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { parse } from "fast-csv";

const s3Client = new S3Client({});

export const handler = async (event: { supplierId: string; s3Url: string }) => {
  try {
    // Extract bucket and key from S3 URL
    const url = new URL(event.s3Url);
    const bucket = url.hostname.split(".")[0];
    const key = url.pathname.slice(1);

    // Get S3 object
    const command = new GetObjectCommand({ Bucket: bucket, Key: key });
    const response = await s3Client.send(command);

    // Parse CSV
    const stream = response.Body as Readable;
    const rows: any[] = [];

    await new Promise((resolve, reject) => {
      stream
        .pipe(parse({ headers: true }))
        .on("data", (row) => {
          if (rows.length < 5) {
            rows.push(row);
          }
        })
        .on("end", () => resolve(rows))
        .on("error", reject);
    });

    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          supplierId: event.supplierId,
          firstFiveRows: rows,
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
