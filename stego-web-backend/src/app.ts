import express from "express";
import cors from "cors";

import healthRoutes from "./routes/health.routes";
import stegoRoutes from "./routes/stego.routes";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json());

// Routes
app.use("/api/health", healthRoutes);
app.use("/api", stegoRoutes);

export default app;