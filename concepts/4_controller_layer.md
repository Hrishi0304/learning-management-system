# Concept 4: The Controller Layer (HTTP Handler)

## 1. The Gatekeeper
The Controller is the entry point for a request. Its only responsibilities are:
1. Extract data from the request (`params`, `body`, `query`).
2. Validate the data (using Zod).
3. Call the appropriate Service.
4. Send a standardized response back to the client.

## 2. The `next` Function
The `next` parameter is a function provided by Express. When an error occurs in the controller, we call `next(error)`. This stops the current function and sends the error to the **Global Error Handler**.

## 3. Slim Controllers
A professional controller should be very "slim" (usually 5-10 lines of code). If you find yourself writing complex logic or raw SQL inside a controller, it should probably be moved to the Service Layer.

## 4. Input Sanitization
Controllers must always sanitize inputs. For example:
- Converting `req.params.id` (which is a string) to a `Number`.
- Checking `isNaN(id)` to prevent database crashes.
- Using `safeParse` to ensure the request body is valid before sending it to the Service.
