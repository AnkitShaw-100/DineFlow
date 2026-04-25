import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { clerkMiddleware } from "@clerk/express";

import { healthRouter } from "./routes/health.js";
import { v1Router } from "./routes/v1/index.js";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";

export function createApp(env) {
  const app = express();

  app.set("trust proxy", 1);

  app.use(
    cors({
      origin: env.CORS_ORIGINS,
      credentials: true,
    }),
  );
  app.use(helmet());
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
  app.use(
    rateLimit({
      windowMs: 60_000,
      limit: 200,
      standardHeaders: "draft-7",
      legacyHeaders: false,
    }),
  );

  // Clerk must run early so req.auth is available
  app.use(clerkMiddleware());

  app.use(healthRouter);
  app.use("/v1", v1Router);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

