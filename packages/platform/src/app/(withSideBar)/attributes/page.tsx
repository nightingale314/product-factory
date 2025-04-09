import { AttributesIndex } from "@/components/pages/attributes";
import { routes } from "@/constants/routes";
import { auth } from "@/lib/auth/auth";
import { PageProps } from "@/types/common";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Attributes | Product Factory",
  description: "Attributes | Product Factory",
};

const AttributesPage = async ({ searchParams }: PageProps) => {
  const session = await auth();

  if (!session?.user) {
    redirect(routes.login);
  }

  return <AttributesIndex searchParams={searchParams} />;
};

export default AttributesPage;
