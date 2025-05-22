import { UploadTarget } from "@/constants/upload";

export type UploadFileResponse = {
  fileKey: string;
  fileName: string;
  size: number;
  type: string;
};

export type UploadFileRequest = {
  file: File;
  targetBucket: UploadTarget;
};
