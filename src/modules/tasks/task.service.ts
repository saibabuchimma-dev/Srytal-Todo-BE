import { ApiError } from "@/utils/ApiError";
import { EmployeeRepository } from "../employee/employee.repository";
import { TaskRepository } from "./task.repository";
import { CreateTaskDto, SearchTaskDto, UpdateTaskDto } from "./task.types";

const repository = new TaskRepository();
const employeeRepository = new EmployeeRepository();

export class TaskService {
 
  async create(data: CreateTaskDto, createdBy: string) {
    if (data.assignedTo) {
      const employee = await employeeRepository.findById(data.assignedTo);

      if (!employee) {
        throw new ApiError(404, "Assigned employee not found");
      }
    }

    return repository.create({
      ...data,
      createdBy,
    });
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

    if (data.assignedTo) {
      const employee = await employeeRepository.findById(data.assignedTo);

      if (!employee) {
        throw new ApiError(404, "Assigned employee not found");
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
    );
  }

  async dashboard() {
    return repository.dashboard();
  }

  async myTasks(employeeId: string) {
    return repository.findByEmployee(employeeId);
  }

  async count() {
    return repository.count();
  }
}
