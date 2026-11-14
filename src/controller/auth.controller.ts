import type { Request, Response, NextFunction } from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser,
} from "@/services/auth.service";
import { UserRegisterBody, UserLoginBody } from "@/schemas/auth.schema";
import { regenerateSession, saveSession } from "@/utils/session";
import { sessionService } from "@/services/userSession.service";

export async function registerUserController(req: Request, res: Response) {
  const body = req.validatedBody as UserRegisterBody;
  const result = await registerUser(body);

  return res.status(201).json(result);
}

export async function loginUserController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const body = req.validatedBody as UserLoginBody;
  const user = await loginUser(body);

  await regenerateSession(req);
  req.session.userId = user.id;
  req.session.role = user.role;
  await saveSession(req);
  //session device info
  await sessionService.attachDevice(req, user.id);

  return res.status(200).json(user);
}

export function logoutUserController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.clearCookie("sid");
    res.status(204).end();
  });
}
export async function meController(req: Request, res: Response) {
  const user = await getCurrentUser(req.session.userId!);
  return res.json(user);
}
