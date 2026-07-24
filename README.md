# SRYTAL — Task Management (Backend API)

The REST API for the SRYTAL task-management system, built with **Express 5**, **TypeScript**, and **MongoDB (Mongoose)**. It provides JWT authentication, role-based access control, and endpoints for employees, tasks, projects, comments, attachments, notifications, activity logs, and reports — plus email notifications and interactive Swagger docs.

> This is the **backend** repository. The React client lives in the `Srytal-Todo-FE` repository.

---

## ✨ Features

- **JWT authentication** with role-based access control (Admin / Employee).
- **Employees** — CRUD, profile (`/me`), password change, search, and stats.
- **Tasks** — CRUD, assignment, status updates, search, pagination, and dashboard metrics.
- **Projects** — CRUD, members, per-project task groups, and detail aggregation.
- **Comments & attachments** — Markdown comments and file uploads (Multer) per task.
- **Notifications & activity log** — emitted on assignment, status change, and new comments.
- **Reports** — aggregated status, priority, and monthly-trend analytics.
- **Email notifications** — via Nodemailer with HTML templates.
- **API documentation** — Swagger UI served at `/docs`.
- **Admin seeding** — one command to create the initial admin account.
- **Hardening** — Helmet, CORS, gzip compression, and request logging (Morgan).

---

## 🧰 Tech Stack

| Area | Technology |
| --- | --- |
| Runtime | Node.js, Express 5 |
| Language | TypeScript |
| Database | MongoDB + Mongoose |
| Auth | JSON Web Tokens, bcrypt |
| Validation | Zod, express-validator |
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

# Database
MONGO_URI=mongodb://127.0.0.1:27017/srytal

# Auth
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d

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
| `MONGO_URI` | MongoDB connection string | — (required) |
| `JWT_SECRET` | Secret used to sign JWTs | — (required) |
| `JWT_EXPIRES_IN` | Token lifetime (e.g. `7d`) | — |
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

## 🔌 API Overview

All routes are prefixed with `/api`. Protected routes require an `Authorization: Bearer <token>` header.

| Resource | Base path | Key endpoints |
| --- | --- | --- |
| Auth | `/api/auth` | `POST /login` |
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
├── config/          # Env parsing, database connection, Swagger setup
├── middleware/      # Auth, error handling, not-found, uploads
├── modules/         # Feature modules (each with model, service, controller, routes, types)
│   ├── auth/
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
├── utils/           # Helpers (ApiError, async handler, etc.)
├── app.ts           # Express app: middleware, routes, Swagger, error handling
└── server.ts        # Bootstraps the DB connection and starts the server
```

---

## 🏗️ Production Build

```bash
npm run build   # compile to dist/
npm start       # run dist/server.js
```

Ensure all required environment variables are set and `MONGO_URI` points to your production database.

---

## 📄 License

This project is provided as-is for the SRYTAL task-management system.
