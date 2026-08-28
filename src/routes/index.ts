import { Router } from "express";
import authRoutes from "@/routes/authRoutes";
import employeeRoutes from "@/routes/employeeRoutes";
import tasksRoutes from "@/routes/taskRoutes";
import projectsRoutes from "@/routes/projectRoutes";
import commentsRoutes from "@/routes/commentRoutes";
import attachmentsRoutes from "@/routes/attachmentRoutes";
import notificationsRoutes from "@/routes/notificationRoutes";
import activitiesRoutes from "@/routes/activityRoutes";
import reportsRoutes from "@/routes/reportRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/employees", employeeRoutes);
router.use("/tasks", tasksRoutes);
router.use("/projects", projectsRoutes);
router.use("/comments", commentsRoutes);
router.use("/attachments", attachmentsRoutes);
router.use("/notifications", notificationsRoutes);
router.use("/activities", activitiesRoutes);
router.use("/reports", reportsRoutes);
export default router;
