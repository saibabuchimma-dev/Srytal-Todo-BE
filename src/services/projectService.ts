import { ApiError } from "@/utils/ApiError";
import { Employee } from "@/models/Employee";
import { Project } from "@/models/Project";
import { Task } from "@/models/Task";
import {
  AssignMembersDto,
  CreateProjectDto,
  SearchProjectDto,
  UpdateProjectDto,
} from "@/validations/projectValidations";

const PROJECT_POPULATE = [
  { path: "members", select: "fullName email role avatar" },
  { path: "createdBy", select: "fullName email" },
];

export class ProjectService {
  async create(data: CreateProjectDto, createdBy: string) {
    const exists = await Project.findOne({ name: data.name });

    if (exists) {
      throw new ApiError(409, "Project name already exists");
    }

    if (data.members?.length) {
      for (const memberId of data.members) {
        const employee = await Employee.findById(memberId);

        if (!employee) {
          throw new ApiError(404, `Employee not found: ${memberId}`);
        }
      }
    }

    return Project.create({
      ...data,
      createdBy,
    });
  }

  async findAll() {
    return Project.find().populate(PROJECT_POPULATE).sort({ createdAt: -1 });
  }

  async findById(id: string) {
    const project = await Project.findById(id).populate(PROJECT_POPULATE);

    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    return project;
  }

  async update(id: string, data: Partial<UpdateProjectDto>) {
    const project = await Project.findById(id).populate(PROJECT_POPULATE);

    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    if (data.name && data.name !== project.name) {
      const exists = await Project.findOne({ name: data.name });

      if (exists) {
        throw new ApiError(409, "Project name already exists");
      }
    }

    if (data.members?.length) {
      for (const memberId of data.members) {
        const employee = await Employee.findById(memberId);

        if (!employee) {
          throw new ApiError(404, `Employee not found: ${memberId}`);
        }
      }
    }

    return Project.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).populate(PROJECT_POPULATE);
  }

  async delete(id: string) {
    const project = await Project.findById(id);

    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    await Project.findByIdAndDelete(id);
  }

  async projectDetails(id: string) {
    const project = await Project.findById(id).populate(PROJECT_POPULATE);

    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    const tasks = await Task.find({ project: id })
      .populate("assignedTo", "fullName email avatar role")
      .sort({ createdAt: -1 });

    interface EmployeeBrief {
      _id: unknown;
      fullName: string;
      email: string;
      role: string;
    }

    const employeeMap = new Map<
      string,
      { employee: EmployeeBrief; taskCount: number; tasks: typeof tasks }
    >();

    let pending = 0;
    let completed = 0;
    let inProgress = 0;

    for (const task of tasks) {
      if (task.status === "Pending") pending++;
      if (task.status === "Completed") completed++;
      if (task.status === "In Progress") inProgress++;

      if (!task.assignedTo) continue;

      const employee = task.assignedTo as unknown as EmployeeBrief;
      const employeeKey = String(employee._id);

      if (!employeeMap.has(employeeKey)) {
        employeeMap.set(employeeKey, {
          employee,
          taskCount: 0,
          tasks: [],
        });
      }

      const item = employeeMap.get(employeeKey)!;

      item.taskCount++;
      item.tasks.push(task);
    }

    return {
      project,
      stats: {
        totalTasks: tasks.length,
        completed,
        pending,
        inProgress,
      },
      employees: Array.from(employeeMap.values()),
      tasks,
    };
  }

  async employeeTasks(projectId: string, employeeId: string) {
    return Task.find({
      project: projectId,
      assignedTo: employeeId,
    }).sort({ createdAt: -1 });
  }

  async search(query: SearchProjectDto) {
    const filter: Record<string, unknown> = {};
    const { search = "", page = 1, limit = 10, status } = query;

    if (search.trim()) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (status) {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    const [projects, total] = await Promise.all([
      Project.find(filter)
        .populate(PROJECT_POPULATE)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Project.countDocuments(filter),
    ]);

    return {
      projects,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async assignMembers(projectId: string, data: AssignMembersDto) {
    const project = await Project.findById(projectId);

    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    for (const employeeId of data.employeeIds) {
      const employee = await Employee.findById(employeeId);

      if (!employee) {
        throw new ApiError(404, `Employee not found: ${employeeId}`);
      }
    }

    return Project.findByIdAndUpdate(
      projectId,
      { members: data.employeeIds },
      { new: true },
    ).populate(PROJECT_POPULATE);
  }

  async myProjects(employeeId: string) {
    const projectIds = await Task.find({
      assignedTo: employeeId,
      project: { $ne: null },
    }).distinct("project");

    return Project.find({ _id: { $in: projectIds } })
      .populate(PROJECT_POPULATE)
      .sort({ createdAt: -1 });
  }

  async dashboard() {
    const [totalProjects, planning, inProgress, completed] = await Promise.all([
      Project.countDocuments(),
      Project.countDocuments({ status: "Planning" }),
      Project.countDocuments({ status: "In Progress" }),
      Project.countDocuments({ status: "Completed" }),
    ]);

    return { totalProjects, planning, inProgress, completed };
  }

  async recentProjects(limit = 5) {
    return Project.find()
      .populate(PROJECT_POPULATE)
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  async count() {
    return Project.countDocuments();
  }
}
