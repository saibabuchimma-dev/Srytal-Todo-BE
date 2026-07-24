export type ActivityType =
  | "TASK_CREATED"
  | "STATUS_CHANGED"
  | "ASSIGNED"
  | "COMMENT_ADDED";

export interface CreateActivityInput {
  task: string;
  actor?: string | null;
  type: ActivityType;
  message: string;
}
