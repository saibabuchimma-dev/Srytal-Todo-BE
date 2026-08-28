import bcrypt from "bcryptjs";
import { ApiError } from "@/utils/ApiError";
import { EmployeeRepository } from "./employee.repository";
import {
  ChangePasswordDto,
  CreateEmployeeDto,
  UpdateEmployeeDto,
} from "./employee.types";
import { welcomeEmployeeTemplate } from "@/templates/emails";
import { MailService } from "../mail/mail.service";
import { generatePassword } from "@/utils/generatePassword";
import { env } from "@/config/env";

const repository = new EmployeeRepository();
const mailService = new MailService();

export class EmployeeService {
  async create(data: CreateEmployeeDto) {
    const existingEmployee = await repository.findByEmail(data.email);

    if (existingEmployee) {
      throw new ApiError(409, "Employee already exists");
    }

    // Generate Temporary Password
    const tempPassword = generatePassword();

    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const employee = await repository.create({
      ...data,
      password: hashedPassword,
      mustChangePassword: true,
    });

    try {
      await mailService.sendWelcomeEmployeeEmail(
        employee.email,
        "Welcome to SRYTAL Employee Portal",
        welcomeEmployeeTemplate({
          fullName: employee.fullName,
          email: employee.email,
          temporaryPassword: tempPassword,
          loginUrl: `${env.FRONTEND_URL}/login`,
        }),
      );

      console.log(`Welcome email sent to ${employee.email}`);
    } catch (error) {
      console.error("Failed to send welcome email:", error);
    }

    return {
      employee,
      tempPassword,
    };
  }

  async findAll() {
    return repository.findAll();
  }

  async findById(id: string) {
    const employee = await repository.findById(id);

    if (!employee) {
      throw new ApiError(404, "Employee not found");
    }

    return employee;
  }

  async update(id: string, data: Partial<UpdateEmployeeDto>) {
    const employee = await repository.findById(id);

    if (!employee) {
      throw new ApiError(404, "Employee not found");
    }

    if (data.email && data.email !== employee.email) {
      const exists = await repository.findByEmail(data.email);

      if (exists && exists.id !== employee.id) {
        throw new ApiError(409, "Email already exists");
      }
    }

    return repository.update(id, data);
  }

  async delete(id: string) {
    const employee = await repository.findById(id);

    if (!employee) {
      throw new ApiError(404, "Employee not found");
    }

    await repository.delete(id);
  }

  async search(search = "", page = 1, limit = 10) {
    return repository.search(search, page, limit);
  }

  async count() {
    return repository.count();
  }

  async recentEmployees(limit = 5) {
    return repository.findRecent(limit);
  }

  async employeeStats() {
    const [totalEmployees, activeEmployees, inactiveEmployees, roles] =
      await Promise.all([
        repository.count(),
        repository.activeEmployees(),
        repository.inactiveEmployees(),
        repository.countByRole(),
      ]);

    return {
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      admins: roles.admins,
      employees: roles.employees,
    };
  }

  async changePassword(employeeId: string, data: ChangePasswordDto) {
    const employee = await repository.findByIdWithPassword(employeeId);

    if (!employee) {
      throw new ApiError(404, "Employee not found");
    }

    const isMatch = await bcrypt.compare(
      data.currentPassword,
      employee.password,
    );

    if (!isMatch) {
      throw new ApiError(400, "Current password is incorrect");
    }

    if (data.newPassword.length < 8) {
      throw new ApiError(400, "Password must be at least 8 characters long");
    }

    if (data.newPassword !== data.confirmPassword) {
      throw new ApiError(400, "Passwords do not match");
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    await repository.updatePassword(employeeId, hashedPassword);
  }
}
