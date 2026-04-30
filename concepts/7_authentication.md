# Concept 7: Authentication & Authorization (Day 2)

---

## The Two Concepts — Never Confuse Them

| Concept | Question it answers | Mechanism |
|---|---|---|
| **Authentication** | *Who are you?* | JWT token |
| **Authorization** | *What are you allowed to do?* | Role check |

Authentication happens first. Authorization only makes sense after you know who the user is.

---

## Why We Can't Store Plain Text Passwords

If your database is hacked and passwords are plain text, every user's account on every other website they use that password on is compromised.

**Bcrypt solves this with one-way hashing:**
```
"mypassword123"  →  bcrypt  →  "$2a$10$xK9q2L...randomhash"
                                         ↑
                               Can NEVER be reversed back to "mypassword123"
```

**How login verification works without reversing:**
```
User types "mypassword123" at login
    ↓
bcrypt.compare("mypassword123", storedHash)
    ↓
bcrypt re-runs the same hashing algorithm on the input
    ↓
Compares the result — returns true or false
```

You never "decrypt" a password. You re-hash and compare. This is the critical concept.

**The "salt" (the random part in the hash):**
Even if two users have the same password ("password123"), their stored hashes will be completely different because bcrypt adds a unique random "salt" to each hash. This prevents "rainbow table" attacks.

```typescript
// Hashing (during signup)
const saltRounds = 10; // how many times to re-run the algorithm (higher = slower = more secure)
const hash = await bcrypt.hash(plainTextPassword, saltRounds);

// Verifying (during login)
const isValid = await bcrypt.compare(plainTextPassword, storedHash); // true or false
```

---

## What is a JWT?

JWT = JSON Web Token. It's a string with 3 parts separated by dots:

```
eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0QGdtYWlsLmNvbSIsInJvbGUiOiJzdHVkZW50In0.abc123sig
      ↑                              ↑                                                              ↑
   Header                         Payload                                                      Signature
(algorithm used)           (your data: user id,                                       (proves it wasn't tampered)
                            email, role, expiry)
```

**Critical:** The payload is **BASE64 encoded — NOT encrypted**. Anyone can decode it and read it.
**The Signature is what makes it secure** — it's created using your `JWT_SECRET`. If anyone tampers with the payload, the signature verification fails.

**How verification works:**
```
Client sends token → your server takes the header + payload
                   → re-signs it using your JWT_SECRET
                   → if new signature matches attached signature → valid
                   → if not → token was tampered → reject
```

**Stateless Auth:** The server stores NO session data. Every request carries its own proof of identity in the token. This is why JWT is perfect for REST APIs — any server instance can verify any token without shared state.

---

## The Auth Flow

### Signup
```
POST /auth/signup  { name, email, password, role }
    │
    ▼ Zod validation
    │
    ▼ Check if email already exists (if yes → 409 Conflict)
    │
    ▼ bcrypt.hash(password, 10)
    │
    ▼ INSERT user into DB
    │
    ▼ Return 201 { success: true, message: "Account created" }
    (No token on signup — user must login separately)
```

### Login
```
POST /auth/login  { email, password }
    │
    ▼ Zod validation
    │
    ▼ Find user by email (if not found → 401 "Invalid credentials")
    │                      ← NOTE: Don't say "Email not found" — that leaks info
    ▼ bcrypt.compare(password, user.password_hash)
    │   if false → 401 "Invalid credentials"
    │
    ▼ jwt.sign({ id, email, role }, JWT_SECRET, { expiresIn: '7d' })
    │
    ▼ Return 200 { success: true, data: { token, user } }
```

### Protected Request (any route requiring auth)
```
GET /enrollments/my
Authorization: Bearer eyJhbGc...
    │
    ▼ authenticate middleware runs
    │   → extracts token from "Bearer <token>"
    │   → jwt.verify(token, JWT_SECRET)
    │   → if invalid/expired → 401
    │   → if valid → attach payload to req.user
    │
    ▼ controller runs
    │   → req.user.id is available (who made the request)
    │   → req.user.role is available (what they're allowed to do)
    │
    ▼ (if route needs role check) → authorize('instructor') middleware
        → checks req.user.role === 'instructor'
        → if not → 403 Forbidden
```

---

## LLD — Users Table

```sql
CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,   -- DB enforces uniqueness
  password_hash VARCHAR(255) NOT NULL,          -- NEVER store plain text
  role          ENUM('student', 'instructor', 'admin') DEFAULT 'student',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

Key decisions:
- `UNIQUE` on email → second layer of protection after Zod validation
- `password_hash` not `password` → naming convention signals intent
- `admin` not in signup schema → admins are created manually by DB admins
- `ENUM` → DB rejects any value outside the allowed list

---

## Zod v4 — Email Validation Change

In Zod v4, `z.string().email()` still works but shows as deprecated.
The new preferred API uses top-level format validators:

```typescript
// ❌ Zod v3 style (deprecated in v4)
z.string().email("Invalid email")

// ✅ Zod v4 style
z.email("Invalid email")
```

---

## Security Rules (Never Break These)

1. **Never store plain text passwords** — always bcrypt hash
2. **Never say "Email not found" on failed login** — say "Invalid credentials" (don't confirm what emails exist)
3. **JWT payload is public** — never put sensitive data (passwords, card numbers) in it
4. **JWT_SECRET must be long and random** in production — treat it like a database password
5. **Always check token expiry** — jwt.verify() does this automatically
6. **401 vs 403:**
   - `401 Unauthorized` → not logged in (no valid token)
   - `403 Forbidden` → logged in but don't have permission (wrong role)

---

## New File Structure After Day 2

```
src/
├── schemas/
│   ├── course.schema.ts    ✅ done
│   └── user.schema.ts      ✅ done
│
├── services/
│   ├── course.service.ts   ✅ done
│   └── user.service.ts     ← signup, login logic (bcrypt + jwt here)
│
├── controllers/
│   ├── course.controller.ts ✅ done
│   └── auth.controller.ts   ← thin HTTP handlers for signup/login
│
├── routes/
│   ├── course.routes.ts    ✅ done
│   └── auth.routes.ts      ← POST /auth/signup, POST /auth/login
│
└── middlewares/
    ├── error-handlers.ts   ✅ done
    ├── authenticate.ts     ← verifies JWT, attaches req.user
    └── authorize.ts        ← checks req.user.role
```
