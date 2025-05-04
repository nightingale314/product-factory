import { UploadTarget } from "@/constants/upload";
import { ServerErrorCode } from "@/enums/common";
import { UploadFileResponse } from "@/types/upload";

export const uploadFile = async (
  file: File,
  targetBucket: UploadTarget
): Promise<UploadFileResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("targetBucket", targetBucket);

  const uploadedFile = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const uploadedFileData = await uploadedFile.json();

  if (uploadedFileData.errorCode !== ServerErrorCode.SUCCESS) {
    throw new Error("Failed to upload file. Please try again later.");
  }

  return uploadedFileData.data as UploadFileResponse;
};
