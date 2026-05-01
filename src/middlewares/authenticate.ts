import { NextFunction, Request, Response } from "express"
import { AppError } from "../utils/app-error";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: {
        id: number,
        email: string,
        role: string
    }
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    // 1. Get token from header
    const authHeader = req.headers.authorization;

    // Header format bearer token 
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return next(new AppError("Please login to access this resource",401));
    }

    const token = authHeader.split(" ")[1];

    try {
        // 2. Verify token
        const decoded = jwt.verify(token,process.env.JWT_SECRET!) as any;

        // 3. Attach user info to the request
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role
        };

        next();
    }catch(err){
        return next(new AppError("Invalid or expired token",401));
    }

}