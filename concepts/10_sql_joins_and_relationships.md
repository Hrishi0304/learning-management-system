# Concept 10: SQL Relationships & JOINs

## 1. Relational Databases (The "R" in RDBMS)
In a relational database, we don't store everything in one giant table. We split data into logical tables and "link" them using IDs.

## 2. One-to-Many Relationship
In our LMS:
- **One** User (Instructor) can have **Many** Courses.
- A Course belongs to exactly **One** User.

We implement this using a **Foreign Key** (`instructor_id`) in the `courses` table that points to the `id` in the `users` table.

## 3. SQL JOINs
A `JOIN` allows us to fetch data from two tables in a single query.

```sql
SELECT c.title, u.name as instructor_name
FROM courses c
JOIN users u ON c.instructor_id = u.id;
```

### Why use JOIN instead of two queries?
1. **Performance:** One trip to the database is faster than two.
2. **Consistency:** You get a single, atomic snapshot of the data.
3. **Efficiency:** The database engine is highly optimized for joining tables.

## 4. Aliasing (c. and u.)
We use `courses c` and `users u` as shortcuts (aliases). This makes the query readable and avoids "Ambiguous Column" errors when both tables have a column with the same name (like `id` or `created_at`).
