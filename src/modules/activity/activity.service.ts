import { ActivityRepository } from "./activity.repository";
import { CreateActivityInput } from "./activity.types";

const repository = new ActivityRepository();

export class ActivityService {

  async record(input: CreateActivityInput) {
    try {
      if (!input.task) {
        return;
      }

      await repository.create(input);
    } catch {
      // swallow — activity logging is best-effort
    }
  }

  async listByTask(taskId: string) {
    return repository.findByTask(taskId);
  }
}
