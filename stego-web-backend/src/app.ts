import express from "express";
import cors from "cors";

import healthRoutes from "./routes/health.routes";
import stegoRoutes from "./routes/stego.routes";
import downloadRoutes from "./routes/download.routes";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json());

// Health routes
app.use(
  "/api/health",
  healthRoutes
);

// Stegonography routes
app.use(
  "/api",
  stegoRoutes
);

// Download routes
app.use(
  "/api/download",
  downloadRoutes
);

export default app;