import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDatabase } from "../config/database";
import { Employee } from "../modules/employee/employee.model";

async function seedAdmin() {
  try {
    await connectDatabase();

    const email = "admin@srytal.com";
    const fullName = "SRYTAL Admin";

    const employeeCollection = mongoose.connection.collection("employees");
    const indexes = await employeeCollection.indexes();
    const hasLegacyEmployeeIdIndex = indexes.some(
      (index) => index.name === "employeeId_1",
    );

    if (hasLegacyEmployeeIdIndex) {
      await employeeCollection.dropIndex("employeeId_1");
      console.log("Dropped legacy employeeId index");
    }

    const hashedPassword = await bcrypt.hash("password123", 10);

    const result = await Employee.updateOne(
      { email },
      {
        $set: {
          fullName,
          password: hashedPassword,
          role: "Admin",
          isActive: true,
          avatar: "",
        },
      },
      {
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );

    if (result.upsertedCount > 0) {
      console.log("✅ Admin created successfully");
    } else {
      console.log("✅ Admin updated successfully");
    }
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedAdmin();
