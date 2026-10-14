import { logger } from "../../logger";
export const requestLogger = (req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
        const duration = Date.now() - start;
        const hasQuery = Object.keys(req.query).length > 0;
        logger.info({
            duration,
            method: req.method,
            url: req.originalUrl,
            statusCode: res.statusCode,
            ...(hasQuery && { query: req.query }) // Adds `query` only if present
        }, "Request completed");
    });
    next();
};
