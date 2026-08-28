import mongoose from "mongoose";
import { ApiError } from "@/utils/ApiError";
import { Employee } from "@/models/Employee";
import { Task } from "@/models/Task";
import { Project } from "@/models/Project";
import {
  CreateTaskDto,
  SearchTaskDto,
  UpdateTaskDto,
} from "@/validations/taskValidations";
import { updateTaskStatusSchema } from "@/validations/taskValidations";
import { EmployeeService } from "./employeeService";
import { NotificationService } from "./notificationService";
import { ActivityService } from "./activityService";

const employeeService = new EmployeeService();
const notificationService = new NotificationService();
const activityService = new ActivityService();

function resolveId(ref: unknown): string | null {
  if (ref && typeof ref === "object" && "_id" in ref) {
    return String((ref as { _id: unknown })._id);
  }
  return ref ? String(ref) : null;
}

const TASK_POPULATE = [
  { path: "assignedTo", select: "fullName email role avatar" },
  { path: "createdBy", select: "fullName email" },
  { path: "project", select: "name status" },
];

export class TaskService {
  async create(data: CreateTaskDto, createdBy: string) {
    if (data.assignedTo && data.assignedTo.trim() !== "") {
      const employee = await Employee.findById(data.assignedTo);

      if (!employee) {
        throw new ApiError(404, "Assigned employee not found");
      }
    }
    if (data.project && data.project.trim() !== "") {
      const project = await Project.findById(data.project);

      if (!project) {
        throw new ApiError(404, "Project not found");
      }
    }

    const task = await Task.create({
      ...data,
      createdBy,
    });

    if (data.project && data.assignedTo) {
      await Project.findByIdAndUpdate(
        data.project,
        { $addToSet: { members: data.assignedTo } },
        { new: true },
      );
    }

    const newTaskId = String(task._id);

    await activityService.record({
      task: newTaskId,
      actor: createdBy,
      type: "TASK_CREATED",
      message: "created this task",
    });

    if (data.assignedTo) {
      await activityService.record({
        task: newTaskId,
        actor: createdBy,
        type: "ASSIGNED",
        message: "assigned this task",
      });

      await notificationService.notify({
        recipient: data.assignedTo,
        actor: createdBy,
        type: "TASK_ASSIGNED",
        message: `You were assigned to "${task.title}"`,
        task: newTaskId,
      });
    }

    return task;
  }

  async findAll() {
    return Task.find().populate(TASK_POPULATE).sort({ createdAt: -1 });
  }

  async findById(id: string) {
    const task = await Task.findById(id).populate(TASK_POPULATE);

    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    return task;
  }

  async update(id: string, data: Partial<UpdateTaskDto>, actorId?: string) {
    const task = await Task.findById(id).populate(TASK_POPULATE);

    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    if (data.assignedTo && data.assignedTo.trim() !== "") {
      const employee = await Employee.findById(data.assignedTo);

      if (!employee) {
        throw new ApiError(404, "Assigned employee not found");
      }
    }

    if (data.project && data.project.trim() !== "") {
      const project = await Project.findById(data.project);

      if (!project) {
        throw new ApiError(404, "Project not found");
      }
    }

    const previousAssignee = resolveId(task.assignedTo);
    const updated = await Task.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).populate(TASK_POPULATE);

    if (data.assignedTo && data.assignedTo.trim() !== "" && data.assignedTo !== previousAssignee) {
      await activityService.record({
        task: id,
        actor: actorId ?? null,
        type: "ASSIGNED",
        message: "assigned this task",
      });

      if (actorId !== data.assignedTo) {
        await notificationService.notify({
          recipient: data.assignedTo,
          actor: actorId ?? null,
          type: "TASK_ASSIGNED",
          message: `You were assigned to "${(task as { title?: string }).title ?? "a task"}"`,
          task: id,
        });
      }
    }

    return updated;
  }

  async delete(id: string) {
    const task = await Task.findById(id);

    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    await Task.findByIdAndDelete(id);
  }

  async search(query: SearchTaskDto) {
    const filter: Record<string, unknown> = {};
    const { search = "", page = 1, limit = 10, status, priority, assignedTo, project } = query;

    if (search.trim()) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (project) filter.project = project;

    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .populate(TASK_POPULATE)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Task.countDocuments(filter),
    ]);

    return { tasks, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async dashboard() {
    const [
      employeeStats,
      pending,
      inProgress,
      completed,
      high,
      medium,
      low,
      completionRate,
      recentEmployees,
      recentTasks,
      totalTasks,
    ] = await Promise.all([
      employeeService.employeeStats(),
      Task.countDocuments({ status: "Pending" }),
      Task.countDocuments({ status: "In Progress" }),
      Task.countDocuments({ status: "Completed" }),
      Task.countDocuments({ priority: "High" }),
      Task.countDocuments({ priority: "Medium" }),
      Task.countDocuments({ priority: "Low" }),
      (async () => {
        const [t, c] = await Promise.all([
          Task.countDocuments(),
          Task.countDocuments({ status: "Completed" }),
        ]);
        return t === 0 ? 0 : Math.round((c / t) * 100);
      })(),
      employeeService.recentEmployees(5),
      Task.find()
        .populate(TASK_POPULATE)
        .sort({ createdAt: -1 })
        .limit(5),
      Task.countDocuments(),
    ]);

    return {
      overview: {
        totalEmployees: employeeStats.totalEmployees,
        activeEmployees: employeeStats.activeEmployees,
        inactiveEmployees: employeeStats.inactiveEmployees,
        admins: employeeStats.admins,
        employees: employeeStats.employees,
        totalTasks,
        pending,
        inProgress,
        completed,
        completionRate,
      },
      priority: { high, medium, low },
      recentEmployees,
      recentTasks,
    };
  }

  async myTasks(employeeId: string) {
    return Task.find({ assignedTo: employeeId })
      .populate(TASK_POPULATE)
      .sort({ dueDate: 1 });
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

    const task = await Task.findById(taskId).populate(TASK_POPULATE);

    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    const assignedRef: unknown = task.assignedTo;
    const assignedId =
      assignedRef && typeof assignedRef === "object" && "_id" in assignedRef
        ? String((assignedRef as { _id: unknown })._id)
        : assignedRef
          ? String(assignedRef)
          : null;

    if (role !== "Admin" && assignedId !== userId) {
      throw new ApiError(403, "This task is not assigned to you.");
    }

    const updated = await Task.findByIdAndUpdate(
      taskId,
      { status: parsed.data.status },
      { new: true },
    )
      .populate("assignedTo", "-password")
      .populate("project", "name status");

    const title = (task as { title?: string }).title ?? "the task";
    const createdById = resolveId(task.createdBy);

    await activityService.record({
      task: taskId,
      actor: userId,
      type: "STATUS_CHANGED",
      message: `changed the status to ${parsed.data.status}`,
    });

    const recipients = [assignedId, createdById].filter(
      (id): id is string => !!id && id !== userId,
    );

    for (const recipient of [...new Set(recipients)]) {
      await notificationService.notify({
        recipient,
        actor: userId,
        type: "TASK_STATUS",
        message: `"${title}" was moved to ${parsed.data.status}`,
        task: taskId,
      });
    }

    return updated;
  }

  async count() {
    return Task.countDocuments();
  }
}
