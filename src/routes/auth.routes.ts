import { validateBody } from "@/middleware/validate.middleware";
import { loginSchema, userRegisterSchema } from "@/schemas/auth.schema";
import { Router } from "express";
import { loginUserController, logoutUserController, registerUserController } from "@/controller/auth.controller";

const router = Router();

router.post("/register", validateBody(userRegisterSchema), registerUserController);

router.post("/login", validateBody(loginSchema), loginUserController);

router.post("/logout",logoutUserController);

export default router