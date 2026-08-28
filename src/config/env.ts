import dotenv from "dotenv";

dotenv.config();

function normalizeMongoUri(value: string | undefined): string {
  if (!value) return "";

  return value
    .trim()
    .replace(/^['"]+|['"]+$/g, "")
    .replace(/^MONGO_URI\s*=\s*/i, "");
}

const rawJwtSecret = process.env.JWT_SECRET ?? "";

if (!rawJwtSecret) {
  throw new Error(
    "JWT_SECRET is not set. Add JWT_SECRET to your .env file before starting the server.",
  );
}

const corsOrigins = (process.env.CORS_ORIGINS ?? "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const env = {
  PORT: Number(process.env.PORT ?? 5000),
  NODE_ENV: process.env.NODE_ENV ?? "development",
  APP_URL: process.env.APP_URL ?? "http://localhost:5000",
  MONGO_URI: normalizeMongoUri(process.env.MONGO_URI),
  JWT_SECRET: rawJwtSecret,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? "7d",
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN ?? "15m",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET ?? rawJwtSecret,
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN ?? "7d",
  CORS_ORIGINS: corsOrigins,

  SMTP_HOST: process.env.SMTP_HOST ?? "",
  SMTP_PORT: Number(process.env.SMTP_PORT ?? 465),
  SMTP_SECURE: process.env.SMTP_SECURE === "true",
  SMTP_USER: process.env.SMTP_USER ?? "",
  SMTP_PASS: process.env.SMTP_PASS ?? "",
  MAIL_FROM: process.env.MAIL_FROM ?? "",
  FRONTEND_URL: process.env.FRONTEND_URL ?? "http://localhost:5173",
};
