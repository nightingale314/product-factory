import { apiRoutes } from "@/constants/routes";
import { ProductWithAttributes } from "@/types/product";
import { useEffect, useState } from "react";

interface UseGetProduct {
  skuId: string;
  initialData?: ProductWithAttributes;
}

export const useGetProduct = ({ skuId, initialData }: UseGetProduct) => {
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState<ProductWithAttributes | null>(
    initialData ?? null
  );
  const [lastFetched, setLastFetched] = useState<number>(0);

  const fetchProduct = async (skuId: string) => {
    setIsLoading(true);
    const response = await fetch(`${apiRoutes.product}?skuId=${skuId}`);
    const data = await response.json();
    setProduct(data);
    setIsLoading(false);
    setLastFetched(Date.now());
  };

  useEffect(() => {
    // if (Date.now() - lastFetched > 10000) {
    //   fetchProduct(skuId);
    // }
    setProduct(initialData ?? null);
  }, [initialData, skuId, lastFetched]);

  return { product, fetchProduct, isLoading, setProduct };
};
