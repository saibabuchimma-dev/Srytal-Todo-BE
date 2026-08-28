# SRYTAL — Task Management (Backend API)

The REST API for the SRYTAL task-management system, built with **Express 5**, **TypeScript**, and **MongoDB (Mongoose)**. It provides JWT authentication (access + refresh tokens), role-based access control, and endpoints for employees, tasks, projects, comments, attachments, notifications, activity logs, and reports — plus email notifications and interactive Swagger docs.

> This is the **backend** repository. The React client lives in the `Srytal-Todo-FE` repository.

---

## ✨ Features

- **JWT authentication** — short-lived access tokens + long-lived refresh tokens (rotation + logout/revocation), with role-based access control (Admin / Employee).
- **Employees** — CRUD, profile (`/me`), password change, search, stats, and temporary-password onboarding (emailed + returned).
- **Tasks** — CRUD, assignment, status updates (owner-checked), search, pagination, and dashboard metrics.
- **Projects** — CRUD, members, per-project task groups, and detail aggregation.
- **Comments & attachments** — Comments and file uploads (Multer, statically served) per task.
- **Notifications & activity log** — emitted on assignment, status change, and new comments.
- **Reports** — aggregated status, priority, and monthly-trend analytics.
- **Email notifications** — via Nodemailer with HTML templates.
- **API documentation** — Swagger UI served at `/docs`.
- **Admin seeding** — one command to create the initial admin account.
- **Hardening** — Helmet, CORS (env-configurable), gzip compression, and request logging (Morgan).

---

## 🧰 Tech Stack

| Area | Technology |
| --- | --- |
| Runtime | Node.js, Express 5 |
| Language | TypeScript (strict) |
| Database | MongoDB + Mongoose |
| Auth | JWT access + refresh tokens, bcrypt |
| Validation | Zod |
| Uploads | Multer |
| Email | Nodemailer |
| Docs | swagger-jsdoc, swagger-ui-express |
| Security | Helmet, CORS, compression, Morgan |

---

## 📋 Prerequisites

- **Node.js 20+** and **npm**
- **MongoDB** (local or a hosted connection string, e.g. MongoDB Atlas)

---

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Create your environment file (see below)
cp .env.example .env

# 3. Seed the initial admin account (optional but recommended)
npm run seed

# 4. Start the dev server (http://localhost:5000)
npm run dev
```

Once running:

- API base — `http://localhost:5000/api`
- Health check — `http://localhost:5000/health`
- Swagger UI — `http://localhost:5000/docs`

### Environment variables

Create a `.env` file in the project root:

```env
# Server
PORT=5000
NODE_ENV=development
APP_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173

# CORS origins (comma-separated for multiple)
CORS_ORIGINS=http://localhost:5173

# Database
MONGO_URI=mongodb://127.0.0.1:27017/srytal

# JWT Access Token
JWT_SECRET=replace-with-a-long-random-secret
JWT_ACCESS_EXPIRES_IN=15m

# JWT Refresh Token
JWT_REFRESH_SECRET=replace-with-a-different-long-random-secret
JWT_REFRESH_EXPIRES_IN=7d

# Email (Nodemailer / SMTP)
MAIL_FROM="SRYTAL <no-reply@srytal.com>"
SMTP_HOST=smtp.example.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
```

| Variable | Description | Default |
| --- | --- | --- |
| `PORT` | Port the server listens on | `5000` |
| `NODE_ENV` | Environment (`development` / `production`) | `development` |
| `APP_URL` | Public base URL of the API | `http://localhost:5000` |
| `FRONTEND_URL` | Public base URL of the React client (used in emails) | `http://localhost:5173` |
| `CORS_ORIGINS` | Allowed origins (comma-separated) | `http://localhost:5173` |
| `MONGO_URI` | MongoDB connection string | — (required) |
| `JWT_SECRET` | Secret used to sign access tokens | — (required) |
| `JWT_ACCESS_EXPIRES_IN` | Access token lifetime (e.g. `15m`) | `15m` |
| `JWT_REFRESH_SECRET` | Secret used to sign refresh tokens | falls back to `JWT_SECRET` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token lifetime (e.g. `7d`) | `7d` |
| `MAIL_FROM` | Default "from" address for emails | — |
| `SMTP_HOST` / `SMTP_PORT` | SMTP server host and port | — / `465` |
| `SMTP_SECURE` | Use TLS (`true` for port 465) | — |
| `SMTP_USER` / `SMTP_PASS` | SMTP credentials | — |

