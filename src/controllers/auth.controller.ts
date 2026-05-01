import { NextFunction, Request, Response } from "express";
import { loginSchema, signupSchema } from "../schemas/user.schema";
import { AppError } from "../utils/app-error";
import { tryCatch } from "../utils/try-catch";
import { UserService } from "../services/user.service";
import { sendSuccess } from "../utils/api-response";

export async function signup(req: Request,res:Response,next: NextFunction){
    // 1. Validating input 
    const result = signupSchema.safeParse(req.body);
    if(!result.success) return next(new AppError(result.error.issues[0].message,400));

    // 2. Calling Signup Service
    const [user, error] = await tryCatch(UserService.signup(result.data));
    if(error) return next(error);

    // 3. Send successful sign up response 
    return sendSuccess(res,user,"User registered successfully",201);
}

export async function login(req: Request,res:Response,next: NextFunction) {
    // 1. Validating input 
    const result = loginSchema.safeParse(req.body);
    if(!result.success) return next(new AppError(result.error.issues[0].message,400));

    // 2. Calling Login Service
    const [data,error] = await tryCatch(UserService.login(result.data));
    if(error) return next(error);

    // 3. Send successful login response
    return sendSuccess(res,data,"Login Successful");
}