import type { Request, Response } from "express";
import * as productService from "../services/accessory.service";
import type { AccessoryQuery } from "../schemas/accessory";

export async function getAllAccessories(req: Request, res: Response) {
  const query = req.validatedQuery as AccessoryQuery;
  const result = await productService.getAccessories(query);
  res.status(200).json(result);
}