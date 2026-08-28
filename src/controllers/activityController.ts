import { Request, Response } from "express";
import { ActivityService } from "@/services/activityService";

const service = new ActivityService();

export class ActivityController {
  async list(req: Request, res: Response) {
    const taskId = req.params.taskId as string;

    const data = await service.listByTask(taskId);

    res.status(200).json({
      success: true,
      data,
    });
  }
}
