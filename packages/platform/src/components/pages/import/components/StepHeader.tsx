"use client";

import {
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ImportStep } from "../constants";
import { useProductImportController } from "../hooks/useProductImportController";

export const StepHeader = () => {
  const { step: currentStep } = useProductImportController();

  const getTextColor = (step: ImportStep) => {
    return step === currentStep ? "text-primary" : "text-muted-foreground";
  };

  return (
    <div className="p-4 flex items-center justify-center">
      <Breadcrumb>
        <BreadcrumbList className="justify-center">
          <BreadcrumbItem>
            <BreadcrumbPage className={getTextColor(ImportStep.UPLOAD_FILE)}>
              1. Upload CSV
            </BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className={getTextColor(ImportStep.SELECT_HEADERS)}>
              2. Select Headers
            </BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className={getTextColor(ImportStep.SET_MAPPINGS)}>
              3. Set Mappings
            </BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className={getTextColor(ImportStep.COMPLETED)}>
              4. Review
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};
