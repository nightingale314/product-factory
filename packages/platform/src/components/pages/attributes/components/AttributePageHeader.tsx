"use client";

import { PageHeader } from "@/components/composition/page-header";
import { CreateAttributeModal } from "./create-attribute-modal/CreateAttributeModal";
import { revalidateAction } from "@/server-actions/revalidate";

export const AttributePageHeader = () => {
  const handleCreateAttributeSuccess = () => {
    revalidateAction("/attributes");
  };

  return (
    <div>
      <PageHeader title="Attributes">
        <CreateAttributeModal onCreateSuccess={handleCreateAttributeSuccess} />
      </PageHeader>
    </div>
  );
};
