import { validateBody } from "@/middleware/validate.middleware";
import { loginSchema, userRegisterSchema } from "@/schemas/auth.schema";
import { Router } from "express";
import { loginUserController, logoutUserController, meController, registerUserController } from "@/controller/auth.controller";
import { requireAuth } from "@/middleware/auth.middleware";
import { loginLimiter, registerLimiter } from "@/middleware/rateLimit.middleware";

const router = Router();

router.post("/register",registerLimiter, validateBody(userRegisterSchema), registerUserController);

router.post("/login",loginLimiter, validateBody(loginSchema), loginUserController);

router.post("/logout",logoutUserController);

router.get("/me",requireAuth, meController);

export default router