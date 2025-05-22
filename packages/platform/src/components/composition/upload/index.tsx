"use client";

import { Button } from "@/components/ui/button";
import { UploadIcon } from "lucide-react";
import { useRef } from "react";

interface UploadFileButtonProps {
  onFileUpload: (file: File) => void;
}

export const UploadFileButton = ({ onFileUpload }: UploadFileButtonProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handeFileUploadClick = () => {
    inputRef.current?.click();
  };

  return (
    <>
      <Button onClick={handeFileUploadClick}>
        <UploadIcon />
        Upload File
      </Button>
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept=".csv"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            onFileUpload(file);
            e.target.value = "";
          }
        }}
      />
    </>
  );
};
