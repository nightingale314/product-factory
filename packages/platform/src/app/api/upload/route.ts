import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { auth } from "@/lib/auth/auth";
import { ServerErrorCode } from "@/enums/common";
import { UploadTarget } from "@/constants/upload";
import { UploadFileResponse } from "@/types/upload";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { errorCode: ServerErrorCode.UNAUTHORIZED },
        { status: 401 }
      );
    }

    const supplierId = session.user?.supplierId;
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const targetBucket = formData.get("targetBucket") as string;

    if (
      !targetBucket ||
      !Object.values(UploadTarget).find((t) => t === targetBucket)
    ) {
      return NextResponse.json(
        {
          errorCode: ServerErrorCode.INVALID_RESOURCE_UPLOAD_REQUEST,
          message: "Invalid target",
        },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const body = new Uint8Array(arrayBuffer);
    const key = `${supplierId}/${file.name}`; // Create supplier-specific folder

    const command = new PutObjectCommand({
      Bucket: targetBucket,
      Key: key,
      Body: body,
      ContentType: file.type, // Preserve file mime type
    });

    await s3.send(command);

    const response: UploadFileResponse = {
      fileName: file.name,
      url: key,
      size: file.size,
      type: file.type,
    };

    return NextResponse.json({
      data: response,
      errorCode: ServerErrorCode.SUCCESS,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        message: `Error: ${error}`,
        errorCode: ServerErrorCode.UNEXPECTED_ERROR,
      },
      {
        status: 400,
      }
    );
  }
}
