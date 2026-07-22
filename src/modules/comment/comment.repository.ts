import mongoose from "mongoose";
import { Comment } from "./comment.model";

const AUTHOR_FIELDS = "fullName email role avatar";

export class CommentRepository {
  async create(data: { task: string; author: string; content: string }) {
    const comment = await Comment.create(data);

    return comment.populate("author", AUTHOR_FIELDS);
  }

  async findByTask(taskId: string) {
    return Comment.find({
      task: taskId,
    })
      .populate("author", AUTHOR_FIELDS)
      .sort({
        createdAt: 1,
      });
  }

  async findById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    return Comment.findById(id).populate("author", AUTHOR_FIELDS);
  }

  async update(id: string, content: string) {
    return Comment.findByIdAndUpdate(
      id,
      { content },
      {
        new: true,
        runValidators: true,
      },
    ).populate("author", AUTHOR_FIELDS);
  }

  async delete(id: string) {
    return Comment.findByIdAndDelete(id);
  }

  async countByTask(taskId: string) {
    return Comment.countDocuments({
      task: taskId,
    });
  }
}
