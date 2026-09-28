import { Router } from "express";
import * as sparePartController from "../controller/sparePart.controller";
import { idParamSchema, querySchema } from "../schemas/sparePart";
import { validateParams, validateQuery } from "@/middleware/validate";

const router = Router();

router.get("/", validateQuery(querySchema), sparePartController.getAllSpareParts);
router.get(
  "/:id",
  validateParams(idParamSchema),
  sparePartController.getSparePartByIdController
);

export default router;