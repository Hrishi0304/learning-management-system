# Concept 11: Resource Guards (Ownership Authorization)

## 1. The Security Gap
Role-based authorization (e.g., `authorize('instructor')`) only checks **IF** you can perform an action. It doesn't check **WHICH** specific resource you are allowed to act upon.

**Resource Guarding** (or Ownership Check) ensures that Instructor A cannot delete Instructor B's course.

## 2. The Middleware Pattern
Instead of writing the same "check ownership" logic in every controller, we move it to a dedicated middleware: `checkCourseOwnership`.

### Benefits:
1. **DRY (Don't Repeat Yourself):** One logic used for Update and Delete.
2. **Declarative Security:** Security policies are visible in the `routes` file.
3. **Fail-Fast:** The request is rejected before the controller is even called.

## 3. Resource Pre-fetching
A powerful trick in Express is to fetch the resource in the middleware and "attach" it to the request object.

```typescript
// Inside middleware
const [course] = await CourseService.findById(id);
req.course = course; 
next();

// Inside controller
const course = req.course; // No need to query the DB again!
```

## 4. The Request Lifecycle with Guards
1. **Authenticate:** "Who are you?" → `req.user`
2. **Authorize (Role):** "Are you an instructor?" 
3. **Resource Guard:** "Do you own this specific course?"
4. **Controller:** "Execute the business logic."
