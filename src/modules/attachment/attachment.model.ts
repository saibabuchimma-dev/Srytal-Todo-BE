import mongoose, { InferSchemaType, Schema } from "mongoose";

const attachmentSchema = new Schema(
  {
    task: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
      index: true,
    },

    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    originalName: {
      type: String,
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    mimeType: {
      type: String,
      required: true,
    },

    size: {
      type: Number,
      required: true,
    },

    url: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export type AttachmentDocument = InferSchemaType<typeof attachmentSchema>;

export const Attachment = mongoose.model<AttachmentDocument>(
  "Attachment",
  attachmentSchema,
);
