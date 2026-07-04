import mongoose from "mongoose";
import app from "./app";
import { connectDatabase } from "./config/database";
import { env } from "./config/env";

async function startServer() {
  try {
    await connectDatabase();

    app.listen(env.PORT, () => {
      console.log(`
    ==========================================
    🚀 Server Running
    🌍 URL    : http://localhost:${env.PORT}
    📚 API    : http://localhost:${env.PORT}/api
    💚 Health : http://localhost:${env.PORT}/health
    ==========================================
      `);
    });
  } catch (error) {
    console.error(error);

    await mongoose.disconnect();

    process.exit(1);
  }
}

startServer();
