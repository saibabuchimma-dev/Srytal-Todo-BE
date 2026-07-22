import path from "path";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes";
import { errorMiddleware } from "./middleware/error.middleware";
import { notFound } from "./middleware/not-found.middleware";
import { setupSwagger } from "./config/swagger";
import employeeRoutes from "@/modules/employee/employee.routes";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(helmet());
app.use(compression());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

setupSwagger(app);

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running 🚀",
  });
});

app.use("/api", routes);
app.use("/api/employees", employeeRoutes);

app.use(notFound);
app.use(errorMiddleware);

export default app;
