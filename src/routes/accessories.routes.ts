import { Router } from "express";
import * as accessoriesController from "../controller/accessories.controller";
import { accessoryQuerySchema, idParamSchema } from "../schemas/accessory";
import { validateParams, validateQuery } from "../middleware/validate"

const router = Router();

router.get("/", validateQuery(accessoryQuerySchema), accessoriesController.getAllAccessories);
router.get("/:id", validateParams(idParamSchema), accessoriesController.getAccessoryById);

export default router;