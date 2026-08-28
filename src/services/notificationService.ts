import mongoose from "mongoose";
import { ApiError } from "@/utils/ApiError";
import { Notification } from "@/models/Notification";

export type NotificationType = "TASK_ASSIGNED" | "TASK_STATUS" | "COMMENT_ADDED";

export interface CreateNotificationInput {
  recipient: string;
  actor?: string | null;
  type: NotificationType;
  message: string;
  task?: string | null;
}

function resolveId(ref: unknown): string | null {
  if (ref && typeof ref === "object" && "_id" in ref) {
    return String((ref as { _id: unknown })._id);
  }

  return ref ? String(ref) : null;
}

export class NotificationService {
  async notify(input: CreateNotificationInput) {
    try {
      if (!input.recipient) {
        return;
      }

      if (input.actor && String(input.actor) === String(input.recipient)) {
        return;
      }

      await Notification.create(input);
    } catch {
      // swallow — notifications are best-effort
    }
  }

  async listForUser(userId: string) {
    return Notification.find({ recipient: userId })
      .populate("actor", "fullName avatar")
      .populate("task", "title")
      .sort({ createdAt: -1 })
      .limit(50);
  }

  async unreadCount(userId: string) {
    return Notification.countDocuments({ recipient: userId, isRead: false });
  }

  async markRead(id: string, userId: string) {
    const notification = await this.findById(id);

    if (!notification) {
      throw new ApiError(404, "Notification not found");
    }

    if (resolveId(notification.recipient) !== userId) {
      throw new ApiError(403, "This notification is not yours.");
    }

    return Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true },
    );
  }

  async markAllRead(userId: string) {
    await Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true },
    );
  }

  async remove(id: string, userId: string) {
    const notification = await this.findById(id);

    if (!notification) {
      throw new ApiError(404, "Notification not found");
    }

    if (resolveId(notification.recipient) !== userId) {
      throw new ApiError(403, "This notification is not yours.");
    }

    await Notification.findByIdAndDelete(id);
  }

  private async findById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    return Notification.findById(id);
  }
}
