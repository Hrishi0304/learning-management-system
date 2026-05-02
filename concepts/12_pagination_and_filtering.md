# Concept 12: Pagination & Dynamic Filtering in SQL

## 1. Why do we need this?
If a database has 10,000 courses, returning all of them at once (`SELECT * FROM courses`) will crash the server and crash the frontend browser. We must restrict how much data is sent at once (Pagination) and allow the user to narrow down the results (Filtering).

## 2. Pagination (Limit & Offset)
Pagination in SQL requires two keywords:
- `LIMIT`: How many rows to return (e.g., 10).
- `OFFSET`: How many rows to skip before starting to return data.

**The Math Formula:**
```typescript
const offset = (page - 1) * limit;
// Page 1, Limit 10 -> Offset 0  (Start at the beginning)
// Page 2, Limit 10 -> Offset 10 (Skip the first 10 items)
// Page 3, Limit 10 -> Offset 20 (Skip the first 20 items)
```

## 3. Dynamic Filtering (The Array Builder Pattern)
When users can apply multiple optional filters (like `search`, `minPrice`, `instructorId`), we cannot hardcode a massive `WHERE ... AND ... OR ...` string. It gets messy and error-prone.

**The Professional Approach:**
We push conditions into an array, and push the actual values into a separate array.

```typescript
const conditions: string[] = [];
const values: any[] = [];

if (search) {
    conditions.push("title LIKE ?");
    values.push(`%${search}%`); // % allows partial matching
}

if (minPrice !== undefined) {
    conditions.push("price >= ?");
    values.push(minPrice);
}

// If we found any valid filters, join them together!
if (conditions.length > 0) {
    sqlQuery += " WHERE " + conditions.join(" AND ");
}
```

## 4. Preventing SQL Injection (The `?` Placeholder)
Notice we never do this: `sqlQuery += " WHERE title = " + search;`
If a hacker sends `search = "1; DROP TABLE courses;"`, they would delete your database.

By using the `?` placeholder, the `mysql2` library automatically sanitizes (escapes) the input, ensuring it is treated purely as text, not as an executable SQL command. This is exactly what ORMs like Prisma do under the hood!
