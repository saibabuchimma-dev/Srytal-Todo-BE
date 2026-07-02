import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import employeeRoutes from '@/modules/employee/employee.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/employees', employeeRoutes);

export default router;