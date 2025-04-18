"use client";

import { ImportStep } from "../constants";
import { ImportFileStep } from "./importFileStep";
import { ReviewStep } from "./ReviewStep";
import { SelectHeadersStep } from "./SelectHeadersStep";
import { SetMappingsStep } from "./SetMappingsStep";
import { useProductImportController } from "../hooks/useProductImportController";

export const StepRender = () => {
  const { step } = useProductImportController();

  switch (step) {
    case ImportStep.UPLOAD_FILE:
      return <ImportFileStep />;
    case ImportStep.SELECT_HEADERS:
      return <SelectHeadersStep />;
    case ImportStep.SET_MAPPINGS:
      return <SetMappingsStep />;
    case ImportStep.COMPLETED:
      return <ReviewStep />;

    default:
      return <ImportFileStep />;
  }
};
