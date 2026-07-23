import { ApiError } from "@/utils/ApiError";
import { EmployeeRepository } from "../employee/employee.repository";
import { TaskRepository } from "./task.repository";
import {
  CreateTaskDto,
  SearchTaskDto,
  UpdateTaskDto,
  updateTaskStatusSchema,
} from "./task.types";
import { EmployeeService } from "../employee/employee.service";
import { ProjectRepository } from "../project/project.repository";
import { NotificationService } from "../notification/notification.service";
import { ActivityService } from "../activity/activity.service";

const repository = new TaskRepository();
const employeeRepository = new EmployeeRepository();
const employeeService = new EmployeeService();
const projectRepository = new ProjectRepository();
const notificationService = new NotificationService();
const activityService = new ActivityService();

function resolveId(ref: unknown): string | null {
  if (ref && typeof ref === "object" && "_id" in ref) {
    return String((ref as { _id: unknown })._id);
  }

  return ref ? String(ref) : null;
}

export class TaskService {
  async create(data: CreateTaskDto, createdBy: string) {
    if (data.assignedTo && data.assignedTo.trim() !== "") {
      const employee = await employeeRepository.findById(data.assignedTo);

      if (!employee) {
        throw new ApiError(404, "Assigned employee not found");
      }
    }
    if (data.project && data.project.trim() !== "") {
      const project = await projectRepository.findById(data.project);

      if (!project) {
        throw new ApiError(404, "Project not found");
      }
    }

    const task = await repository.create({
      ...data,
      createdBy,
    });

    if (data.project && data.assignedTo) {
      await projectRepository.addMember(data.project, data.assignedTo);
    }

    await activityService.record({
      task: String(task._id),
      actor: createdBy,
      type: "TASK_CREATED",
      message: "created this task",
    });

    if (data.assignedTo && data.assignedTo.trim() !== "") {
      await activityService.record({
        task: String(task._id),
        actor: createdBy,
        type: "ASSIGNED",
        message: "assigned this task",
      });

      await notificationService.notify({
        recipient: data.assignedTo,
        actor: createdBy,
        type: "TASK_ASSIGNED",
        message: `You were assigned the task "${task.title}"`,
        task: String(task._id),
      });
    }

    return task;
  }

  async findAll() {
    return repository.findAll();
  }

  async findById(id: string) {
    const task = await repository.findById(id);

    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    return task;
  }

  async update(id: string, data: Partial<UpdateTaskDto>) {
    const task = await repository.findById(id);

    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    if (data.assignedTo && data.assignedTo.trim() !== "") {
      const employee = await employeeRepository.findById(data.assignedTo);

      if (!employee) {
        throw new ApiError(404, "Assigned employee not found");
      }
    }

    if (data.project && data.project.trim() !== "") {
      const project = await projectRepository.findById(data.project);

      if (!project) {
        throw new ApiError(404, "Project not found");
      }
    }

    const previousAssignee = resolveId(task.assignedTo);
    const updated = await repository.update(id, data);

    if (
      data.assignedTo &&
      data.assignedTo.trim() !== "" &&
      data.assignedTo !== previousAssignee
    ) {
      await activityService.record({
        task: id,
        type: "ASSIGNED",
        message: "reassigned this task",
      });

      await notificationService.notify({
        recipient: data.assignedTo,
        type: "TASK_ASSIGNED",
        message: `You were assigned the task "${updated?.title ?? task.title}"`,
        task: id,
      });
    }

    return updated;
  }

  async delete(id: string) {
    const task = await repository.findById(id);

    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    await repository.delete(id);
  }

  async search(query: SearchTaskDto) {
    return repository.search(
      query.search,
      query.page,
      query.limit,
      query.status,
      query.priority,
      query.assignedTo,
      query.project,
    );
  }

  async dashboard() {
    const [
      employeeStats,
      statusStats,
      priorityStats,
      completionRate,
      recentEmployees,
      recentTasks,
      totalTasks,
    ] = await Promise.all([
      employeeService.employeeStats(),
      repository.countByStatus(),
      repository.countByPriority(),
      repository.completionRate(),
      employeeService.recentEmployees(5),
      repository.findRecent(5),
      repository.count(),
    ]);

    return {
      overview: {
        totalEmployees: employeeStats.totalEmployees,
        activeEmployees: employeeStats.activeEmployees,
        inactiveEmployees: employeeStats.inactiveEmployees,
        admins: employeeStats.admins,
        employees: employeeStats.employees,

        totalTasks,

        pending: statusStats.pending,
        inProgress: statusStats.inProgress,
        completed: statusStats.completed,

        completionRate,
      },

      priority: priorityStats,

      recentEmployees,

      recentTasks,
    };
  }

  async myTasks(employeeId: string) {
    return repository.findByEmployee(employeeId);
  }

  async updateStatus(
    taskId: string,
    userId: string,
    role: "Admin" | "Employee",
    status: string,
  ) {
    const parsed = updateTaskStatusSchema.safeParse({ status });

    if (!parsed.success) {
      throw new ApiError(400, "Invalid task status");
    }

    const task = await repository.findById(taskId);

    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    const assignedToId = resolveId(task.assignedTo);

    if (role !== "Admin" && assignedToId && assignedToId !== userId) {
      throw new ApiError(403, "This task is not assigned to you.");
    }

    const previousStatus = task.status;
    const updated = await repository.updateStatus(taskId, parsed.data.status);

    await activityService.record({
      task: taskId,
      actor: userId,
      type: "STATUS_CHANGED",
      message: `changed status from ${previousStatus} to ${parsed.data.status}`,
    });

    const recipients = new Set<string>();
    const creatorId = resolveId(task.createdBy);
    const assigneeId = resolveId(task.assignedTo);

    if (creatorId) recipients.add(creatorId);
    if (assigneeId) recipients.add(assigneeId);
    recipients.delete(userId);

    for (const recipient of recipients) {
      await notificationService.notify({
        recipient,
        actor: userId,
        type: "TASK_STATUS",
        message: `Task "${task.title}" was moved to ${parsed.data.status}`,
        task: taskId,
      });
    }

    return updated;
  }

  async count() {
    return repository.count();
  }
}
