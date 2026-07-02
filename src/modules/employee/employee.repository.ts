
import { Employee } from './employee.model';
import {
  CreateEmployeeDto,
  UpdateEmployeeDto,
} from './employee.types';

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
  
  async create(data: CreateEmployeeDto) {
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
    }).select('+password');
  }

  async update(
    id: string,
    data: Partial<UpdateEmployeeDto>
  ) {
    return Employee.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
        runValidators: true,
      }
    );
  }

  async delete(id: string) {
    return Employee.findByIdAndDelete(id);
  }

  async search(
    search = '',
    page = 1,
    limit = 10
  ) {
    const filter: Filter = {};

    if (search.trim()) {
      filter.$or = [
        {
          fullName: {
            $regex: search,
            $options: 'i',
          },
        },
        {
          email: {
            $regex: search,
            $options: 'i',
          },
        },
      ];
    }

    const skip = (page - 1) * limit;

    const [employees, total] = await Promise.all([
      Employee.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

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
}