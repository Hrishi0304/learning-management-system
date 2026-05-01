import { NextFunction, Response } from "express"
import { AuthRequest } from "./authenticate"
import { AppError } from "../utils/app-error"

export const authorize = (...allowedRoles: string[]) => {
    return (req: AuthRequest,res:Response,next:NextFunction) => {

        // 1. Check if req.user exists (authenticate must run before this)
        if(!req.user){
            return next(new AppError("User not authenticated",401));
        }

        // 2. Check if user's role is in the allowed list
        if(!allowedRoles.includes(req.user.role)){
            return next(new AppError("You do not have permission to perform this action",403));
        }
        
        next();
    }
}