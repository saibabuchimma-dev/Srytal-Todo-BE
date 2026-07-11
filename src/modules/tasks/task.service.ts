import { ApiError } from "@/utils/ApiError";
import { EmployeeRepository } from "../employee/employee.repository";
import { TaskRepository } from "./task.repository";
import { CreateTaskDto, SearchTaskDto, UpdateTaskDto } from "./task.types";
import { EmployeeService } from "../employee/employee.service";
import { ProjectRepository } from "../project/project.repository";

const repository = new TaskRepository();
const employeeRepository = new EmployeeRepository();
const employeeService = new EmployeeService();
const projectRepository = new ProjectRepository();

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

    return repository.update(id, data);
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

  async updateStatus(taskId: string, employeeId: string, status: string) {
    const task = await repository.findById(taskId);

    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    if (task.assignedTo && task.assignedTo.toString() !== employeeId) {
      throw new ApiError(403, "This task is not assigned to you.");
    }

    return repository.updateStatus(taskId, status);
  }

  async count() {
    return repository.count();
  }
}
