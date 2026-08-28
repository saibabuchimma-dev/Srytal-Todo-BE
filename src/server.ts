import "module-alias/register";
import mongoose from "mongoose";
import app from "./app";
import { connectDatabase } from "./config/database";
import { config } from "./config";
import { verifyMailer } from "@/utils/mailer";

async function startServer() {
  try {
    await connectDatabase();

    app.listen(config.port, async () => {
      console.log(`
==========================================
🚀 Server Running
🌍 URL    : http://localhost:${config.port}
📚 API    : http://localhost:${config.port}/api
💚 Health : http://localhost:${config.port}/health
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
