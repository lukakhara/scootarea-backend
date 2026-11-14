import "dotenv/config";
import express from "express";
import cors from "cors";
import { AppError } from "./errors/AppError";
import { ERROR_MESSAGES } from "./errors/errorMessages";
import { requestLogger } from "./middleware/requestLogger.middleware";
import { logger } from "../logger";
import scooterRoutes from "./routes/scooters.routes";
import accessoriesRoutes from "./routes/accessories.routes";
import partsRoutes from "./routes/sparePart.routes";
import blogRoutes from "./routes/blog.routes";
import authRoutes from "./routes/auth.routes";
import orderRoutes from "./routes/order.routes";
import addressRoutes from "./routes/address.routes";
import { sessionMiddleware } from "./config/session";
import { globalLimiter } from "./middleware/rateLimit.middleware";
import { errorHandler } from "./middleware/errorHandler";



const app = express();

app.set("trust proxy", 1); // first

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(requestLogger); // now runs before routes, so it actually logs requests
app.use(sessionMiddleware);
app.use(globalLimiter); // before routes, otherwise it never applies to them

app.use("/api/scooters", scooterRoutes);
app.use("/api/accessories", accessoriesRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/parts", partsRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/address", addressRoutes);



// 404 handler — after all real routes
app.use((req, res, next) => {
  next(new AppError(ERROR_MESSAGES.ROUTE_NOT_FOUND, 404));
});

// Error-handling middleware — MUST be last, MUST have 4 params
app.use(errorHandler);

app.get("/", async (req, res) => {
  res.send("server is running 🏃‍♀️‍➡️🥳");
});


app.listen(5000, () => {
  logger.info(`Server running 🏃‍♀️‍➡️🏃‍♀️‍➡️`);
});

