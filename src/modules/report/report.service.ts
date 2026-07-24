import { ReportRepository } from "./report.repository";

const repository = new ReportRepository();

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export class ReportService {
  async overview() {
    const months = 6;
    const start = new Date();
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    start.setMonth(start.getMonth() - (months - 1));

    const [status, priority, totalTasks, totalEmployees, monthlyRows] =
      await Promise.all([
        repository.statusCounts(),
        repository.priorityCounts(),
        repository.totalTasks(),
        repository.totalEmployees(),
        repository.monthlyCounts(start),
      ]);

    const monthlyTasks: { month: string; count: number }[] = [];
    const cursor = new Date(start);

    for (let i = 0; i < months; i += 1) {
      const year = cursor.getFullYear();
      const month = cursor.getMonth() + 1;

      const row = monthlyRows.find(
        (item) => item._id.year === year && item._id.month === month,
      );

      monthlyTasks.push({
        month: `${MONTH_LABELS[cursor.getMonth()]} ${String(year).slice(2)}`,
        count: row?.count ?? 0,
      });

      cursor.setMonth(cursor.getMonth() + 1);
    }

    const completionRate =
      totalTasks === 0 ? 0 : Math.round((status.completed / totalTasks) * 100);

    return {
      totals: {
        totalTasks,
        totalEmployees,
        completed: status.completed,
        completionRate,
      },

      statusDistribution: [
        { name: "Pending", value: status.pending },
        { name: "In Progress", value: status.inProgress },
        { name: "Completed", value: status.completed },
      ],

      priorityDistribution: [
        { name: "Low", value: priority.low },
        { name: "Medium", value: priority.medium },
        { name: "High", value: priority.high },
      ],

      monthlyTasks,
    };
  }
}
