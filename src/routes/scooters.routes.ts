import { Router } from "express";
import {
  addScooter,
  getAllScooters,
  getScooterByIdController,
} from "../controller/scooters.controller";
import {
  createScooterSchema,
  idParamSchema,
  querySchema,
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

export default router;
