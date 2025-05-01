import { getActiveImportLoader } from "@/server-loader/product-import/getActiveImportLoader";
import { ProductImportProvider } from "./hooks/useProductImportController";
import { getStepFromTaskStep } from "./utils";
import { StepRender } from "./components/StepContent";
import { StepHeader } from "./components/StepHeader";

export const ImportContent = async () => {
  const { data: activeTask } = await getActiveImportLoader();

  const initialStep = getStepFromTaskStep(activeTask?.step);

  return (
    <ProductImportProvider activeTask={activeTask} initialStep={initialStep}>
      <div className="flex flex-col grow">
        <StepHeader />
        <div className="flex flex-col grow border rounded-md relative">
          <StepRender />
        </div>
      </div>
    </ProductImportProvider>
  );
};