---

## 📜 Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the API in watch mode (tsx) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled server (`dist/server.js`) |
| `npm run seed` | Seed the default admin user |
| `npm run lint` | Run ESLint |
| `npm run format` | Format the codebase with Prettier |

### Default admin

`npm run seed` creates an admin account:

- **Email:** `admin@srytal.com`
- **Password:** `password123`

> Change this password immediately after first login in any non-local environment.

---

## 🔐 Authentication

Three endpoints under `/api/auth`:

| Endpoint | Purpose |
| --- | --- |
| `POST /auth/login` | Authenticate and receive `{ accessToken, refreshToken, user, mustChangePassword }` |
| `POST /auth/refresh` | Exchange a valid refresh token for a new access + refresh token pair (rotation revokes the old token) |
| `POST /auth/logout` | Revoke a refresh token (`{ refreshToken }`) |

- Access tokens are short-lived (default `15m`) and carry a payload of `{ id, fullName, email, role, type: "access" }`. They are sent as `Authorization: Bearer <token>`.
- Refresh tokens are long-lived (default `7d`), carry `type: "refresh"`, are **hashed (SHA-256)** and stored in the `AuthToken` collection, and can only be used against `/auth/refresh`.
- When a user changes their password the temp-password flag (`mustChangePassword`) blocks non-admin access until reset.

---

## 🔌 API Overview

All routes are prefixed with `/api`. Protected routes require an `Authorization: Bearer <access-token>` header.

| Resource | Base path | Key endpoints |
| --- | --- | --- |
| Auth | `/api/auth` | `POST /login`, `POST /refresh`, `POST /logout` |
| Employees | `/api/employees` | `GET /`, `GET /search`, `GET /count`, `GET /me`, `PATCH /me`, `PATCH /change-password`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id` |
| Tasks | `/api/tasks` | `GET /`, `GET /search`, `GET /my-tasks`, `GET /dashboard`, `GET /count`, `GET /:id`, `POST /`, `PUT /:id`, `PATCH /:id/status`, `DELETE /:id` |
| Projects | `/api/projects` | `GET /`, `GET /search`, `GET /my-projects`, `GET /dashboard`, `GET /recent`, `GET /count`, `GET /:id`, `GET /:id/details`, `POST /`, `PUT /:id`, `PATCH /:id/members`, `DELETE /:id` |
| Comments | `/api/comments` | `GET /task/:taskId`, `POST /task/:taskId`, `PATCH /:id`, `DELETE /:id` |
| Attachments | `/api/attachments` | `GET /task/:taskId`, `POST /task/:taskId`, `DELETE /:id` |
| Notifications | `/api/notifications` | `GET /`, `GET /unread-count`, `PATCH /:id/read`, `PATCH /read-all`, `DELETE /:id` |
| Activities | `/api/activities` | `GET /task/:taskId` |
| Reports | `/api/reports` | `GET /overview` |

Full, always-up-to-date request/response schemas are available in the **Swagger UI at `/docs`**.

---

## 📁 Project Structure

```
src/
├── config/          # Env parsing, database connection, Swagger, Multer setup
├── middleware/      # Auth, authorize (RBAC), force-password-change, error, not-found
├── modules/         # Feature modules (each with model, service, controller, repository, routes, types)
│   ├── auth/        # Login / refresh / logout + AuthToken (refresh) model + token service
│   ├── employee/
│   ├── tasks/
│   ├── project/
│   ├── comment/
│   ├── attachment/
│   ├── notification/
│   ├── activity/
│   ├── report/
│   └── mail/
├── routes/          # Root router that mounts all module routes under /api
├── seed/            # Database seeders (admin)
├── templates/       # Email HTML templates
├── types/           # Shared type declarations
├── utils/           # Helpers (ApiError, asyncHandler, mailer, generatePassword)
├── app.ts           # Express app: middleware, static uploads, routes, Swagger, error handling
└── server.ts        # Bootstraps the DB connection and starts the server
```

Data flows **routes → controller → service → repository → model**. The repository is the only layer that touches Mongoose models, and input is validated with Zod in the services/controllers.

---

## 🏗️ Production Build

```bash
npm run build   # compile to dist/
npm start       # run dist/server.js
```

The `@/` path alias is resolved at runtime via `module-alias` (mapped to `./dist`), so the compiled server runs as-is. Ensure all required environment variables are set and `MONGO_URI` points to your production database.

---

## 📄 License

This project is provided as-is for the SRYTAL task-management system.
