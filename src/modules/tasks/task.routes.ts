import { Router } from 'express';
import { authMiddleware } from '@/middleware/auth.middleware';
import { TaskController } from './task.controller';
import { authorize } from '@/middleware/authorize.middleware';

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
 *     CreateTask:
 *       type: object
 *       required:
 *         - assignedTo
 *         - title
 *         - dueDate
 *       properties:
 *         assignedTo:
 *           type: string
 *           example: 686523c5b65cde66f9831d18
 *         title:
 *           type: string
 *           example: Design Login UI
 *         description:
 *           type: string
 *           example: Create responsive login page
 *         status:
 *           type: string
 *           enum:
 *             - Pending
 *             - In Progress
 *             - Completed
 *           example: Pending
 *         priority:
 *           type: string
 *           enum:
 *             - Low
 *             - Medium
 *             - High
 *           example: High
 *         dueDate:
 *           type: string
 *           format: date
 *           example: 2026-07-10
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
  '/',
  authMiddleware,
  authorize('Admin'),
  controller.create.bind(controller)
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
  '/',
  authMiddleware,
  controller.getAll.bind(controller)
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
 *     responses:
 *       200:
 *         description: Filtered task list
 */
router.get(
  '/search',
  authMiddleware,
  controller.search.bind(controller)
);

/**
 * @swagger
 * /tasks/dashboard:
 *   get:
 *     summary: Dashboard Statistics
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 */
router.get(
  '/dashboard',
  authMiddleware,
  controller.dashboard.bind(controller)
);

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
  '/my-tasks',
  authMiddleware,
  controller.myTasks.bind(controller)
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
router.get(
  '/count',
  authMiddleware,
  controller.count.bind(controller)
);

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
router.get(
  '/:id',
  authMiddleware,
  controller.getById.bind(controller)
);

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
  '/:id',
  authMiddleware,
  controller.update.bind(controller)
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
  '/:id',
  authMiddleware,
  controller.delete.bind(controller)
);

export default router;