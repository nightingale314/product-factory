import { InputWrapper } from "./InputWrapper";
import { useEffect, useState } from "react";
import { UploadButton } from "@/components/ui/media/upload-button";
import { ThumbnailGallery } from "@/components/ui/media/thumbnail-gallery";
import { ThumbnailLocal } from "@/components/ui/media/thumbnail-local";
import { Button } from "@/components/ui/button";
import chunk from "lodash/chunk";
import { uploadFile } from "@/lib/upload";
import { UploadTarget } from "@/constants/upload";
import { toast } from "sonner";
import { AttributeInputBaseType } from "./types";

interface MediaInputProps extends AttributeInputBaseType {
  onChange: (id: string, value: string[]) => void;
}

const formatValue = (value: unknown) => {
  if (Array.isArray(value)) {
    return value;
  }

  return [];
};

const generateS3URL = (fileKey: string) => {
  return `https://${UploadTarget.PRODUCT_MEDIA}.s3.amazonaws.com/${fileKey}`;
};

const BATCH_SIZE = 3;

export const MediaInput = ({
  id,
  name,
  value,
  onChange,
  lastUpdatedBy,
}: MediaInputProps) => {
  const [loading, setLoading] = useState(false);
  const [existingFiles, setExistingFiles] = useState<string[]>(
    formatValue(value)
  );
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const upload = async (file: File) => {
    try {
      const result = await uploadFile(file, UploadTarget.PRODUCT_MEDIA);
      return result;
    } catch (error) {
      toast.error(`Failed to upload ${file.name}. Please try again later.`);
      console.error(error);
      return null;
    }
  };

  const handleSave = async () => {
    setLoading(true);
    let newMediaValue: string[] = [...existingFiles];

    if (uploadedFiles.length > 0) {
      const fileBatches = chunk(uploadedFiles, BATCH_SIZE);

      const uploadedFileKeys: string[] = [];
      for (const fileBatch of fileBatches) {
        const results = await Promise.all(fileBatch.map(upload));

        uploadedFileKeys.push(
          ...results.map((i) => generateS3URL(i?.fileKey || "")).filter(Boolean)
        );
      }
      newMediaValue = [...newMediaValue, ...uploadedFileKeys];
      setUploadedFiles([]);
    }

    setExistingFiles(newMediaValue);
    onChange(id, newMediaValue);
    setLoading(false);
  };

  const reset = () => {
    setExistingFiles(formatValue(value));
    setUploadedFiles([]);
  };

  useEffect(() => {
    setExistingFiles(formatValue(value));
  }, [value]);

  return (
    <InputWrapper id={id} name={name} lastUpdatedBy={lastUpdatedBy}>
      <div className="flex flex-col gap-4 w-full border rounded p-2">
        <div className="flex items-center justify-between gap-2">
          <UploadButton
            onChange={setUploadedFiles}
            currentFiles={uploadedFiles}
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleSave}
              disabled={loading}
              isLoading={loading}
            >
              Save
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={reset}
              disabled={loading}
            >
              Reset
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            Existing image(s): {existingFiles.length}:
          </p>
          <ThumbnailGallery
            urls={existingFiles}
            onChange={setExistingFiles}
            sortable
            thumbnailClassName="w-32 h-32"
          />
        </div>
        {uploadedFiles.length > 0 ? (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">
              {uploadedFiles.length} images(s) to be uploaded:
            </p>
            <div className="flex flex-wrap gap-2">
              {uploadedFiles.map((file) => (
                <ThumbnailLocal
                  key={file.name}
                  file={file}
                  className="w-32 h-32"
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </InputWrapper>
  );
};
