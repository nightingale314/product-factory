import { hash } from "bcrypt";
import { PrismaClient } from "./backend/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  const password = await hash("password123", 10);

  const supplier = await prisma.supplier.create({
    data: {
      name: "Test Supplier",
    },
  });

  await prisma.user.create({
    data: {
      email: "test@example.com",
      name: "Test User",
      passwordHash: password,
      supplierId: supplier.id,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
