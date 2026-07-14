import mongoose from "mongoose";
import app from "./app";
import { connectDatabase } from "./config/database";
import { env } from "./config/env";
import { verifyMailer } from "@/utils/mailer";

async function startServer() {
  try {
    await connectDatabase();

    app.listen(env.PORT, async () => {
      console.log(`
==========================================
🚀 Server Running
🌍 URL    : http://localhost:${env.PORT}
📚 API    : http://localhost:${env.PORT}/api
💚 Health : http://localhost:${env.PORT}/health
==========================================
      `);

      await verifyMailer();
    });
  } catch (error) {
    console.error(error);

    await mongoose.disconnect();

    process.exit(1);
  }
}

startServer();
