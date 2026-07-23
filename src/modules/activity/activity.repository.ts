import { Activity } from "./activity.model";
import { CreateActivityInput } from "./activity.types";

export class ActivityRepository {
  async create(data: CreateActivityInput) {
    return Activity.create(data);
  }

  async findByTask(taskId: string) {
    return Activity.find({
      task: taskId,
    })
      .populate("actor", "fullName avatar")
      .sort({
        createdAt: 1,
      });
  }
}
