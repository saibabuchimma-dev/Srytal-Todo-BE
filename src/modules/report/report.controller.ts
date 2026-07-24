import { Request, Response } from "express";
import { ReportService } from "./report.service";

const service = new ReportService();

export class ReportController {
  async overview(_req: Request, res: Response) {
    const data = await service.overview();

    res.status(200).json({
      success: true,
      data,
    });
  }
}
