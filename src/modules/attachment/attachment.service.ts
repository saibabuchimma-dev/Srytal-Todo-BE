import fs from "fs";
import path from "path";
import { ApiError } from "@/utils/ApiError";
import { env } from "@/config/env";
import { UPLOAD_DIR } from "@/config/multer";
import { AttachmentRepository } from "./attachment.repository";
import { TaskRepository } from "../tasks/task.repository";

const repository = new AttachmentRepository();
const taskRepository = new TaskRepository();

function resolveId(ref: unknown): string | null {
  if (ref && typeof ref === "object" && "_id" in ref) {
    return String((ref as { _id: unknown })._id);
  }

  return ref ? String(ref) : null;
}

export class AttachmentService {
  async listByTask(taskId: string) {
    const task = await taskRepository.findById(taskId);

    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    return repository.findByTask(taskId);
  }

  async create(taskId: string, uploaderId: string, file: Express.Multer.File) {
    const task = await taskRepository.findById(taskId);

    if (!task) {
      await fs.promises.unlink(file.path).catch(() => undefined);
      throw new ApiError(404, "Task not found");
    }

    return repository.create({
      task: taskId,
      uploadedBy: uploaderId,
      originalName: file.originalname,
      fileName: file.filename,
      mimeType: file.mimetype,
      size: file.size,
      url: `${env.APP_URL}/uploads/attachments/${file.filename}`,
    });
  }

  async delete(attachmentId: string, userId: string, role: "Admin" | "Employee") {
    const attachment = await repository.findById(attachmentId);

    if (!attachment) {
      throw new ApiError(404, "Attachment not found");
    }

    if (role !== "Admin" && resolveId(attachment.uploadedBy) !== userId) {
      throw new ApiError(403, "You can only delete your own attachment.");
    }

    await fs.promises
      .unlink(path.join(UPLOAD_DIR, attachment.fileName))
      .catch(() => undefined);

    await repository.delete(attachmentId);
  }
}
