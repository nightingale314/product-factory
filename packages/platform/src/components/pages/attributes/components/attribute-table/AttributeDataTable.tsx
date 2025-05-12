"use client";

import { DataTable } from "@/components/composition/table/data-table";
import { Attribute } from "@prisma/client";
import { useAttributeTableColumns } from "./Columns";
import { EditAttributeModal } from "../attribute-modal/edit-attribute-modal/EditAttributeModal";
import { useEffect, useState } from "react";
import { useQueryParams } from "@/hooks/use-query-state";
import { QueryOperator, QueryType } from "@/lib/parsers/enums";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/constants/common";
import { QueryValue } from "@/lib/parsers/parsers";
import { paginationParser } from "@/lib/parsers/common-parsers";

interface AttributeDataTableProps {
  data: Attribute[];
  total: number;
  initialQueryValues: Map<string, QueryValue>;
}

export function AttributeDataTable({
  data,
  total,
  initialQueryValues,
}: AttributeDataTableProps) {
  const [tableData, setTableData] = useState(data);
  const { queryValues, setQueryValues } = useQueryParams({
    initialQueryValues,
  });

  const { page = DEFAULT_PAGE, pageSize = DEFAULT_PAGE_SIZE } =
    paginationParser(queryValues);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedAttribute, setSelectedAttribute] = useState<Attribute>();

  const columns = useAttributeTableColumns({
    onAttributeClick: (attribute) => {
      setSelectedAttribute(attribute);
      setOpenEditModal(true);
    },
  });

  useEffect(() => {
    setTableData(data);
  }, [data]);

  return (
    <>
      {selectedAttribute && (
        <EditAttributeModal
          open={openEditModal}
          setOpen={setOpenEditModal}
          initialAttribute={selectedAttribute}
          onEditSuccess={(attribute) => {
            setTableData(
              tableData.map((attr) =>
                attr.id === attribute.id ? attribute : attr
              )
            );
          }}
        />
      )}
      <DataTable
        columns={columns}
        data={tableData}
        total={total}
        pageSize={pageSize}
        page={page}
        onPaginationChange={(newPage, newPageSize) => {
          setQueryValues([
            {
              key: "page",
              type: QueryType.STRING,
              operator: QueryOperator.EQUALS,
              value: newPage.toString(),
            },
            {
              key: "pageSize",
              type: QueryType.STRING,
              operator: QueryOperator.EQUALS,
              value: newPageSize.toString(),
            },
          ]);
        }}
      />
    </>
  );
}
