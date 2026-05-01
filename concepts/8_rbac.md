# Concept 8: Role-Based Access Control (RBAC)

## 1. Authentication vs Authorization
- **Authentication (AuthN):** "Who are you?" (Handled by `authenticate` middleware).
- **Authorization (AuthZ):** "What are you allowed to do?" (Handled by `authorize` middleware).

## 2. Higher-Order Middleware
Our `authorize` function is a "Higher-Order Function". It's a function that **returns** a middleware function. 

**Why?** Because we need to pass parameters (the roles) into the middleware.
```typescript
// This is how we call it:
authorize('instructor', 'admin')

// It returns this middleware:
(req, res, next) => { ... }
```

## 3. 401 Unauthorized vs 403 Forbidden
This is a critical distinction for a professional API:
- **401 Unauthorized:** "I don't know who you are. Please login." (Used in `authenticate`).
- **403 Forbidden:** "I know who you are, but you aren't allowed to be here." (Used in `authorize`).

## 4. The Request Chain
Middlewares pass information forward using the `req` object.
1. `authenticate` puts the user data in `req.user`.
2. `authorize` reads `req.user` to check the role.
3. `controller` can use `req.user` to associate data (e.g., `instructor_id = req.user.id`).

This chain only works if the order in the route file is correct:
```typescript
router.post('/', authenticate, authorize('instructor'), createCourse);
//               1. Identify     2. Verify Role     3. Execute
```
