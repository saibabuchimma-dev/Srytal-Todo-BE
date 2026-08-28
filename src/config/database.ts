import mongoose from "mongoose";
import "dotenv/config";

function normalizeMongoUri(value: string | undefined): string {
  if (!value) return "";

  return value
    .trim()
    .replace(/^['"]+|['"]+$/g, "")
    .replace(/^MONGO_URI\s*=\s*/i, "");
}

export async function connectDatabase() {
  try {
    await mongoose.connect(normalizeMongoUri(process.env.MONGO_URI));

    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed");
    console.error(error);
    process.exit(1);
  }
}
