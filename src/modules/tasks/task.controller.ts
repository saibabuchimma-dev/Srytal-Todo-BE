import { Request, Response } from "express";
import { TaskService } from "./task.service";
import { Task } from "./task.model";

const service = new TaskService();

export class TaskController {
  async create(req: Request, res: Response) {
    const user = req.user as {
      id: string;
    };

    const task = await service.create(req.body, user.id);

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  }

  async getAll(_req: Request, res: Response) {
    const tasks = await service.findAll();

    res.status(200).json({
      success: true,
      data: tasks,
    });
  }

  async getById(req: Request, res: Response) {
    const id = req.params.id as string;

    const task = await service.findById(id);

    res.status(200).json({
      success: true,
      data: task,
    });
  }

  async update(req: Request, res: Response) {
    const id = req.params.id as string;

    const task = await service.update(id, req.body, req.user!.id);

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  }

  async delete(req: Request, res: Response) {
    const id = req.params.id as string;

    await service.delete(id);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  }

  async search(req: Request, res: Response) {
    const result = await service.search({
      search: req.query.search?.toString(),
      page: Number(req.query.page ?? 1),
      limit: Number(req.query.limit ?? 10),
      status: req.query.status?.toString() as
        "Pending" | "In Progress" | "Completed" | undefined,
      priority: req.query.priority?.toString() as
        "Low" | "Medium" | "High" | undefined,
      assignedTo: req.query.assignedTo?.toString(),
      project: req.query.project?.toString(),
    });

    res.status(200).json({
      success: true,
      ...result,
    });
  }

  async dashboard(_req: Request, res: Response) {
    const dashboard = await service.dashboard();

    res.status(200).json({
      success: true,
      data: dashboard,
    });
  }

  async myTasks(req: Request, res: Response) {
    const user = req.user as {
      id: string;
    };

    const tasks = await service.myTasks(user.id);

    res.status(200).json({
      success: true,
      data: tasks,
    });
  }

  async updateStatus(req: Request, res: Response) {
    const id = req.params.id as string;

    const task = await service.updateStatus(
      id,
      req.user!.id,
      req.user!.role,
      req.body.status,
    );

    res.json({
      success: true,
      message: "Task status updated successfully",
      data: task,
    });
  }

  async count(_req: Request, res: Response) {
    const total = await service.count();

    res.status(200).json({
      success: true,
      data: {
        totalTasks: total,
      },
    });
  }

  async findRecent(limit = 5) {
    return Task.find()
      .populate("assignedTo", "fullName email role avatar")
      .populate("createdBy", "fullName email")
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

    return total === 0 ? 0 : Math.round((completed / total) * 100);
  }
}