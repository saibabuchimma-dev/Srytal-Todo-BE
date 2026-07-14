import bcrypt from "bcryptjs";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { env } from "@/config/env";
import { ApiError } from "@/utils/ApiError";
import { AuthRepository } from "./auth.repository";
import { JwtPayload, LoginDto } from "./auth.types";

const repository = new AuthRepository();

export class AuthService {
  async login(data: LoginDto) {
    const user = await repository.findByEmail(data.email);

    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    const isMatch = await bcrypt.compare(data.password, user.password);

    if (!isMatch) {
      throw new ApiError(401, "Invalid email or password");
    }

    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, env.JWT_SECRET as Secret, {
      expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
    });

    return {
      token,
      mustChangePassword: user.mustChangePassword,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        mustChangePassword: user.mustChangePassword,
      },
    };
  }
}
