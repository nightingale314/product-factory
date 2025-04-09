import { ProductImportController } from "./ProductImportController";
import { getActiveImportLoader } from "@/server-loader/product-import/getActiveImportLoader";

export const ProductImportIndex = async () => {
  // get active task if any
  const { data: activeTask } = await getActiveImportLoader();

  return <ProductImportController activeTask={activeTask} />;
};
