import type { Request, Response } from "express";
import { registerUser,loginUser } from "@/services/auth.service";
import { UserRegisterBody,UserLoginSchema} from "@/schemas/auth.schema";

export async function registerUserController(req: Request, res: Response){
    const body = req.validatedBody as UserRegisterBody;
    const result = await registerUser(body);
    return res.status(201).json(result);
}

export async function loginUserController(req:Request, res:Response){
    const body = req.validatedBody as UserLoginSchema;
    const result = await loginUser(body);
    return res.status(201).json(result)
}