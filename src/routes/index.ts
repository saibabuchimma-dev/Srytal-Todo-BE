import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import employeeRoutes from '@/modules/employee/employee.routes';
import tasksRoutes from '@/modules/tasks/task.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/employees', employeeRoutes);
router.use('/tasks', tasksRoutes);
export default router;