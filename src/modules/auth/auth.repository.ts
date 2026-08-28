import { Employee } from "../employee/employee.model";
import { AuthToken } from "./authToken.model";

export class AuthRepository {
  async findByEmail(email: string) {
    return Employee.findOne({ email }).select("+password");
  }

  async findById(id: string) {
    return Employee.findById(id);
  }

  async updateLastLogin(id: string) {
    return Employee.findByIdAndUpdate(id, {
      lastLogin: new Date(),
    });
  }

  async createRefreshToken(data: {
    user: string;
    token: string;
    expiresAt: Date;
  }) {
    return AuthToken.create(data);
  }

  async findRefreshToken(token: string) {
    return AuthToken.findOne({ token });
  }

  async revokeRefreshToken(
    id: string,
    replacedByToken: string | null = null,
  ) {
    return AuthToken.findByIdAndUpdate(id, {
      revoked: true,
      revokedAt: new Date(),
      replacedByToken,
    });
  }

  async revokeAllUserTokens(userId: string) {
    return AuthToken.updateMany(
      { user: userId, revoked: false },
      { revoked: true, revokedAt: new Date() },
    );
  }

  async deleteExpiredTokens() {
    return AuthToken.deleteMany({ expiresAt: { $lte: new Date() } });
  }
}
