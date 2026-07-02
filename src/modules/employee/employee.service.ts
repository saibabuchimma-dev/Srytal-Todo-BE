import bcrypt from 'bcryptjs';
import { ApiError } from '@/utils/ApiError';
import { EmployeeRepository } from './employee.repository';
import {
  CreateEmployeeDto,
  UpdateEmployeeDto,
} from './employee.types';

const repository = new EmployeeRepository();

export class EmployeeService {
  async create(data: CreateEmployeeDto) {
    const existingEmployee = await repository.findByEmail(data.email);

    if (existingEmployee) {
      throw new ApiError(409, 'Employee already exists with this email');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return repository.create({
      ...data,
      password: hashedPassword,
    });
  }

  async findAll() {
    return repository.findAll();
  }

  async findById(id: string) {
    const employee = await repository.findById(id);

    if (!employee) {
      throw new ApiError(404, 'Employee not found');
    }

    return employee;
  }

  async update(
    id: string,
    data: Partial<UpdateEmployeeDto>
  ) {
    const employee = await repository.findById(id);

    if (!employee) {
      throw new ApiError(404, 'Employee not found');
    }

    if (
      data.email &&
      data.email !== employee.email
    ) {
      const exists = await repository.findByEmail(data.email);

      if (exists && exists.id !== employee.id) {
        throw new ApiError(
          409,
          'Email already exists'
        );
      }
    }

    return repository.update(id, data);
  }

  async delete(id: string) {
    const employee = await repository.findById(id);

    if (!employee) {
      throw new ApiError(404, 'Employee not found');
    }

    await repository.delete(id);
  }

  async search(
    search = '',
    page = 1,
    limit = 10
  ) {
    return repository.search(
      search,
      page,
      limit
    );
  }

  async count() {
    return repository.count();
  }
}