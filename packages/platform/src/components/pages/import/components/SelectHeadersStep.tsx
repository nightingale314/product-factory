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

export const SelectHeadersStep = () => {
  const { headers, nextStep } = useProductImportController();
  const [selectedRow, setSelectedRow] = useState<number | null>(0);

  // Limit columns to 10
  const limitedHeaders = headers?.map((header) => ({
    columns: header.columns.slice(0, 10),
  }));

  const testClick = async () => {
    if (selectedRow === null) return;
    await createImportTask("https://www.google.com", selectedRow);
  };

  return (
    <div className="grow flex flex-col gap-4 w-full p-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="">Select the header row of your CSV file</h4>
          <p className="text-sm text-muted-foreground">
            The header row is the row that contains the reserved value of
            ATTRIBUTE_ID.
          </p>
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
                className={`border-b hover:bg-gray-50 ${
                  selectedRow === rowIndex
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : ""
                }`}
              >
                <TableCell className="p-2 flex justify-center items-center">
                  <input
                    type="radio"
                    name="headerRow"
                    checked={selectedRow === rowIndex}
                    onChange={() => setSelectedRow(rowIndex)}
                    className="h-4 w-4"
                  />
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
        <Button disabled={selectedRow === null} onClick={testClick}>
          <ArrowRight /> Next
        </Button>
      </div>
    </div>
  );
};
