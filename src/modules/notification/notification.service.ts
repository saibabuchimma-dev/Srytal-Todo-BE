import { ApiError } from "@/utils/ApiError";
import { NotificationRepository } from "./notification.repository";
import { CreateNotificationInput } from "./notification.types";

const repository = new NotificationRepository();

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

      await repository.create(input);
    } catch {
      // swallow — notifications are best-effort
    }
  }

  async listForUser(userId: string) {
    return repository.findByRecipient(userId);
  }

  async unreadCount(userId: string) {
    return repository.unreadCount(userId);
  }

  async markRead(id: string, userId: string) {
    const notification = await repository.findById(id);

    if (!notification) {
      throw new ApiError(404, "Notification not found");
    }

    if (resolveId(notification.recipient) !== userId) {
      throw new ApiError(403, "This notification is not yours.");
    }

    return repository.markRead(id);
  }

  async markAllRead(userId: string) {
    await repository.markAllRead(userId);
  }

  async remove(id: string, userId: string) {
    const notification = await repository.findById(id);

    if (!notification) {
      throw new ApiError(404, "Notification not found");
    }

    if (resolveId(notification.recipient) !== userId) {
      throw new ApiError(403, "This notification is not yours.");
    }

    await repository.delete(id);
  }
}
