"use client";

import { DataTable } from "@/components/composition/table/data-table";
import { Attribute } from "@prisma/client";
import { useQueryStates } from "nuqs";
import { listAtttributesParser } from "../../search-params/listAttributes";
import { useAttributeTableColumns } from "./Columns";
import { EditAttributeModal } from "../attribute-modal/edit-attribute-modal/EditAttributeModal";
import { useEffect, useState } from "react";

interface AttributeDataTableProps {
  data: Attribute[];
  total: number;
}

export function AttributeDataTable({ data, total }: AttributeDataTableProps) {
  const [tableData, setTableData] = useState(data);
  const [{ page, pageSize }, setQueryState] = useQueryStates(
    listAtttributesParser,
    {
      shallow: false,
    }
  );
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
          setQueryState({ page: newPage, pageSize: newPageSize });
        }}
      />
    </>
  );
}
