import { Request, Response } from "express";
import { CommentService } from "@/services/commentService";

const service = new CommentService();

export class CommentController {
  async list(req: Request, res: Response) {
    const taskId = req.params.taskId as string;

    const comments = await service.listByTask(taskId);

    res.status(200).json({
      success: true,
      data: comments,
    });
  }

  async create(req: Request, res: Response) {
    const taskId = req.params.taskId as string;
    const user = req.user!;

    const comment = await service.create(taskId, user.id, req.body);

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: comment,
    });
  }

  async update(req: Request, res: Response) {
    const id = req.params.id as string;
    const user = req.user!;

    const comment = await service.update(id, user.id, req.body);

    res.status(200).json({
      success: true,
      message: "Comment updated successfully",
      data: comment,
    });
  }

  async delete(req: Request, res: Response) {
    const id = req.params.id as string;
    const user = req.user!;

    await service.delete(id, user.id, user.role);

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  }
}
