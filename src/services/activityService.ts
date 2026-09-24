import { Activity } from "@/models/Activity";

export type ActivityType =
  "TASK_CREATED" | "STATUS_CHANGED" | "ASSIGNED" | "COMMENT_ADDED";

export interface CreateActivityInput {
  task: string;
  actor?: string | null;
  type: ActivityType;
  message: string;
}

export class ActivityService {
  async record(input: CreateActivityInput) {
    try {
      if (!input.task) {
        return;
      }

      await Activity.create(input);
    } catch (_error) {
      void _error;
    }
  }

  async listByTask(taskId: string) {
    return Activity.find({ task: taskId })
      .populate("actor", "fullName avatar")
      .sort({ createdAt: 1 });
  }
}
