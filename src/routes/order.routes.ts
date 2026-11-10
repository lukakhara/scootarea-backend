import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.middleware";
import * as orderController from "../controller/order.controller";
import { validateBody, validateParams } from "@/middleware/validate.middleware";
import {
  createOrderSchema,
  idParamSchema,
  updateOrderStatusSchema,
} from "@/schemas/order.schema";

const router = Router();

// Customer
router.post(
  "/",
  requireAuth,
  validateBody(createOrderSchema),
  orderController.create,
);
router.get(
  "/",
  requireAuth,
  orderController.listMine,
);
router.get(
  "/:id",
  requireAuth,
  validateParams(idParamSchema),
  orderController.getOne,
);
router.post(
  "/:id/cancel",
  requireAuth,
  validateParams(idParamSchema),
  orderController.cancel,
);

// Admin
router.get("/admin/", requireAuth, requireAdmin, orderController.listAll);
router.patch(
  "/admin/:id/status",
  requireAuth,
  requireAdmin,
  validateParams(idParamSchema),
  validateBody(updateOrderStatusSchema),
  orderController.updateStatus,
);

export default router;
