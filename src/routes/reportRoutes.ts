import { Router } from "express";
import { authMiddleware } from "@/middlewares/authMiddleware";
import { authorize } from "@/middlewares/authorizeMiddleware";
import { ReportController } from "@/controllers/reportController";

const router = Router();
const controller = new ReportController();

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Analytics and reporting APIs
 */

/**
 * @swagger
 * /reports/overview:
 *   get:
 *     summary: Analytics overview (totals, status/priority distribution, monthly tasks)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics overview
 *       403:
 *         description: Forbidden
 */
router.get(
  "/overview",
  authMiddleware,
  authorize("Admin"),
  controller.overview.bind(controller),
);

export default router;
