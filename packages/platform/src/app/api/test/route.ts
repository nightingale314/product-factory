import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const suppliers = await prisma.supplier.findMany();
  console.log(suppliers);

  return NextResponse.json({ suppliers });
}
