import { Router } from "express";
import * as accessoriesController from "../controller/accessories.controller";
import { accessoryQuerySchema } from "../schemas/accessory";
import { validateQuery } from "../middleware/validate"

const router = Router();

router.get("/", validateQuery(accessoryQuerySchema), accessoriesController.getAllAccessories);

export default router;