# Concept 9: HTTP Status Codes for APIs

## 1. The Success Family (2xx)
These mean the request worked.

| Code | Name | Use Case |
|---|---|---|
| **200** | **OK** | Default success (fetching a list, getting one item, update success). |
| **201** | **Created** | Specifically for when a new resource is added to the DB (Signup, Create Course). |
| **204** | **No Content** | Success, but there is nothing to return (often used for DELETE). |

---

## 2. The Client Error Family (4xx)
These mean the **client** (the caller) did something wrong.

| Code | Name | Use Case |
|---|---|---|
| **400** | **Bad Request** | Generic validation error (Zod caught a missing field or wrong format). |
| **401** | **Unauthorized** | "I don't know who you are." (Missing or invalid JWT token). |
| **403** | **Forbidden** | "I know who you are, but you aren't allowed here." (Wrong role). |
| **404** | **Not Found** | The ID provided doesn't exist in the database. |
| **409** | **Conflict** | Resource already exists (e.g., trying to sign up with an email that is already taken). |

---

## 3. The Server Error Family (5xx)
These mean the **server** (your code or the DB) crashed.

| Code | Name | Use Case |
|---|---|---|
| **500** | **Internal Server Error** | Something exploded in your code. Database connection lost, syntax error, etc. |
| **503** | **Service Unavailable** | Server is overloaded or down for maintenance. |

---

## 💡 The "Interview" Question: 401 vs 403

Interviewers LOVE asking this. Here is the perfect answer:

- **401 Unauthorized:** Think of it as **Identity**. You are at a club, but you don't have your ID card. I don't know who you are.
- **403 Forbidden:** Think of it as **Permissions**. You have your ID card, I know you are Hrishikesh, but you are not on the VIP list. You cannot enter this specific room.

---

## Pro-Tip: The "Body" for errors
Always send a JSON body with 4xx and 5xx errors so the frontend knows what happened:
```json
{
  "success": false,
  "message": "User not authenticated"
}
