import { Request, Response } from "express";
import { ApiError } from "@/utils/ApiError";
import { EmployeeService } from "./employee.service";
import {
  createEmployeeSchema,
  updateEmployeeSchema,
  updateMeSchema,
} from "./employee.types";

const service = new EmployeeService();

export class EmployeeController {
  async create(req: Request, res: Response) {
    const parsed = createEmployeeSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new ApiError(
        400,
        parsed.error.issues[0]?.message ?? "Invalid employee data",
      );
    }

    const { employee } = await service.create(parsed.data);

    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: employee,
    });
  }

  async getAll(_req: Request, res: Response) {
    const employees = await service.findAll();

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees,
    });
  }

  async getById(req: Request, res: Response) {
    const id = req.params.id as string;

    const employee = await service.findById(id);

    res.status(200).json({
      success: true,
      data: employee,
    });
  }

  async update(req: Request, res: Response) {
    const id = req.params.id as string;

    const parsed = updateEmployeeSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new ApiError(
        400,
        parsed.error.issues[0]?.message ?? "Invalid employee data",
      );
    }

    const employee = await service.update(id, parsed.data);

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: employee,
    });
  }

  async delete(req: Request, res: Response) {
    const id = req.params.id as string;

    await service.delete(id);

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  }

  async search(req: Request, res: Response) {
    const search = String(req.query.search ?? "");
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    const result = await service.search(search, page, limit);

    res.status(200).json({
      success: true,
      ...result,
    });
  }

  async count(_req: Request, res: Response) {
    const total = await service.count();

    res.status(200).json({
      success: true,
      totalEmployees: total,
    });
  }

  async changePassword(req: Request, res: Response) {
    await service.changePassword(req.user!.id, req.body);

    res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  }

  async me(req: Request, res: Response) {
    const employee = await service.findById(req.user!.id);

    res.status(200).json({
      success: true,
      data: employee,
    });
  }

  async updateMe(req: Request, res: Response) {
    const parsed = updateMeSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new ApiError(
        400,
        parsed.error.issues[0]?.message ?? "Invalid profile data",
      );
    }

    const employee = await service.update(req.user!.id, parsed.data);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: employee,
    });
  }
}
