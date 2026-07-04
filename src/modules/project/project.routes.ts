import { Router } from "express";
import { authMiddleware } from "@/middleware/auth.middleware";
import { authorize } from "@/middleware/authorize.middleware";
import { ProjectController } from "./project.controller";

const router = Router();
const controller = new ProjectController();

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Project Management APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateProject:
 *       type: object
 *       required:
 *         - name
 *         - startDate
 *         - endDate
 *       properties:
 *         name:
 *           type: string
 *           example: Employee Task Management
 *         description:
 *           type: string
 *           example: Backend API Development
 *         status:
 *           type: string
 *           enum:
 *             - Planning
 *             - In Progress
 *             - Completed
 *           example: Planning
 *         startDate:
 *           type: string
 *           format: date
 *           example: 2026-07-10
 *         endDate:
 *           type: string
 *           format: date
 *           example: 2026-08-30
 *         members:
 *           type: array
 *           items:
 *             type: string
 *           example:
 *             - 686523c5b65cde66f9831d18
 *             - 686523c5b65cde66f9831d25
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AssignMembers:
 *       type: object
 *       required:
 *         - employeeIds
 *       properties:
 *         employeeIds:
 *           type: array
 *           items:
 *             type: string
 *           example:
 *             - 686523c5b65cde66f9831d18
 *             - 686523c5b65cde66f9831d25
 */

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Create Project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProject'
 *     responses:
 *       201:
 *         description: Project created successfully
 */
router.post(
  "/",
  authMiddleware,
  authorize("Admin"),
  controller.create.bind(controller),
);

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Get All Projects
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of projects
 */
router.get("/", authMiddleware, controller.getAll.bind(controller));

/**
 * @swagger
 * /projects/search:
 *   get:
 *     summary: Search Projects
 *     tags: [Projects]
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
 *           enum:
 *             - Planning
 *             - In Progress
 *             - Completed
 *     responses:
 *       200:
 *         description: Filtered projects
 */
router.get("/search", authMiddleware, controller.search.bind(controller));

/**
 * @swagger
 * /projects/dashboard:
 *   get:
 *     summary: Project Dashboard
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 */
router.get("/dashboard", authMiddleware, controller.dashboard.bind(controller));

/**
 * @swagger
 * /projects/recent:
 *   get:
 *     summary: Recent Projects
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recent projects
 */
router.get(
  "/recent",
  authMiddleware,
  controller.recentProjects.bind(controller),
);

/**
 * @swagger
 * /projects/my-projects:
 *   get:
 *     summary: My Projects
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged in employee projects
 */
router.get(
  "/my-projects",
  authMiddleware,
  controller.myProjects.bind(controller),
);

/**
 * @swagger
 * /projects/count:
 *   get:
 *     summary: Total Projects
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Total project count
 */
router.get("/count", authMiddleware, controller.count.bind(controller));

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Get Project By Id
 *     tags: [Projects]
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
 *         description: Project details
 */
router.get("/:id", authMiddleware, controller.getById.bind(controller));

/**
 * @swagger
 * /projects/{id}:
 *   put:
 *     summary: Update Project
 *     tags: [Projects]
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
 *             $ref: '#/components/schemas/CreateProject'
 *     responses:
 *       200:
 *         description: Project updated successfully
 */
router.put(
  "/:id",
  authMiddleware,
  authorize("Admin"),
  controller.update.bind(controller),
);

/**
 * @swagger
 * /projects/{id}:
 *   delete:
 *     summary: Delete Project
 *     tags: [Projects]
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
 *         description: Project deleted successfully
 */
router.delete(
  "/:id",
  authMiddleware,
  authorize("Admin"),
  controller.delete.bind(controller),
);

/**
 * @swagger
 * /projects/{id}/members:
 *   patch:
 *     summary: Assign Members
 *     tags: [Projects]
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
 *             $ref: '#/components/schemas/AssignMembers'
 *     responses:
 *       200:
 *         description: Members assigned successfully
 */
router.patch(
  "/:id/members",
  authMiddleware,
  authorize("Admin"),
  controller.assignMembers.bind(controller),
);

export default router;
