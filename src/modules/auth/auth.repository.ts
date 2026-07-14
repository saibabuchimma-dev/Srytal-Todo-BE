import { Employee } from "../employee/employee.model";

export class AuthRepository {
  async findByEmail(email: string) {
    return Employee.findOne({ email }).select("+password");
  }

  async updateLastLogin(id: string) {
    return Employee.findByIdAndUpdate(id, {
      lastLogin: new Date(),
    });
  }
}
