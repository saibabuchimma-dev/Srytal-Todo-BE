import { Router } from "express";
import { authMiddleware } from "@/middlewares/authMiddleware";
import { upload } from "@/config/multer";
import { AttachmentController } from "@/controllers/attachmentController";

const router = Router();
const controller = new AttachmentController();

/**
 * @swagger
 * tags:
 *   name: Attachments
 *   description: Task file attachment APIs
 */

/**
 * @swagger
 * /attachments/task/{taskId}:
 *   get:
 *     summary: List attachments for a task
 *     tags: [Attachments]
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
 *         description: Attachments for the task
 */
router.get(
  "/task/:taskId",
  authMiddleware,
  controller.list.bind(controller),
);

/**
 * @swagger
 * /attachments/task/{taskId}:
 *   post:
 *     summary: Upload a file attachment to a task
 *     tags: [Attachments]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *       400:
 *         description: File is required
 */
router.post(
  "/task/:taskId",
  authMiddleware,
  upload.single("file"),
  controller.upload.bind(controller),
);

/**
 * @swagger
 * /attachments/{id}:
 *   delete:
 *     summary: Delete an attachment (uploader or admin)
 *     tags: [Attachments]
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
 *         description: Attachment deleted successfully
 *       403:
 *         description: You can only delete your own attachment
 */
router.delete(
  "/:id",
  authMiddleware,
  controller.delete.bind(controller),
);

export default router;
