"use client";

import { UploadFileButton } from "@/components/composition/upload";
import { parse } from "csv-parse/sync";
import { toast } from "sonner";
import { useProductImportController } from "../hooks/useProductImportController";

export const ImportFileStep = () => {
  const { onFileChange } = useProductImportController();

  const verifyFile = async (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const rows = parse(content, {
          columns: false,
          skip_empty_lines: true,
          from_line: 1,
          to_line: 3,
          trim: true,
        });

        if (rows.length < 2) {
          throw new Error("File must have at least 2 rows");
        }

        const [header, firstRow] = rows;
        if (header[0] !== "ATTRIBUTE_ID") {
          throw new Error('First column header must be "ATTRIBUTE_ID"');
        }

        if (header[1] !== "skuId") {
          throw new Error('Second column header must be "skuId"');
        }

        if (header[2] !== "name") {
          throw new Error('Third column header must be "name"');
        }

        if (firstRow[0] !== "ATTRIBUTE_NAME") {
          throw new Error(
            'Second row in first column must be "ATTRIBUTE_NAME"'
          );
        }

        toast.success("File validated successfully");
        onFileChange(file);
      } catch (error) {
        const err = error as Error;
        toast.error(err.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="grow flex flex-col gap-4 items-center justify-center">
      <UploadFileButton onFileUpload={verifyFile} />
      <p className="text-sm text-muted-foreground">
        Upload a CSV file with products using the given template.
      </p>
    </div>
  );
};
