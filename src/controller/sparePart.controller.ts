import type { Request, Response } from "express";
import * as sparePartService from "../services/sparePart.service";
import type {
  IdParam,
  SparePartInput,
  SparePartQuery,
  SparePartUpdateInput,
} from "../schemas/sparePart.schema";

export async function getAllSpareParts(req: Request, res: Response) {
  const query = req.validatedQuery as SparePartQuery;
  res.status(200).json(await sparePartService.getSpareParts(query));
}

export async function getSparePartByIdController(req: Request, res: Response) {
  const { id } = req.validatedParams as IdParam;
  const { locale } = req.validatedQuery as { locale: string };
  const result = await sparePartService.getSparePartById({ id, locale })
  res.status(200).json(result);
}

export async function addSparePartController(req: Request, res: Response) {
  const result = await sparePartService.addSparePart(req.body as SparePartInput);
  res.status(201).json(result);
}

export async function updateSparePartController(req: Request, res: Response) {
  const { id } = req.validatedParams as IdParam;
  const result = await sparePartService.updateSparePart(
    id,
    req.body as SparePartUpdateInput,
  );
  res.status(200).json(result);
}

export async function deleteSparePartController(req: Request, res: Response) {
  const { id } = req.validatedParams as IdParam;
  await sparePartService.deleteSparePart(id);
  res.status(204).send();
}