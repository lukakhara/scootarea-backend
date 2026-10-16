import type { Request, Response, NextFunction } from "express";
import { registerUser, loginUser } from "@/services/auth.service";
import { UserRegisterBody, UserLoginSchema } from "@/schemas/auth.schema";

export async function registerUserController(req: Request, res: Response) {
  const body = req.validatedBody as UserRegisterBody;
  const user = await registerUser(body);

  // new session ID on login (prevents session fixation)
  await new Promise<void>((resolve, reject) =>
    req.session.regenerate((err) => (err ? reject(err) : resolve())),
  );

  req.session.userId = user.id;
  req.session.role = user.role;

  await new Promise<void>((resolve, reject) =>
    req.session.save((err) => (err ? reject(err) : resolve())),
  );

  return res.status(201).json(user);
}

export async function loginUserController(req: Request, res: Response) {
  const body = req.validatedBody as UserLoginSchema;
  const result = await loginUser(body);
  return res.status(201).json(result);
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
