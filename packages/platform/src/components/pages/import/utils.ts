import { ProductImportStep } from "@prisma/client";
import { ImportStep } from "./constants";

export const getStepFromTaskStep = (taskStep?: ProductImportStep | null) => {
  switch (taskStep) {
    case ProductImportStep.MAPPING_SELECTION:
      return ImportStep.SET_MAPPINGS;
    case ProductImportStep.PRODUCT_IMPORT:
      return ImportStep.IMPORTING;
    case ProductImportStep.COMPLETED:
      return ImportStep.COMPLETED;
    default:
      return ImportStep.UPLOAD_FILE;
  }
};
