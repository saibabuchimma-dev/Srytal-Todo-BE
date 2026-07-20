import { Router } from "express";
import { authMiddleware } from "@/middleware/auth.middleware";
import { EmployeeController } from "./employee.controller";
import { authorize } from "@/middleware/authorize.middleware";

const router = Router();
const controller = new EmployeeController();

/**
 * @swagger
 * tags:
 *   name: Employees
 *   description: Employee Management APIs
 */

/**
 * @swagger
 * /employees:
 *   post:
 *     summary: Create Employee
 *     tags:
 *       - Employees
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEmployee'
 *     responses:
 *       201:
 *         description: Employee created successfully
 */
router.post(
  "/",
  authMiddleware,
  authorize("Admin"),
  controller.create.bind(controller),
);

/**
 * @swagger
 * /employees:
 *   get:
 *     summary: Get All Employees
 *     description: Returns all employees.
 *     tags:
 *       - Employees
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Employee list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmployeeListResponse'
 */
router.get(
  "/",
  authMiddleware,
  authorize("Admin"),
  controller.getAll.bind(controller),
);

/**
 * @swagger
 * /employees/search:
 *   get:
 *     summary: Search Employees
 *     description: Search employees by full name or email.
 *     tags:
 *       - Employees
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         example: john
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Search result
 */
router.get(
  "/search",
  authMiddleware,
  authorize("Admin"),
  controller.search.bind(controller),
);

/**
 * @swagger
 * /employees/count:
 *   get:
 *     summary: Employee Count
 *     tags:
 *       - Employees
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Total employees
 */
router.get(
  "/count",
  authMiddleware,
  authorize("Admin"),
  controller.count.bind(controller),
);

/**
 * @swagger
 * /employees/change-password:
 *   patch:
 *     summary: Change Password
 *     description: Change password for the logged-in user.
 *     tags:
 *       - Employees
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: Temp@123
 *               newPassword:
 *                 type: string
 *                 example: Sai@12345
 *               confirmPassword:
 *                 type: string
 *                 example: Sai@12345
 *     responses:
 *       200:
 *         description: Password changed successfully
 */
router.patch(
  "/change-password",
  authMiddleware,
  controller.changePassword.bind(controller),
);

router.get("/me", authMiddleware, controller.me.bind(controller));

/**
 * @swagger
 * /employees/{id}:
 *   get:
 *     summary: Get Employee By ID
 *     description: Returns a single employee.
 *     tags:
 *       - Employees
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 68653d61b65cde66f9831d4c
 *     responses:
 *       200:
 *         description: Employee found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmployeeResponse'
 *       404:
 *         description: Employee not found
 */
router.get(
  "/:id",
  authMiddleware,
  authorize("Admin"),
  controller.getById.bind(controller),
);

/**
 * @swagger
 * /employees/{id}:
 *   put:
 *     summary: Update Employee
 *     description: Update employee information.
 *     tags:
 *       - Employees
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 68653d61b65cde66f9831d4c
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateEmployee'
 *           example:
 *             fullName: John Smith
 *             email: johnsmith@example.com
 *             role: Admin
 *             avatar: https://avatar.com/john.png
 *             isActive: true
 *     responses:
 *       200:
 *         description: Employee updated successfully
 */
router.put(
  "/:id",
  authMiddleware,
  authorize("Admin"),
  controller.update.bind(controller),
);

/**
 * @swagger
 * /employees/{id}:
 *   delete:
 *     summary: Delete Employee
 *     description: Delete an employee.
 *     tags:
 *       - Employees
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 68653d61b65cde66f9831d4c
 *     responses:
 *       200:
 *         description: Employee deleted successfully
 *       404:
 *         description: Employee not found
 */
router.delete(
  "/:id",
  authMiddleware,
  authorize("Admin"),
  controller.delete.bind(controller),
);

export default router;
