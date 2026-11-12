import { Router } from "express";
import {
  addAddress,
  deleteAddressController,
  getAddressByIdController,
  getAllAddresses,
  updateAddressController,
} from "../controller/address.controller";
import {
  createAddressSchema,
  idParamSchema,
  updateAddressSchema,
} from "../schemas/address.schema";
import { validateBody, validateParams } from "@/middleware/validate.middleware";
import { requireAuth } from "@/middleware/auth.middleware";

const router = Router();

router.get("/", requireAuth, getAllAddresses);
router.get(
  "/:id",
  requireAuth,
  validateParams(idParamSchema),
  getAddressByIdController,
);
router.post("/", requireAuth, validateBody(createAddressSchema), addAddress);
router.patch(
  "/:id",
  requireAuth,
  validateParams(idParamSchema),
  validateBody(updateAddressSchema),
  updateAddressController,
);
router.delete(
  "/:id",
  requireAuth,
  validateParams(idParamSchema),
  deleteAddressController,
);

export default router;
