// logger.ts
import pino from "pino";
const isProduction = process.env.NODE_ENV === "production";
const options = {
    level: isProduction ? "info" : "debug",
};
if (!isProduction) {
    options.transport = { target: "pino-pretty" };
}
export const logger = pino(options);
