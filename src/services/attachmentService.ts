import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { ApiError } from "@/utils/ApiError";
import { Attachment } from "@/models/Attachment";
import { Task } from "@/models/Task";
import { UPLOAD_DIR } from "@/config/multer";

const UPLOADER_FIELDS = "fullName email role avatar";

function resolveId(ref: unknown): string | null {
  if (ref && typeof ref === "object" && "_id" in ref) {
    return String((ref as { _id: unknown })._id);
  }

  return ref ? String(ref) : null;
}

export class AttachmentService {
  async listByTask(taskId: string) {
    const task = await Task.findById(taskId);

    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    return Attachment.find({ task: taskId })
      .populate("uploadedBy", UPLOADER_FIELDS)
      .sort({ createdAt: -1 });
  }

  async create(taskId: string, uploaderId: string, file: Express.Multer.File) {
    const task = await Task.findById(taskId);

    if (!task) {
      await fs.promises.unlink(file.path).catch(() => undefined);
      throw new ApiError(404, "Task not found");
    }

    const attachment = await Attachment.create({
      task: taskId,
      uploadedBy: uploaderId,
      originalName: file.originalname,
      fileName: file.filename,
      mimeType: file.mimetype,
      size: file.size,
      url: `${process.env.APP_URL ?? "http://localhost:5000"}/uploads/attachments/${file.filename}`,
    });

    return attachment.populate("uploadedBy", UPLOADER_FIELDS);
  }

  async delete(attachmentId: string, userId: string, role: "Admin" | "Employee") {
    const attachment = await this.findById(attachmentId);

    if (!attachment) {
      throw new ApiError(404, "Attachment not found");
    }

    if (role !== "Admin" && resolveId(attachment.uploadedBy) !== userId) {
      throw new ApiError(403, "You can only delete your own attachment.");
    }

    const fileName = attachment.fileName;

    await Attachment.findByIdAndDelete(attachmentId);

    await fs.promises
      .unlink(path.join(UPLOAD_DIR, fileName))
      .catch(() => undefined);
  }

  private async findById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    return Attachment.findById(id);
  }
}
