import { PageHeader } from "@/components/composition/page-header";
import { CreateAttributeModal } from "./components/create-attribute-modal/CreateAttributeModal";

export const AttributesIndex = () => {
  return (
    <div className="flex flex-col grow w-full">
      <PageHeader title="Attributes">
        <CreateAttributeModal />
      </PageHeader>
    </div>
  );
};
