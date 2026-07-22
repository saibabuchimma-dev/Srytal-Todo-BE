import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import employeeRoutes from "@/modules/employee/employee.routes";
import tasksRoutes from "@/modules/tasks/task.routes";
import projectsRoutes from "@/modules/project/project.routes";
import commentsRoutes from "@/modules/comment/comment.routes";
import attachmentsRoutes from "@/modules/attachment/attachment.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/employees", employeeRoutes);
router.use("/tasks", tasksRoutes);
router.use("/projects", projectsRoutes);
router.use("/comments", commentsRoutes);
router.use("/attachments", attachmentsRoutes);
export default router;
