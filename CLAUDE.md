 # SRYTAL Task Management System — Backend

> Node.js + Express + TypeScript + MongoDB (Mongoose) API for an HRMS + Project
> Management platform. This file is the source of truth for architecture and
> conventions. Follow it for every change.

## Stack
- Node.js, Express, TypeScript (strict)
- MongoDB + Mongoose
- JWT authentication (no OTP, no reset-password, no refresh token — simple JWT)
- Nodemailer (Gmail SMTP)
- Swagger for API docs
- Zod for request validation

## Architecture — layered modules
Every domain lives under `src/modules/<name>/` and is split into layers. Data
flows **routes → controller → service → repository → model**. Never skip a layer.

```
src/
 ├── modules/
 │     auth/      employee/   project/   tasks/   mail/
 │        each module: *.routes.ts, *.controller.ts, *.service.ts,
 │                     *.repository.ts, *.model.ts, *.types.ts
 ├── middleware/   (auth, authorize, error, not-found, forcePasswordChange)
 ├── templates/emails/
 ├── utils/        (ApiError, ApiResponse, asyncHandler, mailer, logger, ...)
 └── config/       (env, database, swagger)
```

### Layer responsibilities
- **routes** — path + HTTP verb, attach middleware (`authMiddleware`,
  `authorize(...roles)`, `forcePasswordChange`), Swagger JSDoc. No logic.
- **controller** — read `req`, call the service, shape the JSON response
  (`{ success, message?, data }`). No business rules, no DB access.
- **service** — business rules, validation (Zod schemas from `*.types.ts`),
  authorization checks, orchestration. Throws `ApiError(status, message)`.
- **repository** — the ONLY place that touches Mongoose models.
- **model** — Mongoose schema + `InferSchemaType`.

## Auth & roles
- Roles: `"Admin" | "Employee"`.
- `authMiddleware` verifies JWT and sets `req.user` = `{ id, fullName, email, role }`.
- `authorize(...roles)` gates by role.
- JWT payload currently: `{ id, fullName, email, role }`.
- Password flow: admin creates employee → temp password emailed →
  `mustChangePassword = true` → employee must change on first login.

## Conventions
- Strong typing everywhere. **No `any`.**
- Validate input with Zod in the service before hitting the repository.
- Throw `ApiError` for all error cases; the error middleware formats the response.
- Keep modules small, scalable, production-ready. No duplicated logic.
- No stray `console.log` / debug code left in committed files.

## Gotcha — populated fields in ownership checks
`repository.findById` **populates** `assignedTo` (and `project`). A populated
field is a full document, not a bare `ObjectId`, so `field.toString()` does NOT
give the id. When comparing ownership, resolve the id defensively:
```ts
const ref = doc.assignedTo as { _id?: unknown } | null;
const id = ref && typeof ref === "object" && "_id" in ref
  ? String(ref._id) : ref ? String(ref) : null;
```
(This was the root cause of employees getting a false 403 on task status update.)

## Task endpoints
```
POST   /tasks              (Admin)         create
GET    /tasks              (Admin)         list all
GET    /tasks/search       (auth)          filter/paginate
GET    /tasks/dashboard    (auth)          stats
GET    /tasks/my-tasks     (Employee)      assigned to me
GET    /tasks/count        (auth)          total
GET    /tasks/:id          (auth)          detail
PUT    /tasks/:id          (Admin)         full update
PATCH  /tasks/:id/status   (Admin|Employee) status only — employee must own task
DELETE /tasks/:id          (Admin)         delete
```

## Roadmap
✅ Phase 1 Auth · ✅ Phase 2 Employee · ✅ Phase 3 Project · ✅ Phase 4 Task CRUD
· ✅ Phase 5 Employee "My Tasks" · ⬜ Phase 6 Kanban · ⬜ 7 Comments · ⬜ 8
Attachments · ⬜ 9 Notifications · ⬜ 10 Activity Timeline · ⬜ 11 Reports · ⬜
12 Role Permissions · ⬜ 13 Settings · ⬜ 14 Deployment

## Known issues / cleanups
- EmployeeService has a duplicate update after password change — should use only
  `updatePassword()`.
- Consider whether to keep `fullName` in the JWT payload (currently included).
- Welcome email template works but wants a final "Welcome to SRYTAL Task
  Management System" redesign.
