import { Request, Response } from 'express';
import { TaskService } from './task.service';

const service = new TaskService();

export class TaskController {

  async create(req: Request, res: Response) {
    const user = req.user as {
      id: string;
    };

    const task = await service.create(
      req.body,
      user.id
    );

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  }

  async getAll(
    _req: Request,
    res: Response
  ) {
    const tasks =
      await service.findAll();

    res.status(200).json({
      success: true,
      data: tasks,
    });
  }

async getById(
  req: Request,
  res: Response
) {
  const id = req.params.id as string;

  const task = await service.findById(id);

  res.status(200).json({
    success: true,
    data: task,
  });
}

async update(
  req: Request,
  res: Response
) {
  const id = req.params.id as string;

  const task = await service.update(
    id,
    req.body
  );

  res.status(200).json({
    success: true,
    message: 'Task updated successfully',
    data: task,
  });
}

async delete(
  req: Request,
  res: Response
) {
  const id = req.params.id as string;

  await service.delete(id);

  res.status(200).json({
    success: true,
    message: 'Task deleted successfully',
  });
}

  async search(
    req: Request,
    res: Response
  ) {
    const result =
      await service.search({
        search:
          req.query.search?.toString(),
        page: Number(
          req.query.page ?? 1
        ),
        limit: Number(
          req.query.limit ?? 10
        ),
        status:
          req.query.status?.toString() as
            | 'Pending'
            | 'In Progress'
            | 'Completed'
            | undefined,
        priority:
          req.query.priority?.toString() as
            | 'Low'
            | 'Medium'
            | 'High'
            | undefined,
        assignedTo:
          req.query.assignedTo?.toString(),
      });

    res.status(200).json({
      success: true,
      ...result,
    });
  }

  async dashboard(
    _req: Request,
    res: Response
  ) {
    const dashboard =
      await service.dashboard();

    res.status(200).json({
      success: true,
      data: dashboard,
    });
  }

  async myTasks(
    req: Request,
    res: Response
  ) {
    const user = req.user as {
      id: string;
    };

    const tasks =
      await service.myTasks(
        user.id
      );

    res.status(200).json({
      success: true,
      data: tasks,
    });
  }

  async count(
    _req: Request,
    res: Response
  ) {
    const total =
      await service.count();

    res.status(200).json({
      success: true,
      data: {
        totalTasks: total,
      },
    });
  }
}