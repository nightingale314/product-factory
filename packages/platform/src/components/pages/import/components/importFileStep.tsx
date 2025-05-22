"use client";

import { UploadFileButton } from "@/components/composition/upload";
import { parse } from "csv-parse/sync";
import { toast } from "sonner";
import { useProductImportController } from "../hooks/useProductImportController";
import { Instructions } from "./Instructions";

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
          trim: true,
        });

        if (rows.length < 2) {
          throw new Error("File must have at least 2 rows");
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
      <Instructions
        title="Import value guidelines"
        instructions={[
          "For Select and Multi-Select attributes, the values must be comma-separated.",
          "For Measure attributes, the values must be in the format of '{value} {unit}'.",
          "For Media attributes, the values must be comma-separated URLs.",
          "For Boolean attributes, the values must be 'true' or 'false', case-insensitive.",
          "If the above guidelines are not followed, the value will not be mapped.",
        ]}
      />
      <UploadFileButton onFileUpload={verifyFile} />
      <p className="text-sm text-muted-foreground">
        Upload a CSV file with products using the given template.
      </p>
    </div>
  );
};
