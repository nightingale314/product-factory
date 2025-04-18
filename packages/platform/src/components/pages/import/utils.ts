import { ProductImportStep } from "@prisma/client";
import { ImportStep } from "./constants";

export const getStepFromTaskStep = (taskStep?: ProductImportStep | null) => {
  switch (taskStep) {
    case ProductImportStep.MAPPING_SELECTION:
      return ImportStep.SELECT_HEADERS;
    case ProductImportStep.PRODUCT_IMPORT:
      return ImportStep.IMPORTING;
    default:
      return ImportStep.UPLOAD_FILE;
  }
};
