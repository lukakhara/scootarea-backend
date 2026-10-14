// middleware/validate.ts
import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';
import { treeifyError } from 'zod/v4/core';
import { AppError } from '../errors/AppError';
import { ERROR_MESSAGES } from '../errors/errorMessages';

export function validateParams(schema: ZodType): RequestHandler {
  return (req, res, next) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      return next(new AppError(ERROR_MESSAGES.VALIDATION_FAILED, 400, treeifyError(result.error)));
    }
    req.validatedParams= result.data
    next();
  };
}

export function validateBody(schema: ZodType): RequestHandler {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next(new AppError(ERROR_MESSAGES.VALIDATION_FAILED, 400, treeifyError(result.error)));
    }
    req.validatedBody = result.data;
    next();
  };
}
export function validateQuery(schema: ZodType): RequestHandler {
  return (req, res, next) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      return next(new AppError(ERROR_MESSAGES.VALIDATION_FAILED, 400, treeifyError(result.error)));
    }
    req.validatedQuery = result.data;
    next();
  };
}