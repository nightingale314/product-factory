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

interface SelectHeadersStepProps {
  headers: ImportHeaders[] | null;
}

export interface ImportHeaders {
  columns: string[];
}

export const SelectHeadersStep = ({ headers }: SelectHeadersStepProps) => {
  const [selectedRow, setSelectedRow] = useState<number | null>(0);

  // Limit columns to 10
  const limitedHeaders = headers?.map((header) => ({
    columns: header.columns.slice(0, 10),
  }));

  return (
    <div className="grow flex flex-col gap-4 w-full px-6 py-10">
      <div>
        <h1 className="mb-2">Snapshot of your CSV</h1>
        <p>Below is a truncated view of your CSV, showing up to 6 rows.</p>
        <p>Please select the row that contains the headers of your CSV file.</p>
      </div>

      <div className="w-full overflow-x-auto">
        <Table className="w-full border-collapse">
          <TableHeader>
            <TableRow>
              <TableHead className="w-30 text-center">Select header</TableHead>
              {limitedHeaders?.map((_, index) => {
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
    </div>
  );
};
