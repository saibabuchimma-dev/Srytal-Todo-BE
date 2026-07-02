import { Request, Response } from 'express';

import { EmployeeService } from './employee.service';

const service = new EmployeeService();

export class EmployeeController {

  async create(req: Request, res: Response) {
    const employee = await service.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
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

    const employee = await service.update(
      id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      data: employee,
    });
  }

  async delete(req: Request, res: Response) {
    const id = req.params.id as string;

    await service.delete(id);

    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully',
    });
  }

  async search(req: Request, res: Response) {
    const search = String(req.query.search ?? '');
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    const result = await service.search(
      search,
      page,
      limit
    );

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
}