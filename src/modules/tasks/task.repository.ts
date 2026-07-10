import { Task } from "./task.model";
import { CreateTaskDto, UpdateTaskDto } from "./task.types";
import mongoose from "mongoose";

export class TaskRepository {
  async create(
    data: CreateTaskDto & {
      createdBy: string;
    },
  ) {
    return Task.create(data);
  }

  async findAll() {
    return Task.find()
      .populate("assignedTo", "fullName email role avatar")
      .populate("createdBy", "fullName email")
      .populate("project", "name status")
      .sort({
        createdAt: -1,
      });
  }

  async findById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    return Task.findById(id)
      .populate("assignedTo", "fullName email role avatar")
      .populate("createdBy", "fullName email")
      .populate("project", "name status");
  }

  async update(id: string, data: Partial<UpdateTaskDto>) {
    return Task.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    })
      .populate("assignedTo", "fullName email role avatar")
      .populate("createdBy", "fullName email")
      .populate("project", "name status");
  }

  async delete(id: string) {
    return Task.findByIdAndDelete(id);
  }

  async findByProject(projectId: string) {
    return Task.find({
      project: projectId,
    })
      .populate("assignedTo", "fullName email role avatar")
      .populate("createdBy", "fullName email")
      .populate("project", "name status")
      .sort({
        createdAt: -1,
      });
  }

  async projectStats(projectId: string) {
    const [total, pending, inProgress, completed] = await Promise.all([
      Task.countDocuments({
        project: projectId,
      }),

      Task.countDocuments({
        project: projectId,
        status: "Pending",
      }),

      Task.countDocuments({
        project: projectId,
        status: "In Progress",
      }),

      Task.countDocuments({
        project: projectId,
        status: "Completed",
      }),
    ]);

    return {
      total,
      pending,
      inProgress,
      completed,
      completionRate: total === 0 ? 0 : Math.round((completed / total) * 100),
    };
  }

  async search(
    search = "",
    page = 1,
    limit = 10,
    status?: string,
    priority?: string,
    assignedTo?: string,
    project?: string,
  ) {
    const filter: Record<string, unknown> = {};

    if (search.trim()) {
      filter.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
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

    if (project) {
      filter.project = project;
    }

    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .populate("assignedTo", "fullName email role avatar")
        .populate("createdBy", "fullName email")
        .populate("project", "name status")
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
      totalPages: Math.ceil(total / limit),
    };
  }

  async dashboard() {
    const [totalTasks, pending, inProgress, completed] = await Promise.all([
      Task.countDocuments(),

      Task.countDocuments({
        status: "Pending",
      }),

      Task.countDocuments({
        status: "In Progress",
      }),

      Task.countDocuments({
        status: "Completed",
      }),
    ]);

    return {
      totalTasks,
      pending,
      inProgress,
      completed,
    };
  }

  async findByEmployee(employeeId: string) {
    return Task.find({
      assignedTo: employeeId,
    })
      .populate("assignedTo", "fullName email role avatar")
      .populate("createdBy", "fullName email")
      .populate("project", "name status")
      .sort({
        dueDate: 1,
      });
  }

  async updateStatus(id: string, status: string) {
    return Task.findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
      },
    )
      .populate("assignedTo", "-password")
      .populate("project", "name status");
  }

  async count() {
    return Task.countDocuments();
  }

  async findRecent(limit = 5) {
    return Task.find()
      .populate("assignedTo", "fullName email role avatar")
      .populate("createdBy", "fullName email")
      .populate("project", "name status")
      .sort({
        createdAt: -1,
      })
      .limit(limit);
  }

  async countByStatus() {
    const [pending, inProgress, completed] = await Promise.all([
      Task.countDocuments({
        status: "Pending",
      }),

      Task.countDocuments({
        status: "In Progress",
      }),

      Task.countDocuments({
        status: "Completed",
      }),
    ]);

    return {
      pending,
      inProgress,
      completed,
    };
  }

  async countByPriority() {
    const [high, medium, low] = await Promise.all([
      Task.countDocuments({
        priority: "High",
      }),

      Task.countDocuments({
        priority: "Medium",
      }),

      Task.countDocuments({
        priority: "Low",
      }),
    ]);

    return {
      high,
      medium,
      low,
    };
  }

  async completionRate() {
    const [total, completed] = await Promise.all([
      Task.countDocuments(),

      Task.countDocuments({
        status: "Completed",
      }),
    ]);

    if (total === 0) {
      return 0;
    }

    return Math.round((completed / total) * 100);
  }
}
