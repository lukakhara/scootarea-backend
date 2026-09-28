import type { Request, Response } from "express";
import * as sparePartService from "../services/sparePart.service";
import type { SparePartQuery } from "../schemas/sparePart";
import { AppError } from "@/errors/AppError";
import { ERROR_MESSAGES } from "@/errors/errorMessages";

export async function getAllSpareParts(req: Request, res: Response) {
  const query = req.validatedQuery as SparePartQuery;
  const result = await sparePartService.getSpareParts(query);
  res.status(200).json(result);
}

export async function getSparePartByIdController(req: Request, res: Response) {
  const { id } = req.validatedParams as { id: string };
  const locale = (req.query.locale as string) ?? "en";

  const sparePart = await sparePartService.getSparePartById(id, locale);
  if (!sparePart) {
    throw new AppError(ERROR_MESSAGES.NOT_FOUND ?? "Spare part not found", 404);
  }

  res.json({ data: sparePart });
}