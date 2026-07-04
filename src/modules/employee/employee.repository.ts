import { Employee } from "./employee.model";
import {  UpdateEmployeeDto } from "./employee.types";

type Filter = {
  $or?: {
    fullName?: {
      $regex: string;
      $options: string;
    };
    email?: {
      $regex: string;
      $options: string;
    };
  }[];
};

export class EmployeeRepository {
  async create(data: {
    fullName: string;
    email: string;
    password: string;
    role: "Admin" | "Employee";
    avatar: string;
    isActive: boolean;
    mustChangePassword: boolean;
  }) {
    return Employee.create(data);
  }

  async findAll() {
    return Employee.find().sort({
      createdAt: -1,
    });
  }

  async findById(id: string) {
    return Employee.findById(id);
  }

  async findByEmail(email: string) {
    return Employee.findOne({
      email,
    });
  }

  async findByEmailWithPassword(email: string) {
    return Employee.findOne({
      email,
    }).select("+password");
  }

  async update(id: string, data: Partial<UpdateEmployeeDto>) {
    return Employee.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id: string) {
    return Employee.findByIdAndDelete(id);
  }

  async search(search = "", page = 1, limit = 10) {
    const filter: Filter = {};

    if (search.trim()) {
      filter.$or = [
        {
          fullName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
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

  async findRecent(limit = 5) {
    return Employee.find()
      .select("-password")
      .sort({
        createdAt: -1,
      })
      .limit(limit);
  }

  async countByRole() {
    const [admins, employees] = await Promise.all([
      Employee.countDocuments({
        role: "Admin",
      }),

      Employee.countDocuments({
        role: "Employee",
      }),
    ]);

    return {
      admins,
      employees,
    };
  }

  async activeEmployees() {
    return Employee.countDocuments({
      isActive: true,
    });
  }

  async inactiveEmployees() {
    return Employee.countDocuments({
      isActive: false,
    });
  }

  async findByIdWithPassword(id: string) {
    return Employee.findById(id).select("+password");
  }

  async updatePassword(id: string, password: string) {
    return Employee.findByIdAndUpdate(
      id,
      {
        password,
        mustChangePassword: false,
      },
      {
        new: true,
      },
    );
  }
}
