import { NextResponse } from "next/server";
import { GetImportTaskInput } from "@/types/product";
import { getImportTaskLoader } from "@/server-loader/product-import/getImportTaskLoader";

export async function POST(request: Request) {
  const input = (await request.json()) as GetImportTaskInput;
  const response = await getImportTaskLoader(input);
  return NextResponse.json(response);
}
