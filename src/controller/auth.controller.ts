import type { Request, Response, NextFunction } from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser,
} from "@/services/auth.service";
import { UserRegisterBody, UserLoginBody } from "@/schemas/auth.schema";

export async function registerUserController(req: Request, res: Response) {
  const body = req.validatedBody as UserRegisterBody;
  const result = await registerUser(body);

  return res.status(201).json(result);
}

export async function loginUserController(req: Request, res: Response) {
  const body = req.validatedBody as UserLoginBody;
  const user = await loginUser(body);

  // new session ID on login (prevents session fixation)
  await new Promise<void>((resolve, reject) =>
    req.session.regenerate((err) => (err ? reject(err) : resolve())),
  );

  req.session.userId = user.id;
  req.session.role = user.role;

  await new Promise<void>((resolve, reject) =>
    req.session.save((err) => (err ? reject(err) : resolve())),
  );
  
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
