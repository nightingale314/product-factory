"use client";

import { Attribute } from "@prisma/client";
import { useProductImportController } from "../hooks/useProductImportController";
import { useEffect, useState } from "react";
import { apiRoutes } from "@/constants/routes";
import { ServerErrorCode } from "@/enums/common";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ImportProductsAttributeMapping } from "@product-factory/import-service/lib/generateProductsFromMappings";
import { createImportTask } from "@/server-actions/import/createImportTask";
import { cancelImportTask } from "@/server-actions/import/cancelImportTask";
import { cn } from "@/lib/utils";
import { SetHeadersSkeleton } from "./skeleton/SetHeadersSkeleton";
import { Instructions } from "./Instructions";

type Mapping = {
  row: string;
  score: number;
  columnIndex: number;
  matchedAttributeId: string;
};

type AttributeMappings = ImportProductsAttributeMapping;

const RESERVED_ATTRIBUTEs = [
  {
    id: "productName",
    name: "Product Name",
  },
  {
    id: "skuId",
    name: "SKU ID",
  },
];

const getScoreColor = (score: number) => {
  if (score > 0.7) {
    return "text-green-500";
  }

  if (score >= 0.4) {
    return "text-yellow-500";
  }

  return "text-red-500";
};

const findDuplicateTargetAttributeIds = (
  mappings: { targetAttributeId: string; columnIndex: number }[]
): number[] => {
  const attrToIndices = new Map<string, number[]>();
  mappings.forEach((mapping, idx) => {
    if (!attrToIndices.has(mapping.targetAttributeId)) {
      attrToIndices.set(mapping.targetAttributeId, []);
    }
    attrToIndices.get(mapping.targetAttributeId)!.push(idx);
  });
  // Return all indices where the targetAttributeId appears more than once
  return Array.from(attrToIndices.values())
    .filter((indices) => indices.length > 1)
    .flat();
};
export const SetMappingsStep = () => {
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const { task, nextStep, reset } = useProductImportController();
  const [attributeMappings, setAttributeMappings] = useState<
    AttributeMappings[]
  >([]);

  const mappings = task?.mappings as Mapping[];

  const next = async () => {
    if (!task?.id) {
      toast.error("Task not found");
      return;
    }

    const isValidMapping = mappings.every(
      (mapping) => mapping.matchedAttributeId
    );

    if (!isValidMapping) {
      toast.error("Please select a target attribute for each mapping.");
      return;
    }

    if (!attributeMappings.find((attr) => attr.targetAttributeId === "skuId")) {
      toast.error("Missing mapping for SKU ID");
      return;
    }

    if (
      !attributeMappings.find(
        (attr) => attr.targetAttributeId === "productName"
      )
    ) {
      toast.error("Missing mapping for Product Name");
      return;
    }

    const duplicateIndices = findDuplicateTargetAttributeIds(attributeMappings);

    if (duplicateIndices.length > 0) {
      toast.error(
        `Duplicate target attributes for columns: ${duplicateIndices.join(
          ", "
        )}`
      );
      return;
    }

    setLoading(true);

    const updatedTask = await createImportTask({
      taskId: task.id,
      taskType: "IMPORT",
      selectedMappings: attributeMappings,
    });

    if (updatedTask.errorCode !== ServerErrorCode.SUCCESS) {
      toast.error(`Error updating task: ${updatedTask.message}`);
    } else {
      nextStep({ shouldPoll: true });
    }
  };

  const fetchAttributes = async () => {
    setInitializing(true);
    const response = await fetch(apiRoutes.attributes, {
      method: "POST",
      body: JSON.stringify({
        pagination: {
          page: 1,
          pageSize: 1000,
        },
      }),
    });

    const data = await response.json();

    if (data.errorCode !== ServerErrorCode.SUCCESS) {
      toast.error(`Error fetching attributes: ${data.message}`);
    } else {
      setAttributes(data.data.result);
    }

    setInitializing(false);
  };

  const cancel = async () => {
    if (task?.id) {
      setLoading(true);
      const response = await cancelImportTask({
        taskId: task?.id,
      });

      if (response.errorCode !== ServerErrorCode.SUCCESS) {
        toast.error(`Error cancelling task: ${response.message}`);
        setLoading(false);
      } else {
        reset();
      }
    }
  };

  useEffect(() => {
    if (task?.mappings) {
      setAttributeMappings(
        (task.mappings as Mapping[])?.map((mapping) => ({
          targetAttributeId: mapping.matchedAttributeId,
          columnIndex: mapping.columnIndex,
        }))
      );
    }
    fetchAttributes();
  }, []);

  if (initializing) {
    return (
      <div className="px-6 pt-12">
        <SetHeadersSkeleton />
      </div>
    );
  }

  return (
    <div className="grow flex flex-col gap-4 w-full p-6">
      <Instructions
        title="Select the target attribute for each column"
        instructions={[
          "A default mapping is generated for each attribute, attached with a confidence score",
          "The header row is the row that contains the value that identifies your attribute.",
          "Ensure that both 'productName' and 'skuId' are mapped to an attribute.",
        ]}
      />
      <div className="flex justify-between">
        <Button
          disabled={initializing || loading || !attributes.length}
          onClick={cancel}
          variant="outline"
        >
          Cancel
        </Button>
        <Button
          isLoading={initializing || loading}
          disabled={initializing || loading}
          onClick={next}
        >
          <ArrowRight /> Next
        </Button>
      </div>
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Column Index</TableHead>
            <TableHead className="text-right w-1/2">
              Name of your CSV column
            </TableHead>
            <TableHead className="w-1/2">Target attribute</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mappings.map((mapping) => (
            <TableRow key={mapping.columnIndex} className="border-b px-4 py-2">
              <TableCell>{mapping.columnIndex}</TableCell>
              <TableCell className="text-right">{mapping.row}</TableCell>
              <TableCell>
                <Select
                  value={
                    attributeMappings.find(
                      (attr) => attr.columnIndex === mapping.columnIndex
                    )?.targetAttributeId
                  }
                  onValueChange={(value) => {
                    setAttributeMappings(
                      attributeMappings.map((attr) => {
                        if (attr.columnIndex === mapping.columnIndex) {
                          return { ...attr, targetAttributeId: value };
                        }
                        return attr;
                      })
                    );
                  }}
                >
                  <SelectTrigger className="min-w-0">
                    <SelectValue placeholder="Select target attribute" />
                  </SelectTrigger>
                  <SelectContent side="bottom">
                    {[...RESERVED_ATTRIBUTEs, ...attributes].map((attr) => {
                      const score =
                        attr.id === mapping.matchedAttributeId
                          ? mapping.score
                          : null;
                      return (
                        <SelectItem key={attr.id} value={`${attr.id}`}>
                          {attr.name}
                          {score !== null && (
                            <span className={cn(getScoreColor(score))}>
                              Confidence: {score.toFixed(2)}
                            </span>
                          )}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
