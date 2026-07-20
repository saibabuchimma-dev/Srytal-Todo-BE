import { Project } from "./project.model";
import { CreateProjectDto, UpdateProjectDto } from "./project.types";
import { Task } from "../tasks/task.model";

export class ProjectRepository {
  async create(
    data: CreateProjectDto & {
      createdBy: string;
    },
  ) {
    return Project.create(data);
  }

  async findAll() {
    return Project.find()
      .populate("members", "fullName email role avatar")
      .populate("createdBy", "fullName email")
      .sort({
        createdAt: -1,
      });
  }

  async findById(id: string) {
    return Project.findById(id)
      .populate("members", "fullName email role avatar")
      .populate("createdBy", "fullName email");
  }

  async findByName(name: string) {
    return Project.findOne({
      name,
    });
  }

  async update(id: string, data: Partial<UpdateProjectDto>) {
    return Project.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    })
      .populate("members", "fullName email role avatar")
      .populate("createdBy", "fullName email");
  }

  async delete(id: string) {
    return Project.findByIdAndDelete(id);
  }

  async getEmployeeTasks(projectId: string, employeeId: string) {
    return Task.find({
      project: projectId,
      assignedTo: employeeId,
    }).sort({
      createdAt: -1,
    });
  }

  async search(search = "", page = 1, limit = 10, status?: string) {
    const filter: Record<string, unknown> = {};

    if (search.trim()) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (status) {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    const [projects, total] = await Promise.all([
      Project.find(filter)
        .populate("members", "fullName email role avatar")
        .populate("createdBy", "fullName email")
        .sort({
          createdAt: -1,
        })
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

  async assignMembers(id: string, members: string[]) {
    return Project.findByIdAndUpdate(
      id,
      {
        members,
      },
      {
        new: true,
      },
    )
      .populate("members", "fullName email role avatar")
      .populate("createdBy", "fullName email");
  }

  async myProjects(employeeId: string) {
    const projectIds = await Task.find({
      assignedTo: employeeId,
      project: { $ne: null },
    }).distinct("project");

    return Project.find({
      _id: { $in: projectIds },
    })
      .populate("members", "fullName email role avatar")
      .populate("createdBy", "fullName email")
      .sort({
        createdAt: -1,
      });
  }

  async findProjectDetails(id: string) {
    const project = await Project.findById(id)
      .populate("members", "fullName email role avatar")
      .populate("createdBy", "fullName email");

    if (!project) {
      return null;
    }

    const tasks = await Task.find({
      project: id,
    })
      .populate("assignedTo", "fullName email avatar role")
      .sort({
        createdAt: -1,
      });

    const employeeMap = new Map();

    let pending = 0;
    let completed = 0;
    let inProgress = 0;

    for (const task of tasks) {
      if (task.status === "Pending") pending++;
      if (task.status === "Completed") completed++;
      if (task.status === "In Progress") inProgress++;

      if (!task.assignedTo) continue;

      const employee = task.assignedTo as any;

      if (!employeeMap.has(employee._id.toString())) {
        employeeMap.set(employee._id.toString(), {
          employee,
          taskCount: 0,
          tasks: [],
        });
      }

      const item = employeeMap.get(employee._id.toString());

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

  async addMember(projectId: string, employeeId: string) {
    return Project.findByIdAndUpdate(
      projectId,
      {
        $addToSet: {
          members: employeeId,
        },
      },
      {
        new: true,
      },
    );
  }

  async dashboard() {
    const [totalProjects, planning, inProgress, completed] = await Promise.all([
      Project.countDocuments(),

      Project.countDocuments({
        status: "Planning",
      }),

      Project.countDocuments({
        status: "In Progress",
      }),

      Project.countDocuments({
        status: "Completed",
      }),
    ]);

    return {
      totalProjects,
      planning,
      inProgress,
      completed,
    };
  }

  async findRecent(limit = 5) {
    return Project.find()
      .populate("members", "fullName email role avatar")
      .populate("createdBy", "fullName email")
      .sort({
        createdAt: -1,
      })
      .limit(limit);
  }

  async count() {
    return Project.countDocuments();
  }
}
