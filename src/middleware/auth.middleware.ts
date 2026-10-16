import { Request, Response, NextFunction } from "express";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.session.userId)
    return res.status(401).json({ message: "Unauthorized" });
  next();
};

export const requireModerator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.session.role !== "MODERATOR")
    return res.status(403).json({ message: "Forbidden" });
  next();
};


export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.session.role !== "ADMIN")
    return res.status(403).json({ message: "Forbidden" });
  next();
};
