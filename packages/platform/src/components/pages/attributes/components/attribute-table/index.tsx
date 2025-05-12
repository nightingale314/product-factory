import { AttributeDataTable } from "./AttributeDataTable";
import { listAttributeLoader } from "@/server-loader/attributes/listAttributeLoader";
import { PageProps } from "@/types/common";
import { loadQueryValues } from "@/lib/parsers/helpers";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/constants/common";
import { paginationParser } from "@/lib/parsers/common-parsers";

export const AttributeTable = async ({ searchParams }: PageProps) => {
  const queryValues = await loadQueryValues(searchParams);
  const { page = DEFAULT_PAGE, pageSize = DEFAULT_PAGE_SIZE } =
    paginationParser(queryValues);

  const { data } = await listAttributeLoader({
    pagination: { page, pageSize },
  });

  return (
    <div className="container mx-auto">
      <AttributeDataTable
        data={data?.result ?? []}
        total={data?.total ?? 0}
        initialQueryValues={queryValues}
      />
    </div>
  );
};
