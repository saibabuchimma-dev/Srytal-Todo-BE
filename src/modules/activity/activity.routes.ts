import { Router } from "express";
import { authMiddleware } from "@/middleware/auth.middleware";
import { ActivityController } from "./activity.controller";

const router = Router();
const controller = new ActivityController();

/**
 * @swagger
 * tags:
 *   name: Activities
 *   description: Task activity timeline APIs
 */

/**
 * @swagger
 * /activities/task/{taskId}:
 *   get:
 *     summary: List the activity timeline for a task
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chronological activity for the task
 */
router.get("/task/:taskId", authMiddleware, controller.list.bind(controller));

export default router;
