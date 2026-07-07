import { Router } from "express";
import { login } from "./auth.controller";

const router = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login (Admin / Employee)
 *     description: |
 *       Login using email and password.
 *
 *       ## Admin Login
 *       - Logs into the **Admin Dashboard**.
 *       - Can manage Employees, Projects and Tasks.
 *
 *       ## Employee Login
 *       - Logs into the **Employee Dashboard**.
 *       - If **mustChangePassword = true**, the employee must change the temporary password before accessing the dashboard.
 *       - After changing the password once, future logins go directly to the dashboard.
 *     tags:
 *       - Auth
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@srytal.com
 *               password:
 *                 type: string
 *                 example: password123
 *
 *     responses:
 *       200:
 *         description: Login Successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *             examples:
 *
 *               AdminLogin:
 *                 summary: Admin Login
 *                 value:
 *                   success: true
 *                   message: Login Successful
 *                   data:
 *                     token: eyJhbGc...
 *                     user:
 *                       id: 686523c5b65cde66f9831d18
 *                       fullName: SRYTAL Admin
 *                       email: admin@srytal.com
 *                       role: Admin
 *                       mustChangePassword: false
 *
 *               EmployeeFirstLogin:
 *                 summary: Employee First Login
 *                 value:
 *                   success: true
 *                   message: Login Successful
 *                   data:
 *                     token: eyJhbGc...
 *                     user:
 *                       id: 686523c5b65cde66f9831d25
 *                       fullName: John Doe
 *                       email: john@srytal.com
 *                       role: Employee
 *                       mustChangePassword: true
 *
 *               EmployeeNormalLogin:
 *                 summary: Employee Login After Password Change
 *                 value:
 *                   success: true
 *                   message: Login Successful
 *                   data:
 *                     token: eyJhbGc...
 *                     user:
 *                       id: 686523c5b65cde66f9831d25
 *                       fullName: John Doe
 *                       email: john@srytal.com
 *                       role: Employee
 *                       mustChangePassword: false
 *
 *       401:
 *         description: Invalid email or password
 */

router.post("/login", login);

export default router;