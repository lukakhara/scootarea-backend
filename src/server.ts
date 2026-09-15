import express from "express";
import cors from "cors";
import { AppError } from "./errors/AppError";
import { ERROR_MESSAGES } from "./errors/errorMessages";
import { logger } from "../logger";
import { requestLogger } from "../src/middleware/requestLogger";
import scooterRoutes from "./routes/scooters";
import accessoriesRoutes from "./routes/accessories";

import "dotenv/config";

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger); // now runs before routes, so it actually logs requests

app.get("/", async (req, res) => {
  res.send("server is running 🏃‍♀️‍➡️🥳");
});

app.use("/scooters", scooterRoutes);
app.use("/accessories", accessoriesRoutes);

// 404 handler — after all real routes
app.use((req, res, next) => {
  next(new AppError(ERROR_MESSAGES.ROUTE_NOT_FOUND, 404));
});

// Error-handling middleware — MUST be last, MUST have 4 params
app.use(
  (err: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({
        message: err.message,
        details: err.details,
      });
    }

    logger.error(err);
    res.status(500).json({ message: "Internal server error" });
  },
);


app.listen(5000, () => {
  logger.info(`Server running 🏃‍♀️‍➡️🏃‍♀️‍➡️`);
});