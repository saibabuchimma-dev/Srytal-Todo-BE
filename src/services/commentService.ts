import mongoose from "mongoose";
import { ApiError } from "@/utils/ApiError";
import { Comment } from "@/models/Comment";
import { Task } from "@/models/Task";
import {
  createCommentSchema,
  updateCommentSchema,
} from "@/validations/commentValidations";
import { NotificationService } from "./notificationService";
import { ActivityService } from "./activityService";

const notificationService = new NotificationService();
const activityService = new ActivityService();

const AUTHOR_FIELDS = "fullName email role avatar";

function resolveId(ref: unknown): string | null {
  if (ref && typeof ref === "object" && "_id" in ref) {
    return String((ref as { _id: unknown })._id);
  }

  return ref ? String(ref) : null;
}

export class CommentService {
  async listByTask(taskId: string) {
    const task = await Task.findById(taskId);

    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    return Comment.find({ task: taskId })
      .populate("author", AUTHOR_FIELDS)
      .sort({ createdAt: 1 });
  }

  async create(taskId: string, authorId: string, input: unknown) {
    const parsed = createCommentSchema.safeParse(input);

    if (!parsed.success) {
      throw new ApiError(400, "Comment content is required");
    }

    const task = await Task.findById(taskId);

    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    const comment = await Comment.create({
      task: taskId,
      author: authorId,
      content: parsed.data.content,
    });

    await comment.populate("author", AUTHOR_FIELDS);

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

    const comment = await this.findById(commentId);

    if (!comment) {
      throw new ApiError(404, "Comment not found");
    }

    if (resolveId(comment.author) !== userId) {
      throw new ApiError(403, "You can only edit your own comment.");
    }

    return Comment.findByIdAndUpdate(
      commentId,
      { content: parsed.data.content },
      { new: true, runValidators: true },
    ).populate("author", AUTHOR_FIELDS);
  }

  async delete(commentId: string, userId: string, role: "Admin" | "Employee") {
    const comment = await this.findById(commentId);

    if (!comment) {
      throw new ApiError(404, "Comment not found");
    }

    if (role !== "Admin" && resolveId(comment.author) !== userId) {
      throw new ApiError(403, "You can only delete your own comment.");
    }

    await Comment.findByIdAndDelete(commentId);
  }

  private async findById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    return Comment.findById(id).populate("author", AUTHOR_FIELDS);
  }
}
