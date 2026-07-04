import { Router } from "express";
import { login } from "./auth.controller";

const router = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login
 *     description: Login using email and password.
 *     tags:
 *       - Auth
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
 *     responses:
 *       200:
 *         description: Login Successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Login Successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: 686523c5b65cde66f9831d18
 *                         fullName:
 *                           type: string
 *                           example: SRYTAL Admin
 *                         email:
 *                           type: string
 *                           example: admin@srytal.com
 *                         role:
 *                           type: string
 *                           enum:
 *                             - Admin
 *                             - Employee
 *                           example: Admin
 *                         mustChangePassword:
 *                           type: boolean
 *                           example: true
 *       401:
 *         description: Invalid email or password
 */

router.post("/login", login);

export default router;
