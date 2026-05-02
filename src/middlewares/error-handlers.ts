import { Request,Response,NextFunction } from "express";
import { sendError } from "../utils/api-response";
import { AppError } from "../utils/app-error";


// This is a SPECIAL middleware. 
// Express knows it's an error handler because it has 4 parameters.
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction){
    // 1. If it's our "AppError", use its status code and message
    if(err instanceof AppError){
        return sendError(res, err.message,err.statusCode);
    }

    // 2. If Express failed to parse JSON (e.g. malformed body in Bruno)
    if (err instanceof SyntaxError && 'status' in err && err.status === 400 && 'body' in err) {
        return sendError(res, "Invalid JSON payload provided", 400);
    }

    // 3. If it's an unknown error (a bug), log it and send generic 500
    console.log("ERROR:",err);
    return sendError(res,"Something went wrong! ",500);
}