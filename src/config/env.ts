import dotenv from 'dotenv';

dotenv.config();

function normalizeMongoUri(value: string | undefined): string {
  if (!value) return '';

  return value
    .trim()
    .replace(/^['"]+|['"]+$/g, '')
    .replace(/^MONGO_URI\s*=\s*/i, '');
}

export const env = {
  PORT: Number(process.env.PORT ?? 5000),
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  MONGO_URI: normalizeMongoUri(process.env.MONGO_URI),
  JWT_SECRET: process.env.JWT_SECRET ?? '',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '7d',
};