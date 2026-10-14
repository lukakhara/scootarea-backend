import * as productService from "../services/scooter.service";
import { AppError } from "@/errors/AppError";
import { ERROR_MESSAGES } from "@/errors/errorMessages";
export async function getAllScooters(req, res) {
    const query = req.validatedQuery;
    const result = await productService.getScooters(query);
    res.status(200).json(result);
}
export async function getScooterByIdController(req, res) {
    const { id } = req.validatedParams;
    const scooter = await productService.getScooterById(id);
    if (!scooter) {
        new AppError(ERROR_MESSAGES.NOT_FOUND ?? "Scooter not found", 404);
    }
    res.json({ data: scooter });
}
