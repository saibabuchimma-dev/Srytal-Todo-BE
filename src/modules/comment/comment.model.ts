import mongoose, { InferSchemaType, Schema } from "mongoose";

const commentSchema = new Schema(
  {
    task: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
      index: true,
    },

    author: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export type CommentDocument = InferSchemaType<typeof commentSchema>;

export const Comment = mongoose.model<CommentDocument>("Comment", commentSchema);
