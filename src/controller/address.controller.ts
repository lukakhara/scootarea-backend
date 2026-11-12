import type { Request, Response } from "express";
import {
  getAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
} from "../services/address.service";
import type {
  AddressInput,
  UpdateAddressInput,
} from "../schemas/address.schema";
import { AppError } from "@/errors/AppError";
import { ERROR_MESSAGES } from "@/errors/errorMessages";



export async function getAllAddresses(req: Request, res: Response) {
  const addresses = await getAddresses(req.session.userId!);
  res.status(200).json({ data: addresses });
}

export async function getAddressByIdController(req: Request, res: Response) {
  const { id } = req.validatedParams as { id: string };
  const address = await getAddressById(req.session.userId!, id);
  if (!address) throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
  res.status(200).json({ data: address });
}

export async function addAddress(req: Request, res: Response) {
  const data = req.validatedBody as AddressInput;
  const address = await createAddress(req.session.userId!, data);
  res.status(201).json({ data: address });
}

export async function updateAddressController(req: Request, res: Response) {
  const { id } = req.validatedParams as { id: string };
  const data = req.validatedBody as UpdateAddressInput;
  const address = await updateAddress(req.session.userId!, id, data);
  if (!address) throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
  res.status(200).json({ data: address });
}

export async function deleteAddressController(req: Request, res: Response) {
  const { id } = req.validatedParams as { id: string };
  const deleted = await deleteAddress(req.session.userId!, id);
  if (!deleted) throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
  res.status(204).send();
}