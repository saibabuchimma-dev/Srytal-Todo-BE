import { Request, Response } from "express";
import { ProjectService } from "./project.service";

const service = new ProjectService();

export class ProjectController {
  async create(req: Request, res: Response) {
    const user = req.user!;

    const project = await service.create(req.body, user.id);

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  }

  async getAll(_req: Request, res: Response) {
    const projects = await service.findAll();

    res.status(200).json({
      success: true,
      data: projects,
    });
  }

  async getById(req: Request, res: Response) {
    const id = req.params.id as string;

    const project = await service.findById(id);

    res.status(200).json({
      success: true,
      data: project,
    });
  }

  async update(req: Request, res: Response) {
    const id = req.params.id as string;

    const project = await service.update(id, req.body);

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  }

  async delete(req: Request, res: Response) {
    const id = req.params.id as string;

    await service.delete(id);

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  }

  async search(req: Request, res: Response) {
    const result = await service.search({
      search: req.query.search?.toString(),

      page: Number(req.query.page ?? 1),

      limit: Number(req.query.limit ?? 10),

      status: req.query.status?.toString() as
        "Planning" | "In Progress" | "Completed" | undefined,
    });

    res.status(200).json({
      success: true,
      ...result,
    });
  }

  async assignMembers(req: Request, res: Response) {
    const id = req.params.id as string;

    const project = await service.assignMembers(id, req.body);

    res.status(200).json({
      success: true,
      message: "Members assigned successfully",
      data: project,
    });
  }

  async myProjects(req: Request, res: Response) {
    const user = req.user!;

    const projects = await service.myProjects(user.id);

    res.status(200).json({
      success: true,
      data: projects,
    });
  }

  async dashboard(_req: Request, res: Response) {
    const dashboard = await service.dashboard();

    res.status(200).json({
      success: true,
      data: dashboard,
    });
  }

  async recentProjects(_req: Request, res: Response) {
    const projects = await service.recentProjects();

    res.status(200).json({
      success: true,
      data: projects,
    });
  }

  async count(_req: Request, res: Response) {
    const total = await service.count();

    res.status(200).json({
      success: true,
      data: {
        totalProjects: total,
      },
    });
  }
}
