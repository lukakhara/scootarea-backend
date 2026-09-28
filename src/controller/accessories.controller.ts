import type { Request, Response } from "express";
import * as productService from "../services/accessory.service";
import type { AccessoryQuery, IdParam } from "../schemas/accessory";

export async function getAllAccessories(req: Request, res: Response) {
  const query = req.validatedQuery as AccessoryQuery;
  const result = await productService.getAccessories(query);
  res.status(200).json(result);
}

export async function getAccessoryById(req: Request, res: Response) {
  console.log("PARAMS:", req.params);
  console.log("ID:", req.params.id);
  console.log("TYPE:", typeof req.params.id);
  const { id } = req.validatedParams as IdParam;
  const result = await productService.getAccessoryById({id});
  res.status(200).json(result);
}
