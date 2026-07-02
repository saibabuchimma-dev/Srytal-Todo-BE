import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDatabase } from '../config/database';
import { UserModel } from '../modules/auth/auth.model';

async function seedAdmin() {
  try {
    await connectDatabase();

    console.log('Using database:', mongoose.connection.name);

    const email = 'admin@srytal.com';
    const fullName = 'SRYTAL Admin';
    const hashedPassword = await bcrypt.hash('password123', 10);

    const result = await UserModel.updateOne(
      { email },
      {
        $set: {
          fullName,
          password: hashedPassword,
        },
        $setOnInsert: {
          email,
        },
      },
      { upsert: true }
    );

    if (result.upsertedCount > 0) {
      console.log('✅ Admin created successfully in the database');
    } else {
      console.log('✅ Admin ensured successfully in the database');
    }

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seedAdmin();