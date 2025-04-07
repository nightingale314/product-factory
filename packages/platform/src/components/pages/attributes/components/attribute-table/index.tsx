import { AttributeDataTable } from "./AttributeDataTable";
import { listAttributeLoader } from "@/server-loader/attributes/listAttributeLoader";
import { PageProps } from "@/types/common";
import { listAttributesSearchParamsLoader } from "../../search-params/listAttributes";

export const AttributeTable = async ({ searchParams }: PageProps) => {
  const { page, pageSize } = await listAttributesSearchParamsLoader(
    searchParams
  );

  const { data } = await listAttributeLoader({
    pagination: { page, pageSize },
  });

  return (
    <div className="container mx-auto">
      <AttributeDataTable data={data?.result ?? []} total={data?.total ?? 0} />
    </div>
  );
};
