"use client";

import { useCallback, useEffect, useState } from "react";
import { apiRoutes } from "@/constants/routes";
import { ServerErrorCode } from "@/enums/common";
import { toast } from "sonner";
import { useProductImportController } from "../hooks/useProductImportController";
import { GetImportTaskOutput } from "@/types/product";
import { ProductImportStep } from "@prisma/client";
import { getStepFromTaskStep } from "../utils";
import Spinner from "@/components/ui/icons/Spinner";

const getProcessingMessage = (step?: ProductImportStep | null) => {
  switch (step) {
    case ProductImportStep.MAPPING_GENERATION:
      return "Generating mappings...";
    case ProductImportStep.PRODUCT_IMPORT:
      return "Importing products...";
    default:
      return "Processing...";
  }
};

export const PollingStep = () => {
  const [continuePolling, setContinuePolling] = useState(true);
  const { task, setTask, setStep, setShouldPoll } =
    useProductImportController();

  const fetchTask = useCallback(async () => {
    const response = await fetch(apiRoutes.import, {
      method: "POST",
      body: JSON.stringify({
        taskId: task?.id,
      }),
    });

    const data = (await response.json()) as GetImportTaskOutput;
    console.log("Polled task", data);

    if (data.errorCode !== ServerErrorCode.SUCCESS) {
      toast.error(`Error fetching task: ${data.message}`);
      setContinuePolling(false);
      return;
    }

    if (data.data?.aborted) {
      setContinuePolling(false);
      toast.error("Product import task failed, please try again.");
      return;
    }

    if (
      data.data?.step === ProductImportStep.COMPLETED ||
      data.data?.step === ProductImportStep.MAPPING_SELECTION
    ) {
      // Task has completed generating mappings or products has been imported.
      setContinuePolling(false);
      setTask(data.data);
      setStep(getStepFromTaskStep(data.data?.step));
      setShouldPoll(false);
    }

    if (
      data.data?.step === ProductImportStep.MAPPING_GENERATION ||
      data.data?.step === ProductImportStep.PRODUCT_IMPORT
    ) {
      setContinuePolling(true);
    }
  }, [task?.id]);

  useEffect(() => {
    if (!continuePolling || !task?.id) return;

    fetchTask();
    const interval = setInterval(() => {
      fetchTask();
    }, 3000);

    return () => clearInterval(interval);
  }, [continuePolling, fetchTask]);

  return (
    <div className="h-full w-full p-6 flex items-center justify-center gap-2">
      <Spinner />
      <div>{getProcessingMessage(task?.step)}</div>
    </div>
  );
};
