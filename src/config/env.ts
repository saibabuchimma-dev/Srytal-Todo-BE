import dotenv from "dotenv";

dotenv.config();

function normalizeMongoUri(value: string | undefined): string {
  if (!value) return "";

  return value
    .trim()
    .replace(/^['"]+|['"]+$/g, "")
    .replace(/^MONGO_URI\s*=\s*/i, "");
}

export const env = {
  PORT: Number(process.env.PORT ?? 5000),
  NODE_ENV: process.env.NODE_ENV ?? "development",
  MONGO_URI: normalizeMongoUri(process.env.MONGO_URI),
  JWT_SECRET: process.env.JWT_SECRET ?? "",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? "7d",

  SMTP_HOST: process.env.SMTP_HOST ?? "",
  SMTP_PORT: Number(process.env.SMTP_PORT ?? 465),
  SMTP_SECURE: process.env.SMTP_SECURE === "true",
  SMTP_USER: process.env.SMTP_USER ?? "",
  SMTP_PASS: process.env.SMTP_PASS ?? "",
  MAIL_FROM: process.env.MAIL_FROM ?? "",
};
