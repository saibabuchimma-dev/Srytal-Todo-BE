import "dotenv/config";

const rawJwtSecret = process.env.JWT_SECRET ?? "";

if (!rawJwtSecret) {
  throw new Error(
    "JWT_SECRET is not set. Add JWT_SECRET to your .env file before starting the server.",
  );
}

export const config = {
  port: Number(process.env.PORT ?? 5000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  appUrl: process.env.APP_URL ?? "http://localhost:5000",
  mongoUri: (process.env.MONGO_URI ?? "")
    .trim()
    .replace(/^['"]+|['"]+$/g, "")
    .replace(/^MONGO_URI\s*=\s*/i, ""),
  jwtSecret: rawJwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? "15m",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET ?? rawJwtSecret,
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? "7d",
  corsOrigins: (process.env.CORS_ORIGINS ?? "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  smtpHost: process.env.SMTP_HOST ?? "",
  smtpPort: Number(process.env.SMTP_PORT ?? 465),
  smtpSecure: process.env.SMTP_SECURE === "true",
  smtpUser: process.env.SMTP_USER ?? "",
  smtpPass: process.env.SMTP_PASS ?? "",
  mailFrom: process.env.MAIL_FROM ?? "",
  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:5173",
};

export * from "./database";
export * from "./multer";
export * from "./swagger";
