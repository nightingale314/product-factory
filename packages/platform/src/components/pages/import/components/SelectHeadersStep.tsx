"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { useProductImportController } from "../hooks/useProductImportController";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { createImportTask } from "@/server-actions/import/createImportTask";
import { UploadTarget } from "@/constants/upload";
import { uploadFile } from "@/lib/upload";
import { toast } from "sonner";
import { RESERVED_ATTRIBUTE_IDS } from "@product-factory/import-service/enums";

export const SelectHeadersStep = () => {
  const { headers, file, nextStep, setTask } = useProductImportController();
  const [selectedRow, setSelectedRow] = useState<number | null>(0);
  const [isLoading, setIsLoading] = useState(false);

  // Limit columns to 10
  const limitedHeaders = headers?.map((header) => ({
    columns: header.columns.slice(0, 10),
  }));

  const next = async () => {
    if (selectedRow === null || !file) return;
    setIsLoading(true);
    try {
      const selectedHeaderRow = headers?.[selectedRow];
      const isValidHeaderRow = selectedHeaderRow?.columns.some((column) =>
        Object.values(RESERVED_ATTRIBUTE_IDS).includes(
          column as RESERVED_ATTRIBUTE_IDS
        )
      );

      if (!isValidHeaderRow) {
        throw new Error(
          "Invalid header row. Ensure your selected header row contains the reserved column name of 'productName' and 'skuId'."
        );
      }

      const uploadedFileData = await uploadFile(
        file,
        UploadTarget.PRODUCT_IMPORT
      );

      const task = await createImportTask({
        fileKey: uploadedFileData.fileKey,
        headerIndex: selectedRow,
        taskType: "GENERATE_MAPPINGS",
      });

      console.log("task", task);

      if (task.errorCode || !task.data) {
        throw new Error(task.message);
      }

      setTask(task.data);
      nextStep();
    } catch (err) {
      const error = err as Error;
      toast.error(
        `Error in registering your selected headers. \n\n${error?.message}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grow flex flex-col gap-4 w-full p-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="">Select the header row of your CSV file</h4>
          <ul className="list-disc list-outside ml-4">
            <li className="text-sm text-muted-foreground">
              The header row is the row that contains the value that identifies
              your attribute.
            </li>
            <li className="text-sm text-muted-foreground">
              Ensure that the selected header row contains the reserved column
              name of &apos;productName&apos; and &apos;skuId&apos;.
            </li>
          </ul>
        </div>
      </div>
      <div className="w-full overflow-x-auto">
        <Table className="w-full border-collapse">
          <TableHeader>
            <TableRow>
              <TableHead className="w-30 text-center">Select</TableHead>
              {limitedHeaders?.[0]?.columns.map((_, index) => {
                if (index === 0) {
                  return (
                    <TableHead key={index} className="w-40">
                      Reserved Column
                    </TableHead>
                  );
                }

                return <TableHead key={index}>{`Column ${index}`}</TableHead>;
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {limitedHeaders?.map((header, rowIndex) => (
              <TableRow
                key={rowIndex}
                className={`h-full border-b hover:bg-gray-50 ${
                  selectedRow === rowIndex
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : ""
                }`}
              >
                <TableCell className="p-2 h-full">
                  <div className="flex justify-center items-center">
                    <input
                      type="radio"
                      name="headerRow"
                      checked={selectedRow === rowIndex}
                      onChange={() => setSelectedRow(rowIndex)}
                      className="h-4 w-4"
                    />
                  </div>
                </TableCell>
                {header.columns.map((column, colIndex) => (
                  <TableCell key={colIndex} className="p-2">
                    {column}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end">
        <Button
          isLoading={isLoading}
          disabled={selectedRow === null || isLoading}
          onClick={next}
        >
          <ArrowRight /> Next
        </Button>
      </div>
    </div>
  );
};
