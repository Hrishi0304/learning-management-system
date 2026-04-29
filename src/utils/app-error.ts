// AppError is a custom error you THROW from service layer
// It carries an HTTP status code along with the message
// The global error handler will catch it and call sendError automatically
export class AppError extends Error{
    public statusCode: number;
    public isOperational: boolean; // "our" error vs unexpected crash

    constructor(message: string, statusCode: number){
        super(message);  // calls Error constructor
        this.statusCode = statusCode;
        this.isOperational = true; 

        // Fix prototype chain (TypeScript quirk when extending built-ins)
        // The "magic" line to fix inheritance
        // We are setting that this object belongs to class AppError not only Error
        Object.setPrototypeOf(this, AppError.prototype);
    }
}