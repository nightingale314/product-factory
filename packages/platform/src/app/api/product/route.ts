import { NextResponse } from "next/server";
import { getProductLoader } from "@/server-loader/products/getProductLoader";
import { ServerErrorCode } from "@/enums/common";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const skuId = searchParams.get("skuId");

  if (!skuId) {
    return NextResponse.json(
      {
        errorCode: ServerErrorCode.PRODUCT_INVALID_REQUEST,
        message: "SKU ID is required",
        data: null,
      },
      { status: 400 }
    );
  }

  const response = await getProductLoader({ skuId });
  return NextResponse.json(response);
}
