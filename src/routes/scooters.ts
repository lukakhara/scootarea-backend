import { Router } from "express";
import * as scootersController from "../controller/scooters.controller";
import { idParamSchema, querySchema } from "../schemas/scooter";
import { validateParams, validateQuery } from "@/middleware/validate";

const router = Router();

router.get("/", validateQuery(querySchema), scootersController.getAllScooters);
router.get(
  "/:id",
  validateParams(idParamSchema),
  scootersController.getScooterByIdController,
);

export default router;
