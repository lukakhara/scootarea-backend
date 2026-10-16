import type { Request, Response } from "express";
import {getScooters,getScooterById, createScooter} from "../services/scooter.service";
import type { ScooterInput, ScooterQuery } from "../schemas/scooter.schema";
import { AppError } from "@/errors/AppError";
import { ERROR_MESSAGES } from "@/errors/errorMessages";

export async function getAllScooters(req: Request, res: Response) {
  const query = req.validatedQuery as ScooterQuery;
  const result = await getScooters(query);
  res.status(200).json(result);
}

export async function getScooterByIdController(req: Request, res: Response) {
  const { id } = req.validatedParams as { id: string };
  const scooter = await getScooterById(id);
  if (!scooter) {
    new AppError(ERROR_MESSAGES.NOT_FOUND ?? "Scooter not found", 404);
  }
  res.json({ data: scooter });
}

export async function addScooter(req: Request, res: Response) {
  const data = req.validatedBody as ScooterInput;
  const result = await createScooter(data);
  res.status(200).json(result);
}