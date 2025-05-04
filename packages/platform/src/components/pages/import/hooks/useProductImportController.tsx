"use client";

import { ProductImportTask } from "@prisma/client";
import { parse } from "csv-parse/sync";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { ImportStep } from "../constants";
import { toast } from "sonner";

export interface ImportHeaders {
  columns: string[];
}

interface ProductImportContextType {
  headers: ImportHeaders[] | null;
  task: ProductImportTask | null;
  step: ImportStep;
  reset: () => void;
  nextStep: () => void;
  previousStep: () => void;
  onFileChange: (file: File) => void;
  setTask: (task: ProductImportTask) => void;
  file?: File | null;
}

const ProductImportContext = createContext<ProductImportContextType | null>(
  null
);

interface ProductImportProviderProps {
  children: React.ReactNode;
  activeTask: ProductImportTask | null;
  initialStep: ImportStep;
}

export const ProductImportProvider = ({
  children,
  activeTask,
  initialStep,
}: ProductImportProviderProps) => {
  const [task, setTask] = useState<ProductImportTask | null>(activeTask);
  const [file, setFile] = useState<File | null>();
  const [headers, setHeaders] = useState<ImportHeaders[] | null>(null);
  const [step, setStep] = useState<ImportStep>(initialStep);

  const getHeaders = useCallback(async (csvFile: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const rows = parse(content, {
          columns: false,
          skip_empty_lines: true,
          trim: true,
          skipRecordsWithError: true,
          relax_column_count: true,
          skip_records_with_empty_values: true,
        });

        if (rows.length < 1) {
          throw new Error("File must have at least 1 row");
        }
        const formattedRows = rows.slice(0, 6).map((row: string[]) => ({
          columns: row.map((cell) =>
            cell.length > 20 ? cell.substring(0, 20) + "..." : cell
          ),
        }));

        console.log({ formattedRows });

        setHeaders(formattedRows);
        setStep(ImportStep.SELECT_HEADERS);
      } catch (error) {
        const err = error as Error;
        console.error("Error parsing CSV:", err.message);
        toast.error(err.message);
      }
    };
    reader.readAsText(csvFile!);
  }, []);

  const onFileChange = useCallback(
    (file: File) => {
      setFile(file);
      getHeaders(file);
    },
    [getHeaders]
  );

  const nextStep = useCallback(() => {
    if (step !== null) {
      setStep(Math.min(step + 1, ImportStep.COMPLETED));
    }
  }, [step]);

  const previousStep = useCallback(() => {
    if (step !== null) {
      setStep(Math.max(step - 1, ImportStep.UPLOAD_FILE));
    }
  }, [step]);

  const reset = () => {
    setStep(ImportStep.UPLOAD_FILE);
  };

  const contextValue = useMemo(
    () => ({
      task,
      step,
      headers,
      onFileChange,
      nextStep,
      previousStep,
      reset,
      file,
      setTask,
    }),
    [task, headers, step, onFileChange, nextStep, previousStep, file, setTask]
  );

  return (
    <ProductImportContext.Provider value={contextValue}>
      {children}
    </ProductImportContext.Provider>
  );
};

export const useProductImportController = () => {
  const context = useContext(ProductImportContext);
  if (!context) {
    throw new Error(
      "useProductImportController must be used within a ProductImportProvider"
    );
  }
  return context;
};
