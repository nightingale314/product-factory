"use client";

import { ImportStep } from "../constants";
import { ReviewStep } from "./ReviewStep";
import { SelectHeadersStep } from "./SelectHeadersStep";
import { SetMappingsStep } from "./SetMappingsStep";
import { useProductImportController } from "../hooks/useProductImportController";
import { lazy } from "react";
import { PollingStep } from "./PollingStep";

const LazyLoadImportFileStep = lazy(() =>
  import("./importFileStep").then((mod) => ({ default: mod.ImportFileStep }))
);

export const StepRender = () => {
  const { step, shouldPoll } = useProductImportController();

  if (shouldPoll) {
    return <PollingStep />;
  }

  switch (step) {
    case ImportStep.UPLOAD_FILE:
      return <LazyLoadImportFileStep />;
    case ImportStep.SELECT_HEADERS:
      return <SelectHeadersStep />;
    case ImportStep.SET_MAPPINGS:
      return <SetMappingsStep />;
    case ImportStep.COMPLETED:
      return <ReviewStep />;

    default:
      return <LazyLoadImportFileStep />;
  }
};
