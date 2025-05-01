import { ProductPageHeader } from "./components/ProductsPageHeader";

export const ProductsIndex = () => {
  return (
    <div className="flex flex-col grow w-full">
      <ProductPageHeader />
      <div className="flex flex-col grow max-w-full p-6">Products</div>
    </div>
  );
};
