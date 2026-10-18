import { Router } from "express";
import {
  accessoryQuerySchema,
  createAccessorySchema,
  idParamSchema,
  updateAccessorySchema,
} from "../schemas/accessory.schema";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../middleware/validate.middleware";
import {
  getAllAccessories,
  getAccessoryById,
  addAccessoryController,
  deleteAccessoryController,
  updateAccessoryController,
} from "../controller/accessories.controller";

const router = Router();

router.get("/", validateQuery(accessoryQuerySchema), getAllAccessories);
router.get("/:id", validateParams(idParamSchema), getAccessoryById);
router.post("/", validateBody(createAccessorySchema), addAccessoryController);
router.patch(
  "/:id",
  validateParams(idParamSchema),
  validateBody(updateAccessorySchema),
  updateAccessoryController,
);
router.delete("/:id", validateParams(idParamSchema), deleteAccessoryController);

export default router;
