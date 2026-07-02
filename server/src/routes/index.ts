import { Router } from 'express';

const router = Router();

router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running successfully 🚀',
    timestamp: new Date(),
  });
});

export default router;