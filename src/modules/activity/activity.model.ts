import mongoose, { InferSchemaType, Schema } from "mongoose";

const activitySchema = new Schema(
  {
    task: {
      type: Schema.Types.ObjectId,
      ref: "Task",
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
      enum: ["TASK_CREATED", "STATUS_CHANGED", "ASSIGNED", "COMMENT_ADDED"],
      required: true,
    },

    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export type ActivityDocument = InferSchemaType<typeof activitySchema>;

export const Activity = mongoose.model<ActivityDocument>(
  "Activity",
  activitySchema,
);
