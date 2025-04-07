import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { enrichProducts } from "../controllers/enrichmentController";

const router = Router();

router.post("/enrichment-task", authenticate, enrichProducts);

export default router;
