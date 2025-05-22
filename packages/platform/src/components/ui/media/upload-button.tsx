import { ChangeEvent } from "react";
import { useRef } from "react";
import { Button } from "../button";
import { toast } from "sonner";
import { Plus } from "lucide-react";

interface UploadButtonProps {
  maxFiles?: number;
  currentFiles: File[];
  maxSize?: number;
  onChange: (newFiles: File[]) => void;
}

export const UploadButton = ({
  onChange,
  maxFiles = 10,
  currentFiles,
  maxSize = 1024 * 1024 * 5,
}: UploadButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const remainingFileLimit = maxFiles - currentFiles.length;

    if (files.length > remainingFileLimit) {
      toast.error(`You can only upload up to ${remainingFileLimit} files.`);
      return;
    }

    // Filter valid image files
    const validFiles = files
      .filter((f) => ["image/jpeg", "image/png", "image/jpg"].includes(f.type))
      .filter((f) => f.size <= maxSize);

    if (validFiles.length === 0) {
      toast.error(
        "Selected files are not valid images. Please check their format and size."
      );
      return;
    }

    if (validFiles.length !== files.length) {
      toast.warning(
        "Selected files contained invalid images which were dropped."
      );
    }

    onChange([...currentFiles, ...validFiles]);
    event.target.value = "";
  };

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        accept=".jpg,.jpeg,.png"
        multiple
        hidden
        style={{ display: "none" }}
        onChange={handleFilesChange}
      />
      <Button variant="link" size="sm" onClick={handleUpload}>
        <Plus className="w-4 h-4" />
        Upload file
      </Button>
    </>
  );
};
