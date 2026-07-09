import { ApiError } from "@/utils/ApiError";
import { EmployeeRepository } from "../employee/employee.repository";
import { ProjectRepository } from "./project.repository";
import {
  AssignMembersDto,
  CreateProjectDto,
  SearchProjectDto,
  UpdateProjectDto,
} from "./project.types";

const repository = new ProjectRepository();
const employeeRepository = new EmployeeRepository();

export class ProjectService {
  async create(data: CreateProjectDto, createdBy: string) {
    const exists = await repository.findByName(data.name);

    if (exists) {
      throw new ApiError(409, "Project name already exists");
    }

    if (data.members?.length) {
      for (const memberId of data.members) {
        const employee = await employeeRepository.findById(memberId);

        if (!employee) {
          throw new ApiError(404, `Employee not found: ${memberId}`);
        }
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
    const project = await repository.findById(id);

    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    return project;
  }

  async update(id: string, data: Partial<UpdateProjectDto>) {
    const project = await repository.findById(id);

    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    if (data.name && data.name !== project.name) {
      const exists = await repository.findByName(data.name);

      if (exists) {
        throw new ApiError(409, "Project name already exists");
      }
    }

    if (data.members?.length) {
      for (const memberId of data.members) {
        const employee = await employeeRepository.findById(memberId);

        if (!employee) {
          throw new ApiError(404, `Employee not found: ${memberId}`);
        }
      }
    }

    return repository.update(id, data);
  }

  async delete(id: string) {
    const project = await repository.findById(id);

    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    await repository.delete(id);
  }

  async projectDetails(id:string){
   const project =
      await repository.findProjectDetails(id);

   if(!project){
      throw new ApiError(404,"Project not found");
   }

   return project;
}

async employeeTasks(projectId:string, employeeId:string){
   return repository.getEmployeeTasks(
      projectId,
      employeeId
   );
}

  async search(query: SearchProjectDto) {
    return repository.search(
      query.search,
      query.page,
      query.limit,
      query.status,
    );
  }

  async assignMembers(projectId: string, data: AssignMembersDto) {
    const project = await repository.findById(projectId);

    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    for (const employeeId of data.employeeIds) {
      const employee = await employeeRepository.findById(employeeId);

      if (!employee) {
        throw new ApiError(404, `Employee not found: ${employeeId}`);
      }
    }

    return repository.assignMembers(projectId, data.employeeIds);
  }

  async myProjects(employeeId: string) {
    return repository.myProjects(employeeId);
  }

  async dashboard() {
    return repository.dashboard();
  }

  async recentProjects(limit = 5) {
    return repository.findRecent(limit);
  }

  async count() {
    return repository.count();
  }
}
