import { validateBody } from "@/middleware/validate.middleware";
import { loginSchema, userRegisterSchema } from "@/schemas/auth.schema";
import { Router } from "express";
import { loginUserController, logoutUserController, meController, registerUserController } from "@/controller/auth.controller";
import { requireAuth } from "@/middleware/auth.middleware";

const router = Router();

router.post("/register", validateBody(userRegisterSchema), registerUserController);

router.post("/login", validateBody(loginSchema), loginUserController);

router.post("/logout",logoutUserController);

router.get("/me",requireAuth, meController);

export default router