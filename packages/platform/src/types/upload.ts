import { UploadTarget } from "@/constants/upload";

export type UploadFileResponse = {
  url: string;
  fileName: string;
  size: number;
  type: string;
};

export type UploadFileRequest = {
  file: File;
  targetBucket: UploadTarget;
};
