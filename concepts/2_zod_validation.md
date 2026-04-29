# Concept 2: Runtime Validation with Zod

## 1. Why Zod?
TypeScript is a "compile-time" tool. Once the code is running in Node.js, TypeScript types are gone. Zod provides **Runtime Validation**, ensuring that the data coming from an API request (which could be anything) matches the structure we expect.

## 2. Single Source of Truth
One of the best features of Zod is `z.infer`. 
- We define the **Schema** (the rules).
- We "infer" the **TypeScript Type** from that schema.
This prevents the "Double Maintenance" problem where you have to update both a Type and a Validator separately.

## 3. Key Methods Used
- `z.object({})`: Defines the shape of the data.
- `.min(n, "msg")`: Ensures strings/numbers meet minimum requirements.
- `.optional()`: Marks a field as not required.
- `.coerce.date()`: Automatically converts a string (like "2024-01-01") into a JavaScript `Date` object.
- `.partial()`: Creates a new schema where all fields are optional (perfect for `PATCH` or `PUT` updates).

## 4. safeParse vs parse
- `parse()`: Throws an error immediately if validation fails.
- `safeParse()`: Returns an object `{ success: true, data: ... }` or `{ success: false, error: ... }`. 
In our Controllers, we use `safeParse` so we can handle the error gracefully without crashing the request.
