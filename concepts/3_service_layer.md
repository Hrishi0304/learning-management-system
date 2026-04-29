# Concept 3: The Service Layer (Business Logic)

## 1. What is a Service?
The Service Layer is the "Brain" of the application. It contains the actual logic for interacting with the database or external APIs. 

## 2. Separation of Concerns
The Service should **never** know about:
- HTTP Requests (`req`)
- HTTP Responses (`res`)
- Status codes (200, 404, etc.)

It takes "raw" data as input and returns "pure" JavaScript objects or arrays as output.

## 3. Static Methods
We use `static` methods in our Service classes because the service doesn't need to maintain "state" (it doesn't need its own memory space for each call). Calling `CourseService.findAll()` is more efficient than creating a `new CourseService()` every time.

## 4. Database Safety
- **Parameterized Queries**: We always use `?` placeholders in SQL. This prevents **SQL Injection** attacks by letting the DB driver safely escape the values.
- **Tuples & Destructuring**: `mysql2` returns a tuple `[rows, fields]`. We destructure `[rows]` because we only care about the data.

## 5. Error Bubbling
The Service is responsible for throwing `AppError`. It doesn't send responses; it just throws the error, knowing that the Controller will catch it and pass it to the Global Error Handler.
