import { Router } from "express";
import * as blogController from "../controller/blog.controller";
import { blogQuerySchema, blogIdParamSchema } from "../schemas/blog.schema";
import {
  validateQuery,
  validateParams,
} from "../middleware/validate.middleware";

const router = Router();

router.get("/", validateQuery(blogQuerySchema), blogController.getAllPosts);
router.get(
  "/:id",
  validateParams(blogIdParamSchema),
  blogController.getPostById,
);

export default router;
