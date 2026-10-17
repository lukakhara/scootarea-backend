import type { ErrorRequestHandler } from "express";
import { AppError } from "../errors/AppError";
import { ERROR_MESSAGES } from "../errors/errorMessages";
import { Prisma } from "../../generated/prisma/client";

export const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      ...(err.details !== undefined && { errors: err.details }),
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002": {
        const target = err.meta?.target;
        const fields = Array.isArray(target) ? target.join(", ") : undefined;
        return res.status(409).json({
          message:
            fields === "email"
              ? ERROR_MESSAGES.EMAIL_EXISTS
              : ERROR_MESSAGES.ALREADY_EXISTS,
        });
      }
      case "P2025":
        return res.status(404).json({ message: ERROR_MESSAGES.NOT_FOUND });
      case "P2003":
        return res.status(400).json({ message: ERROR_MESSAGES.INVALID_REFERENCE });
      default:
        console.error("Unhandled Prisma error:", err.code, err.meta);
        return res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_ERROR });
    }
  }

  // Malformed JSON from express.json()
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({ message: ERROR_MESSAGES.INVALID_JSON });
  }

  console.error(err);
  return res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_ERROR });
};