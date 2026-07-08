import mongoose, { InferSchemaType, Schema } from "mongoose";

const taskSchema = new Schema(
  {
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },

    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    dueDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

taskSchema.index({ title: "text" });

taskSchema.index({
  assignedTo: 1,
});

taskSchema.index({
  status: 1,
});

taskSchema.index({
  priority: 1,
});

export type TaskDocument = InferSchemaType<typeof taskSchema>;

export const Task = mongoose.model<TaskDocument>("Task", taskSchema);
