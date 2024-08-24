//You need to import express
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import cors from "cors";
import financialRoutes from "./routes/financialsRoutes";
import healthRoutes from "./routes/healthRoutes";
import { corsConfig } from "./config/cors";

dotenv.config();

connectDB();

//Then you need to create your instance of express
const app = express();
app.use(cors(corsConfig));

app.use(express.json());

//Routes
app.use("/api/financials", financialRoutes);
app.use("/api/health", healthRoutes);

//Export default your instance so you can use your server
export default app;
