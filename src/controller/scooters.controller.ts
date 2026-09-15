import type { Request, Response } from "express";
import * as productService from "../services/scooter.service";
import type { ScooterQuery } from "../schemas/scooter";
import { AppError } from "@/errors/AppError";
import { ERROR_MESSAGES } from "@/errors/errorMessages";

export async function getAllScooters(req: Request, res: Response) {
  const query = req.validatedQuery as ScooterQuery;
  const result = await productService.getScooters(query);
  res.status(200).json(result);
}

export async function getScooterByIdController(req: Request, res: Response) {
  const { id } = req.validatedParams as { id: string };
  const scooter = await productService.getScooterById(id);
  if (!scooter) {
      new AppError(ERROR_MESSAGES.NOT_FOUND ?? "Scooter not found", 404)
  }

  res.json({ data: scooter });
}
