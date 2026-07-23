export type NotificationType = "TASK_ASSIGNED" | "TASK_STATUS" | "COMMENT_ADDED";

export interface CreateNotificationInput {
  recipient: string;
  actor?: string | null;
  type: NotificationType;
  message: string;
  task?: string | null;
}
