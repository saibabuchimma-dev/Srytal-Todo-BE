import mongoose, { InferSchemaType, Schema } from "mongoose";

const notificationSchema = new Schema(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      index: true,
    },

    actor: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },

    type: {
      type: String,
      enum: ["TASK_ASSIGNED", "TASK_STATUS", "COMMENT_ADDED"],
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    task: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      default: null,
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export type NotificationDocument = InferSchemaType<typeof notificationSchema>;

export const Notification = mongoose.model<NotificationDocument>(
  "Notification",
  notificationSchema,
);
