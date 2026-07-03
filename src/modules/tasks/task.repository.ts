import { Task } from './task.model';
import {
  CreateTaskDto,
  UpdateTaskDto,
} from './task.types';

export class TaskRepository {

  async create(
    data: CreateTaskDto & {
      createdBy: string;
    }
  ) {
    return Task.create(data);
  }

  async findAll() {
    return Task.find()
      .populate(
        'assignedTo',
        'fullName email role avatar'
      )
      .populate(
        'createdBy',
        'fullName email'
      )
      .sort({
        createdAt: -1,
      });
  }

  async findById(id: string) {
    return Task.findById(id)
      .populate(
        'assignedTo',
        'fullName email role avatar'
      )
      .populate(
        'createdBy',
        'fullName email'
      );
  }

  async update(
    id: string,
    data: Partial<UpdateTaskDto>
  ) {
    return Task.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate(
        'assignedTo',
        'fullName email role avatar'
      )
      .populate(
        'createdBy',
        'fullName email'
      );
  }

  async delete(id: string) {
    return Task.findByIdAndDelete(id);
  }

  async search(
    search = '',
    page = 1,
    limit = 10,
    status?: string,
    priority?: string,
    assignedTo?: string
  ) {
    const filter: Record<string, unknown> = {};

    if (search.trim()) {
      filter.$or = [
        {
          title: {
            $regex: search,
            $options: 'i',
          },
        },
        {
          description: {
            $regex: search,
            $options: 'i',
          },
        },
      ];
    }

    if (status) {
      filter.status = status;
    }

    if (priority) {
      filter.priority = priority;
    }

    if (assignedTo) {
      filter.assignedTo = assignedTo;
    }

    const skip = (page - 1) * limit;

    const [tasks, total] =
      await Promise.all([
        Task.find(filter)
          .populate(
            'assignedTo',
            'fullName email role avatar'
          )
          .populate(
            'createdBy',
            'fullName email'
          )
          .sort({
            createdAt: -1,
          })
          .skip(skip)
          .limit(limit),

        Task.countDocuments(filter),
      ]);

    return {
      tasks,
      total,
      page,
      limit,
      totalPages: Math.ceil(
        total / limit
      ),
    };
  }

  async dashboard() {
    const [
      totalTasks,
      pending,
      inProgress,
      completed,
    ] = await Promise.all([
      Task.countDocuments(),

      Task.countDocuments({
        status: 'Pending',
      }),

      Task.countDocuments({
        status: 'In Progress',
      }),

      Task.countDocuments({
        status: 'Completed',
      }),
    ]);

    return {
      totalTasks,
      pending,
      inProgress,
      completed,
    };
  }

  async findByEmployee(
    employeeId: string
  ) {
    return Task.find({
      assignedTo: employeeId,
    })
      .populate(
        'assignedTo',
        'fullName email role avatar'
      )
      .populate(
        'createdBy',
        'fullName email'
      )
      .sort({
        dueDate: 1,
      });
  }

  async count() {
    return Task.countDocuments();
  }
}