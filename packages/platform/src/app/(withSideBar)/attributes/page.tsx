import { AttributesIndex } from "@/components/pages/attributes";
import { getAuthSession } from "@/lib/auth/getAuthSession";
import { PageProps } from "@/types/common";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Attributes | Product Factory",
  description: "Attributes | Product Factory",
};

const AttributesPage = async ({ searchParams }: PageProps) => {
  await getAuthSession();

  return <AttributesIndex searchParams={searchParams} />;
};

export default AttributesPage;
