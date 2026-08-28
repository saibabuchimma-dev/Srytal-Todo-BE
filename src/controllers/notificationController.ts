import { Request, Response } from "express";
import { NotificationService } from "@/services/notificationService";

const service = new NotificationService();

export class NotificationController {
  async list(req: Request, res: Response) {
    const user = req.user!;

    const data = await service.listForUser(user.id);

    res.status(200).json({
      success: true,
      data,
    });
  }

  async unreadCount(req: Request, res: Response) {
    const user = req.user!;

    const count = await service.unreadCount(user.id);

    res.status(200).json({
      success: true,
      data: { count },
    });
  }

  async markRead(req: Request, res: Response) {
    const user = req.user!;
    const id = req.params.id as string;

    const notification = await service.markRead(id, user.id);

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  }

  async markAllRead(req: Request, res: Response) {
    const user = req.user!;

    await service.markAllRead(user.id);

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  }

  async remove(req: Request, res: Response) {
    const user = req.user!;
    const id = req.params.id as string;

    await service.remove(id, user.id);

    res.status(200).json({
      success: true,
      message: "Notification deleted",
    });
  }
}
