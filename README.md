Enterprise Gym Management System

## Overview

- Purpose: Full-stack application to manage gym operations — members, staff, trainers, classes, bookings, equipment, maintenance, payments, and invoices.
- Scope: REST APIs for business logic (backend) and a single-page application (frontend) for users and administrators.

## Key Features

- Member management: register, authenticate, profile and subscription management.
- Class scheduling & booking: create schedules, member bookings, and attendance logging.
- Facility & equipment tracking: equipment inventory, facility rooms, and maintenance logs.
- Billing & payments: invoices, payment records, and membership plans.
- Staff & trainer management: CRUD operations and role-based actions.
- Authentication: JWT-based stateless authentication.

## Repository Layout

- `backend` — Spring Boot (Java) application providing REST APIs, persistence, and security.
- `frontend` — Vite + React + TypeScript single-page application.
- Top-level: `docker-compose.yml`, this `README.md`.

## Tech Stack

- Backend: Java, Spring Boot, Spring Data JPA, Maven
- Frontend: React, TypeScript, Vite
- Database: PostgreSQL
- Security: JWT
- Containerization: Docker & Docker Compose

## Architecture (high level)

- Client (React SPA) ↔ REST API (Spring Boot) ↔ Database
- Layered backend: controllers → services → repositories → models
- JWT tokens issued by authentication endpoints for stateless sessions

## Run Locally

Backend (from project root)

```powershell
cd backend
./mvnw.cmd spring-boot:run
```

Frontend

```bash
cd frontend
npm install
npm run dev
```

## Run with Docker Compose

This project includes a `docker-compose.yml` to start the backend, frontend (or static hosting), and a database together.

```bash
docker-compose up --build
```

## Database

- Initialization script: `backend/init-db.sql`.
- Configure connection details in `backend/src/main/resources/application.properties` or via environment variables when running in Docker.

## Configuration

- Backend: `backend/src/main/resources/application.properties` for defaults; use env vars in production.
- Frontend: `frontend/vite.config.ts` and `frontend/package.json`.
- Keep JWT secrets and DB credentials out of source — use environment variables or Docker secrets.

## Development Notes

- Controllers: `backend/src/main/java/com/example/gym/controller`
- DTOs: `backend/src/main/java/com/example/gym/dto`
- Models: `backend/src/main/java/com/example/gym/model`
- Repositories: `backend/src/main/java/com/example/gym/repository`
- JWT util: `backend/src/main/java/com/example/gym/security/JwtUtil.java`

## Testing

- Backend tests: `backend/src/test/java/...` — run with Maven:

```bash
cd backend
./mvnw test
```

- Frontend tests: if present, run via npm scripts in `frontend`.

## Contributing

- Fork the repository and open a pull request from a branch named `feat/...` or `fix/...`.
- Keep changes focused, include tests where applicable, and update this README when making infra or architectural changes.

## License

- Add a license file (for example, `LICENSE` with MIT) and update this section accordingly.

## Contact

- Open issues or pull requests on the repository for questions or feature requests.

---

If you want, I can:
- customize the Run/DB instructions for a specific database (Postgres/MySQL), or
- commit this change and run the backend tests locally.
