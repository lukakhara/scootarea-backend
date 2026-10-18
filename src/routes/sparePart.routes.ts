import { Router } from "express";
import {
  createSparePartSchema,
  idParamSchema,
  localeQuerySchema,
  querySchema,
  updateSparePartSchema,
} from "../schemas/sparePart.schema";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../middleware/validate.middleware";
import {
  addSparePartController,
  deleteSparePartController,
  getAllSpareParts,
  getSparePartByIdController,
  updateSparePartController,
} from "../controller/sparePart.controller";

const router = Router();

router.get("/", validateQuery(querySchema), getAllSpareParts);
router.get(
  "/:id",
  validateParams(idParamSchema),
  validateQuery(localeQuerySchema),
  getSparePartByIdController,
);
router.post("/", validateBody(createSparePartSchema), addSparePartController);
router.patch(
  "/:id",
  validateParams(idParamSchema),
  validateBody(updateSparePartSchema),
  updateSparePartController,
);
router.delete("/:id", validateParams(idParamSchema), deleteSparePartController);

export default router;