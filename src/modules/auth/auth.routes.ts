import { Router } from 'express';
import { login } from './auth.controller';

const router = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Login Success
 */

router.post('/login', login);

export default router;