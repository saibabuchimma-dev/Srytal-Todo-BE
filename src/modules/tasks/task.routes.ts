import { Router } from "express";
import { authMiddleware } from "@/middleware/auth.middleware";
import { TaskController } from "./task.controller";
import { authorize } from "@/middleware/authorize.middleware";
import { forcePasswordChange } from "@/middleware/forcePasswordChange.middleware";

const router = Router();
const controller = new TaskController();

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task Management APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 CreateTask:
  type: object
  required:
    - title
    - dueDate
  properties:
    assignedTo:
      type: string
      nullable: true
      example: 686523c5b65cde66f9831d18

    project:
      type: string
      nullable: true
      example: 68771234c5b65cde66f983555

    title:
      type: string
      example: Design Login UI
    description:
      type: string
      example: Create responsive login page
    status:
      type: string
      enum:
        - Pending
        - In Progress
        - Completed
    priority:
      type: string
      enum:
        - Low
        - Medium
        - High
    dueDate:
      type: string
      format: date
      example: 2026-07-10
 */

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create Task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTask'
 *     responses:
 *       201:
 *         description: Task created successfully
 */
router.post(
  "/",
  authMiddleware,
  authorize("Admin"),
  controller.create.bind(controller),
);

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get All Tasks
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tasks
 */
router.get(
  "/",
  authMiddleware,
  authorize("Admin"),
  controller.getAll.bind(controller),
);

/**
 * @swagger
 * /tasks/search:
 *   get:
 *     summary: Search Tasks
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *       - in: query
 *         name: assignedTo
 *         schema:
 *           type: string
*        - in: query
            name: project
            schema:
              type: string
 *     responses:
 *       200:
 *         description: Filtered task list
 */
router.get(
  "/search",
  authMiddleware,
  forcePasswordChange,
  controller.search.bind(controller),
);

/**
 * @swagger
 * /tasks/dashboard:
 *   get:
 *     summary: Get Dashboard Statistics
 *     description: Returns employee statistics, task statistics, recent employees and recent tasks.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics returned successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/dashboard", authMiddleware, controller.dashboard.bind(controller));

/**
 * @swagger
 * /tasks/my-tasks:
 *   get:
 *     summary: My Tasks
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged in user's tasks
 */
router.get(
  "/my-tasks",
  authMiddleware,
  authorize("Employee"),
  forcePasswordChange,
  controller.myTasks.bind(controller),
);

/**
 * @swagger
 * /tasks/count:
 *   get:
 *     summary: Total Task Count
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Total number of tasks
 */
router.get("/count", authMiddleware, controller.count.bind(controller));

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get Task By Id
 *     tags: [Tasks]
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
 *         description: Task details
 */
router.get("/:id", authMiddleware, controller.getById.bind(controller));

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update Task
 *     tags: [Tasks]
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
 *             $ref: '#/components/schemas/CreateTask'
 *     responses:
 *       200:
 *         description: Task updated successfully
 */
router.put(
  "/:id",
  authMiddleware,
  authorize("Admin"),
  controller.update.bind(controller),
);

/**
 * @swagger
 * /tasks/{id}/status:
 *   patch:
 *     summary: Update Task Status
 *     description: Employee can update the status of their assigned task.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Task ID
 *         schema:
 *           type: string
 *           example: 686523c5b65cde66f9831d18
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - Pending
 *                   - In Progress
 *                   - Completed
 *                 example: In Progress
 *     responses:
 *       200:
 *         description: Task status updated successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: This task is not assigned to you
 *       404:
 *         description: Task not found
 */
router.patch(
  "/:id/status",
  authMiddleware,
  authorize("Employee"),
  controller.updateStatus.bind(controller),
);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete Task
 *     tags: [Tasks]
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
 *         description: Task deleted successfully
 */
router.delete(
  "/:id",
  authMiddleware,
  authorize("Admin"),
  controller.delete.bind(controller),
);

export default router;
