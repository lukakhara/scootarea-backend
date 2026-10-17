import { Router } from "express";
import {
  addScooter,
  getAllScooters,
  getScooterByIdController,
  updateScooterController,
} from "../controller/scooters.controller";
import {
  createScooterSchema,
  idParamSchema,
  querySchema,
  updateScooterSchema,
} from "../schemas/scooter.schema";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "@/middleware/validate.middleware";

const router = Router();

router.get("/", validateQuery(querySchema), getAllScooters);
router.get("/:id", validateParams(idParamSchema), getScooterByIdController);
router.post("/", validateBody(createScooterSchema), addScooter);
router.patch(
  "/:id",
  validateParams(idParamSchema),
  validateBody(updateScooterSchema),
  updateScooterController,
);

export default router;
