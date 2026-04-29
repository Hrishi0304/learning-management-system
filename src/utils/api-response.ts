import { Response } from "express";

export function sendSuccess(res: Response, data: unknown, message: string, statusCode: number = 200): void {
    res.status(statusCode).json({
        success: true,
        message: message,
        data: data
    })
}


export function sendError(res: Response, message: string, statusCode: number = 500, errors?: unknown): void {
    res.status(statusCode).json({
        success: false,
        message: message, 
        errors: errors
    });
}