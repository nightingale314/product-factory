"use client";

import { useProductImportController } from "../hooks/useProductImportController";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { routes } from "@/constants/routes";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Table } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { InfoIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const ReviewStep = () => {
  const { task } = useProductImportController();

  const router = useRouter();

  const finish = () => {
    router.push(routes.products.root);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parseRowWithIssues = (rowWithIssues: any[]) => {
    return rowWithIssues.map((issue) => {
      return {
        rowIndex: issue.rowIndex,
        error: issue?.error,
      };
    });
  };

  const issues = Array.isArray(task?.rowWithIssues) ? task?.rowWithIssues : [];

  return (
    <div className="grow flex flex-col gap-8 w-full items-center justify-center p-8 bg-white">
      <Table className="w-full max-w-md mx-auto">
        <TableBody>
          <TableRow>
            <TableCell>Task ID</TableCell>
            <TableCell className="text-right">{task?.id ?? "N/A"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Product(s) imported</TableCell>
            <TableCell className="text-right">
              {task?.totalProductsImported ?? 0}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <div className="flex items-center gap-2">
                Product(s) skipped{" "}
                <Tooltip>
                  <TooltipTrigger>
                    {" "}
                    <InfoIcon className="w-4 h-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Total duplicated products and rows with issues
                  </TooltipContent>
                </Tooltip>
              </div>
            </TableCell>
            <TableCell className="text-right">
              {task?.totalProductsSkipped ?? 0}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <div className="flex flex-col gap-2 w-full max-w-xl">
        <div className="text-sm">Issue Log:</div>
        {issues.length > 0 && (
          <ScrollArea className="w-full h-32 text-sm border rounded p-4 text-muted-foreground">
            {parseRowWithIssues(issues).map((issue) => (
              <div key={issue.rowIndex}>
                <span>Row {issue.rowIndex} skipped:</span> {issue.error}
              </div>
            ))}
          </ScrollArea>
        )}
      </div>

      <Button onClick={finish}>Finish</Button>
    </div>
  );
};
