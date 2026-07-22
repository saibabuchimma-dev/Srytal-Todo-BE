import { Router } from "express";
import { authMiddleware } from "@/middleware/auth.middleware";
import { CommentController } from "./comment.controller";

const router = Router();
const controller = new CommentController();

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Task comment APIs
 */

/**
 * @swagger
 * /comments/task/{taskId}:
 *   get:
 *     summary: List comments for a task
 *     tags: [Comments]
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
 *         description: Comments for the task
 */
router.get(
  "/task/:taskId",
  authMiddleware,
  controller.list.bind(controller),
);

/**
 * @swagger
 * /comments/task/{taskId}:
 *   post:
 *     summary: Add a comment to a task
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: Looks good, moving this forward.
 *     responses:
 *       201:
 *         description: Comment added successfully
 */
router.post(
  "/task/:taskId",
  authMiddleware,
  controller.create.bind(controller),
);

/**
 * @swagger
 * /comments/{id}:
 *   patch:
 *     summary: Edit your own comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       403:
 *         description: You can only edit your own comment
 */
router.patch(
  "/:id",
  authMiddleware,
  controller.update.bind(controller),
);

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Delete a comment (author or admin)
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       403:
 *         description: You can only delete your own comment
 */
router.delete(
  "/:id",
  authMiddleware,
  controller.delete.bind(controller),
);

export default router;
