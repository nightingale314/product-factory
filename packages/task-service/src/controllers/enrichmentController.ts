import { Request, Response } from "express";
import { EnrichProductsRequest } from "../types/enrichment";

export const enrichProducts = async (
  req: Request<{}, {}, EnrichProductsRequest>,
  res: Response
) => {
  try {
    res.json({ success: true, message: "Ok" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Task failed" });
  }
};
