import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import routes from "./routes";
import { errorMiddleware } from "./middleware/error.middleware";
import { notFound } from "./middleware/not-found.middleware";
import { setupSwagger } from "./config/swagger";
import { env } from "./config/env";

const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGINS,
    credentials: true,
  }),
);

app.use(helmet());
app.use(compression());
app.use(morgan("dev"));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(cookieParser());
setupSwagger(app);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running 🚀",
  });
});

app.use("/api", routes);

app.use(notFound);
app.use(errorMiddleware);

export default app;
