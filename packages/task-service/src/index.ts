import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import enrichmentRoutes from "./routes/enrichment";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use("/", enrichmentRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
