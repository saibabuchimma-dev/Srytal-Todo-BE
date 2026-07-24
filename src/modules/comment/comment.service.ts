import { ApiError } from "@/utils/ApiError";
import { CommentRepository } from "./comment.repository";
import { TaskRepository } from "../tasks/task.repository";
import { createCommentSchema, updateCommentSchema } from "./comment.types";
import { NotificationService } from "../notification/notification.service";
import { ActivityService } from "../activity/activity.service";

const repository = new CommentRepository();
const taskRepository = new TaskRepository();
const notificationService = new NotificationService();
const activityService = new ActivityService();

function resolveId(ref: unknown): string | null {
  if (ref && typeof ref === "object" && "_id" in ref) {
    return String((ref as { _id: unknown })._id);
  }

  return ref ? String(ref) : null;
}

export class CommentService {
  async listByTask(taskId: string) {
    const task = await taskRepository.findById(taskId);

    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    return repository.findByTask(taskId);
  }

  async create(taskId: string, authorId: string, input: unknown) {
    const parsed = createCommentSchema.safeParse(input);

    if (!parsed.success) {
      throw new ApiError(400, "Comment content is required");
    }

    const task = await taskRepository.findById(taskId);

    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    const comment = await repository.create({
      task: taskId,
      author: authorId,
      content: parsed.data.content,
    });

    const title = (task as { title?: string }).title ?? "the task";

    await activityService.record({
      task: taskId,
      actor: authorId,
      type: "COMMENT_ADDED",
      message: "added a comment",
    });

    const recipients = [resolveId(task.assignedTo), resolveId(task.createdBy)].filter(
      (id): id is string => !!id && id !== authorId,
    );

    for (const recipient of [...new Set(recipients)]) {
      await notificationService.notify({
        recipient,
        actor: authorId,
        type: "COMMENT_ADDED",
        message: `New comment on "${title}"`,
        task: taskId,
      });
    }

    return comment;
  }

  async update(commentId: string, userId: string, input: unknown) {
    const parsed = updateCommentSchema.safeParse(input);

    if (!parsed.success) {
      throw new ApiError(400, "Comment content is required");
    }

    const comment = await repository.findById(commentId);

    if (!comment) {
      throw new ApiError(404, "Comment not found");
    }

    if (resolveId(comment.author) !== userId) {
      throw new ApiError(403, "You can only edit your own comment.");
    }

    return repository.update(commentId, parsed.data.content);
  }

  async delete(commentId: string, userId: string, role: "Admin" | "Employee") {
    const comment = await repository.findById(commentId);

    if (!comment) {
      throw new ApiError(404, "Comment not found");
    }

    if (role !== "Admin" && resolveId(comment.author) !== userId) {
      throw new ApiError(403, "You can only delete your own comment.");
    }

    await repository.delete(commentId);
  }
}
