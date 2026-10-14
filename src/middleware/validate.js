import { treeifyError } from 'zod/v4/core';
import { AppError } from '../errors/AppError';
import { ERROR_MESSAGES } from '../errors/errorMessages';
export function validateParams(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.params);
        if (!result.success) {
            return next(new AppError(ERROR_MESSAGES.VALIDATION_FAILED, 400, treeifyError(result.error)));
        }
        req.validatedParams = result.data;
        next();
    };
}
export function validateBody(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            return next(new AppError(ERROR_MESSAGES.VALIDATION_FAILED, 400, treeifyError(result.error)));
        }
        req.validatedBody = result.data;
        next();
    };
}
export function validateQuery(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.query);
        if (!result.success) {
            return next(new AppError(ERROR_MESSAGES.VALIDATION_FAILED, 400, treeifyError(result.error)));
        }
        req.validatedQuery = result.data;
        next();
    };
}
