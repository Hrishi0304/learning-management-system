# Concept 5: The Routing Layer

## 1. The Traffic Controller
Routes define the endpoints of your API. They map a specific **HTTP Method** (GET, POST, etc.) and a **URL Path** to a specific **Controller function**.

## 2. Express Router
Instead of putting all routes in `index.ts`, we use `express.Router()`. This allows us to group related routes (like all `/courses` routes) into their own dedicated files.

## 3. Route Parameters
Paths like `/:id` use a colon to indicate a dynamic parameter. Express will automatically put the value from the URL into the `req.params` object.

## 4. Prefixing in index.ts
We mount our routers in the main `index.ts` file using `app.use()`:
```typescript
app.use('/courses', courseRouter);
```
This means every route defined inside `course.routes.ts` will automatically be prefixed with `/courses`. This keeps the individual route files clean and readable.
