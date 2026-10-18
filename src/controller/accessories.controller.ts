import type { Request, Response } from "express";
import * as productService from "../services/accessory.service";
import type {
  AccessoryInput,
  AccessoryQuery,
  AccessoryUpdateInput,
  IdParam,
} from "../schemas/accessory.schema";
import {
  addAccessory,
  deleteAccessory,
  updateAccessory,
} from "../services/accessory.service";

export async function getAllAccessories(req: Request, res: Response) {
  const query = req.validatedQuery as AccessoryQuery;
  const result = await productService.getAccessories(query);
  res.status(200).json(result);
}

export async function getAccessoryById(req: Request, res: Response) {
  const { id } = req.validatedParams as IdParam;
  const locale = (req.query.locale as string) ?? "en";
  const result = await productService.getAccessoryById({ id, locale });
  res.status(200).json(result);
}

export async function addAccessoryController(req: Request, res: Response) {
  const data = req.body as AccessoryInput;
  const result = await addAccessory(data);
  res.status(201).json(result);
}

export async function updateAccessoryController(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const body = req.body as AccessoryUpdateInput;
  const result = await updateAccessory(id, body);
  res.status(200).json(result);
}

export async function deleteAccessoryController(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const result = await deleteAccessory(id);
  res.status(200).json(result);
}
