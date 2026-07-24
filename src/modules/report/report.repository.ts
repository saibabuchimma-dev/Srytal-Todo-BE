import { Task } from "../tasks/task.model";
import { Employee } from "../employee/employee.model";

export interface MonthlyCountRow {
  _id: { year: number; month: number };
  count: number;
}

export class ReportRepository {
  async statusCounts() {
    const [pending, inProgress, completed] = await Promise.all([
      Task.countDocuments({ status: "Pending" }),
      Task.countDocuments({ status: "In Progress" }),
      Task.countDocuments({ status: "Completed" }),
    ]);

    return { pending, inProgress, completed };
  }

  async priorityCounts() {
    const [low, medium, high] = await Promise.all([
      Task.countDocuments({ priority: "Low" }),
      Task.countDocuments({ priority: "Medium" }),
      Task.countDocuments({ priority: "High" }),
    ]);

    return { low, medium, high };
  }

  async totalTasks() {
    return Task.countDocuments();
  }

  async totalEmployees() {
    return Employee.countDocuments();
  }

  async monthlyCounts(start: Date) {
    return Task.aggregate<MonthlyCountRow>([
      { $match: { createdAt: { $gte: start } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
    ]);
  }
}
