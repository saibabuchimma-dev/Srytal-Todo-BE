import mongoose from "mongoose";
import { Attachment } from "./attachment.model";

const UPLOADER_FIELDS = "fullName email role avatar";

export class AttachmentRepository {
  async create(data: {
    task: string;
    uploadedBy: string;
    originalName: string;
    fileName: string;
    mimeType: string;
    size: number;
    url: string;
  }) {
    const attachment = await Attachment.create(data);

    return attachment.populate("uploadedBy", UPLOADER_FIELDS);
  }

  async findByTask(taskId: string) {
    return Attachment.find({
      task: taskId,
    })
      .populate("uploadedBy", UPLOADER_FIELDS)
      .sort({
        createdAt: -1,
      });
  }

  async findById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    return Attachment.findById(id);
  }

  async delete(id: string) {
    return Attachment.findByIdAndDelete(id);
  }

  async countByTask(taskId: string) {
    return Attachment.countDocuments({
      task: taskId,
    });
  }
}
