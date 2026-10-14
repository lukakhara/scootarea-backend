import * as productService from "../services/accessory.service";
export async function getAllAccessories(req, res) {
    const query = req.validatedQuery;
    const result = await productService.getAccessories(query);
    res.status(200).json(result);
}
export async function getAccessoryById(req, res) {
    console.log("PARAMS:", req.params);
    console.log("ID:", req.params.id);
    console.log("TYPE:", typeof req.params.id);
    const { id } = req.validatedParams;
    const locale = req.query.locale ?? "en";
    const result = await productService.getAccessoryById({ id, locale });
    res.status(200).json(result);
}
