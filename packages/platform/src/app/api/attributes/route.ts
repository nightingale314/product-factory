import { NextResponse } from "next/server";
import { listAttributeLoader } from "@/server-loader/attributes/listAttributeLoader";
import { ListAttributeInput } from "@/types/attribute";

export async function POST(request: Request) {
  const input = (await request.json()) as ListAttributeInput;
  const response = await listAttributeLoader(input);
  return NextResponse.json(response);
}
