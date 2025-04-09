"use client";

import { useEffect, useState } from "react";
import { ImportStep } from "./constants";
import { ImportFileStep } from "./importFileStep";
import { ReviewStep } from "./ReviewStep";
import { ImportHeaders, SelectHeadersStep } from "./SelectHeadersStep";
import { SetMappingsStep } from "./SetMappingsStep";
import { ProductImportStep, ProductImportTask } from "@prisma/client";
import { parse } from "csv-parse/sync";

interface ProductImportControllerProps {
  activeTask: ProductImportTask | null;
}

const getStepFromTaskStep = (taskStep: ProductImportStep | null) => {
  switch (taskStep) {
    case ProductImportStep.MAPPING_SELECTION:
      return ImportStep.SELECT_HEADERS;
    case ProductImportStep.PRODUCT_IMPORT:
      return ImportStep.IMPORTING;
    default:
      return ImportStep.UPLOAD_FILE;
  }
};

export const ProductImportController = ({
  activeTask,
}: ProductImportControllerProps) => {
  const [, setTask] = useState<ProductImportTask | null>(null);
  const [step, setStep] = useState<ImportStep | undefined>(undefined);
  const [headers, setHeaders] = useState<ImportHeaders[] | null>(null);

  const nextStep = () => {
    if (step !== undefined) {
      setStep(step + 1);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const previousStep = () => {
    if (step !== undefined) {
      setStep(Math.max(step - 1, ImportStep.UPLOAD_FILE));
    }
  };

  const getHeaders = async (csvFile: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const rows = parse(content, {
          columns: false,
          skip_empty_lines: true,
          from_line: 1,
          to_line: 6,
          trim: true,
        });

        const formattedRows = rows.map((row: string[]) => ({
          columns: row.map((cell) =>
            cell.length > 20 ? cell.substring(0, 20) + "..." : cell
          ),
        }));

        setHeaders(formattedRows);
      } catch (error) {
        const err = error as Error;
        console.error("Error parsing CSV:", err.message);
      }
    };
    reader.readAsText(csvFile!);
  };

  const onFileChange = async (file: File) => {
    getHeaders(file);
    nextStep();
  };

  useEffect(() => {
    setTask(activeTask);

    if (activeTask) {
      setStep(getStepFromTaskStep(activeTask.step));
    } else {
      setStep(ImportStep.UPLOAD_FILE);
    }
  }, [activeTask]);

  if (step === ImportStep.UPLOAD_FILE) {
    return <ImportFileStep onUploadSuccess={onFileChange} />;
  }

  if (step === ImportStep.SELECT_HEADERS) {
    return <SelectHeadersStep headers={headers} />;
  }

  if (step === ImportStep.SET_MAPPINGS) {
    return <SetMappingsStep />;
  }

  if (step === ImportStep.COMPLETED) {
    return <ReviewStep />;
  }

  return <div>Loading...</div>;
};
