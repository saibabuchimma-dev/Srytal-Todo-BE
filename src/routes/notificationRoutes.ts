import { Router } from "express";
import { authMiddleware } from "@/middlewares/authMiddleware";
import { NotificationController } from "@/controllers/notificationController";

const router = Router();
const controller = new NotificationController();

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: In-app notification APIs
 */

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: List my notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications for the logged-in user
 */
router.get("/", authMiddleware, controller.list.bind(controller));

/**
 * @swagger
 * /notifications/unread-count:
 *   get:
 *     summary: Count my unread notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Unread notification count
 */
router.get(
  "/unread-count",
  authMiddleware,
  controller.unreadCount.bind(controller),
);

/**
 * @swagger
 * /notifications/read-all:
 *   patch:
 *     summary: Mark all my notifications as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 */
router.patch(
  "/read-all",
  authMiddleware,
  controller.markAllRead.bind(controller),
);

/**
 * @swagger
 * /notifications/{id}/read:
 *   patch:
 *     summary: Mark a notification as read
 *     tags: [Notifications]
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
 *         description: Notification marked as read
 */
router.patch("/:id/read", authMiddleware, controller.markRead.bind(controller));

/**
 * @swagger
 * /notifications/{id}:
 *   delete:
 *     summary: Delete a notification
 *     tags: [Notifications]
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
 *         description: Notification deleted
 */
router.delete("/:id", authMiddleware, controller.remove.bind(controller));

export default router;
