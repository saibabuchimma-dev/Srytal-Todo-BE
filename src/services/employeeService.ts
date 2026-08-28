import bcrypt from "bcryptjs";
import { ApiError } from "@/utils/ApiError";
import { Employee } from "@/models/Employee";
import {
  ChangePasswordDto,
  CreateEmployeeDto,
  UpdateEmployeeDto,
} from "@/validations/employeeValidations";
import { welcomeEmployeeTemplate } from "@/templates/emails";
import { MailService } from "./mailService";
import { generatePassword } from "@/utils/generatePassword";
import { config } from "@/config";

const mailService = new MailService();

type Filter = {
  $or?: {
    fullName?: { $regex: string; $options: string };
    email?: { $regex: string; $options: string };
  }[];
};

export class EmployeeService {
  async create(data: CreateEmployeeDto) {
    const existingEmployee = await Employee.findOne({
      email: (data.email ?? "").toLowerCase(),
    });

    if (existingEmployee) {
      throw new ApiError(409, "Employee already exists");
    }

    const tempPassword = generatePassword();

    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const employee = await Employee.create({
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
          loginUrl: `${config.frontendUrl}/login`,
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
    return Employee.find().sort({ createdAt: -1 });
  }

  async findById(id: string) {
    const employee = await Employee.findById(id);

    if (!employee) {
      throw new ApiError(404, "Employee not found");
    }

    return employee;
  }

  async update(id: string, data: Partial<UpdateEmployeeDto>) {
    const employee = await Employee.findById(id);

    if (!employee) {
      throw new ApiError(404, "Employee not found");
    }

    if (data.email && data.email !== employee.email) {
      const exists = await Employee.findOne({ email: data.email });

      if (exists && String(exists.id) !== String(employee.id)) {
        throw new ApiError(409, "Email already exists");
      }
    }

    return Employee.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id: string) {
    const employee = await Employee.findById(id);

    if (!employee) {
      throw new ApiError(404, "Employee not found");
    }

    await Employee.findByIdAndDelete(id);
  }

  async search(search = "", page = 1, limit = 10) {
    const filter: Filter = {};

    if (search.trim()) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [employees, total] = await Promise.all([
      Employee.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Employee.countDocuments(filter),
    ]);

    return {
      employees,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async count() {
    return Employee.countDocuments();
  }

  async recentEmployees(limit = 5) {
    return Employee.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  async employeeStats() {
    const [totalEmployees, activeEmployees, inactiveEmployees, admins, employees] =
      await Promise.all([
        Employee.countDocuments(),
        Employee.countDocuments({ isActive: true }),
        Employee.countDocuments({ isActive: false }),
        Employee.countDocuments({ role: "Admin" }),
        Employee.countDocuments({ role: "Employee" }),
      ]);

    return {
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      admins,
      employees,
    };
  }

  async changePassword(employeeId: string, data: ChangePasswordDto) {
    const employee = await Employee.findById(employeeId).select("+password");

    if (!employee) {
      throw new ApiError(404, "Employee not found");
    }

    const isMatch = await bcrypt.compare(data.currentPassword, employee.password);

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

    await Employee.findByIdAndUpdate(
      employeeId,
      {
        password: hashedPassword,
        mustChangePassword: false,
        passwordChangedAt: new Date(),
      },
      { new: true },
    );
  }
}
