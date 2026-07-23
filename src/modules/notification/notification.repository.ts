import mongoose from "mongoose";
import { Notification } from "./notification.model";
import { CreateNotificationInput } from "./notification.types";

export class NotificationRepository {
  async create(data: CreateNotificationInput) {
    return Notification.create(data);
  }

  async findByRecipient(recipient: string, limit = 50) {
    return Notification.find({
      recipient,
    })
      .populate("actor", "fullName avatar")
      .populate("task", "title")
      .sort({
        createdAt: -1,
      })
      .limit(limit);
  }

  async unreadCount(recipient: string) {
    return Notification.countDocuments({
      recipient,
      isRead: false,
    });
  }

  async findById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    return Notification.findById(id);
  }

  async markRead(id: string) {
    return Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      {
        new: true,
      },
    );
  }

  async markAllRead(recipient: string) {
    return Notification.updateMany(
      { recipient, isRead: false },
      { isRead: true },
    );
  }

  async delete(id: string) {
    return Notification.findByIdAndDelete(id);
  }
}
