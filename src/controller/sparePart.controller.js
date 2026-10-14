import * as sparePartService from "../services/sparePart.service";
import { AppError } from "@/errors/AppError";
import { ERROR_MESSAGES } from "@/errors/errorMessages";
export async function getAllSpareParts(req, res) {
    const query = req.validatedQuery;
    const result = await sparePartService.getSpareParts(query);
    res.status(200).json(result);
}
export async function getSparePartByIdController(req, res) {
    const { id } = req.validatedParams;
    const locale = req.query.locale ?? "en";
    const sparePart = await sparePartService.getSparePartById(id, locale);
    if (!sparePart) {
        throw new AppError(ERROR_MESSAGES.NOT_FOUND ?? "Spare part not found", 404);
    }
    res.json({ data: sparePart });
}
