import { Request, Response } from "express";
import { ApiError } from "@/utils/ApiError";
import { AttachmentService } from "@/services/attachmentService";

const service = new AttachmentService();

export class AttachmentController {
  async list(req: Request, res: Response) {
    const taskId = req.params.taskId as string;

    const attachments = await service.listByTask(taskId);

    res.status(200).json({
      success: true,
      data: attachments,
    });
  }

  async upload(req: Request, res: Response) {
    const taskId = req.params.taskId as string;
    const user = req.user!;

    if (!req.file) {
      throw new ApiError(400, "File is required");
    }

    const attachment = await service.create(taskId, user.id, req.file);

    res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      data: attachment,
    });
  }

  async delete(req: Request, res: Response) {
    const id = req.params.id as string;
    const user = req.user!;

    await service.delete(id, user.id, user.role);

    res.status(200).json({
      success: true,
      message: "Attachment deleted successfully",
    });
  }
}
