import { Router } from "express";
import * as sparePartController from "../controller/sparePart.controller";
import { idParamSchema, querySchema } from "../schemas/sparePart.schema";
import {
  validateParams,
  validateQuery,
} from "@/middleware/validate.middleware";

const router = Router();

router.get(
  "/",
  validateQuery(querySchema),
  sparePartController.getAllSpareParts,
);
router.get(
  "/:id",
  validateParams(idParamSchema),
  sparePartController.getSparePartByIdController,
);

export default router;
