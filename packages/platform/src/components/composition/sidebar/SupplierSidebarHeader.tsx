import { User } from "@prisma/client";
import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

interface SupplierSidebarHeaderProps {
  user?: User;
}

const getSupplier = unstable_cache(
  async (supplierId: number) => {
    return await prisma.supplier.findUnique({
      where: {
        id: supplierId,
      },
    });
  },
  ["getSupplier"],
  { revalidate: 3600, tags: ["getSupplier"] }
);

export async function SupplierSidebarHeader({
  user,
}: SupplierSidebarHeaderProps) {
  if (!user) {
    return null;
  }

  const supplier = await getSupplier(user.supplierId);

  return <span className="text-base font-semibold">{supplier?.name}</span>;
}
