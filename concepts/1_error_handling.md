# Concept 1: Professional Error Handling

## 1. The "Big Picture"
Instead of `try-catch` in every route, we use a **Global Error Handler**. 
Errors are "thrown" from the depths of the app and "caught" at the very end.

## 2. The Components
- **AppError Class**: A custom class that extends `Error`. It allows us to attach an HTTP `statusCode` and an `isOperational` flag.
- **API Response Utils**: Helper functions (`sendSuccess`, `sendError`) that ensure every response from our API has the same JSON shape.
- **Global Middleware**: A specific Express middleware with 4 parameters `(err, req, res, next)` that sits at the bottom of `index.ts`.

## 3. Why the Prototype fix?
In TypeScript, when extending the built-in `Error` class, we must use `Object.setPrototypeOf(this, AppError.prototype)`. 
This ensures that `instanceof AppError` works correctly, so the handler knows if the error is one of ours or a random system crash.

## 4. Key Benefits
- **Cleaner Controllers**: No more messy response logic inside routes.
- **Consistency**: The frontend always knows what format to expect.
- **Security**: We can hide "Internal Server Errors" from users while showing them "Operational Errors" like "User not found".
