# Portfolio Backend API

[![CI Pipeline](https://github.com/lord-joeh/portfolio-backend/actions/workflows/ci.yml/badge.svg)](https://github.com/lord-joeh/portfolio-backend/actions/workflows/ci.yml)
[![CD Pipeline](https://github.com/lord-joeh/portfolio-backend/actions/workflows/deploy.yml/badge.svg)](https://github.com/lord-joeh/portfolio-backend/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-green.svg)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/Framework-NestJS%2011-ea2849.svg)](https://nestjs.com/)
[![Supabase](https://img.shields.io/badge/Database-Supabase-3ecf8e.svg)](https://supabase.com/)
[![Docker](https://img.shields.io/badge/Container-Docker-2496ed.svg)](https://www.docker.com/)

A modern, production-grade RESTful API backend powering [Joseph Mensah's Portfolio](https://mensah.dev-joseph.me). Built with **NestJS 11**, **TypeScript**, **Supabase**, and containerized with **Docker**, featuring an automated **GitHub Actions CI/CD** pipeline.

---

## Table of Contents

- [Features](#features)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [Testing & Quality](#testing--quality)
- [Docker & Docker Compose](#docker--docker-compose)
- [API Reference](#api-reference)
- [CI/CD Pipeline](#cicd-pipeline)
- [License](#license)

---

## Features

- **About & Bio Management**: Retrieve and update profile information, biography text, social links (GitHub, LinkedIn, Twitter/X), resume PDF uploads, and avatar images.
- **Project Showcase**: Full CRUD for portfolio projects with file uploads (cover images/banners), GitHub repository links, demo URLs, technology tags, and card drag-and-drop reordering.
- **Skills Management**: Categorized technical skills management with icon uploads and custom display ordering.
- **Certificates**: Manage credentials and achievements with certificate image attachments and ordering.
- **Contact Inquiries & Auto-Responder**: Contact form submission handler that records messages into Supabase and automatically sends email notifications and receipts using Nodemailer (SMTP).
- **Supabase Authentication Guard**: Secure protected write/edit routes via `SupabaseAuthGuard` using Bearer JWT tokens.
- **Health Check Endpoint**: Public `/api/health` monitoring endpoint providing system status, process uptime, and ISO timestamps.
- **Automated CI/CD**: Complete continuous integration (linting, Prettier, unit and e2e testing, Docker smoke tests) and continuous deployment to VPS via GitHub Container Registry (GHCR) and SSH.

---

## Architecture & Tech Stack

- **Core Framework**: [NestJS 11](https://nestjs.com/) (modular architecture with Express under the hood)
- **Language**: [TypeScript 5.7](https://www.typescriptlang.org/)
- **Database & Storage**: [Supabase](https://supabase.com/) (PostgreSQL & Supabase Storage Buckets)
- **Email Service**: [Nodemailer](https://nodemailer.com/) (SMTP relay with Brevo)
- **File Uploads**: [Multer](https://github.com/expressjs/multer) via NestJS `@UploadedFile()` / `@UploadedFiles()`
- **Testing**: [Jest](https://jestjs.io/) (Unit testing) & [Supertest](https://github.com/ladjs/supertest) (E2E testing)
- **Code Quality**: [ESLint 9](https://eslint.org/) (flat config) & [Prettier](https://prettier.io/)
- **Containerization**: [Docker](https://www.docker.com/) (multi-stage Alpine builds) & [Docker Compose](https://docs.docker.com/compose/)
- **Deployment**: [GitHub Actions](https://github.com/features/actions), [GHCR](https://github.com/features/packages), and VPS automated SSH restart

---

## Project Structure

```text
portfolio-backend/
├── .github/
│   └── workflows/
│       ├── ci.yml            # CI: Lint, Prettier, Unit/E2E tests, Build, Docker smoke test
│       └── deploy.yml        # CD: Build & Push to GHCR, SSH deploy to VPS
├── src/
│   ├── about/                # Profile info, resume, and avatar management
│   ├── auth/                 # Supabase authentication guard (JWT verification)
│   ├── certificates/         # Certificates & credentials CRUD
│   ├── health/               # Health check endpoint (/api/health)
│   ├── notifications/        # Contact form submissions and Nodemailer SMTP service
│   ├── projects/             # Portfolio projects CRUD & reordering
│   ├── skills/               # Skills & categories CRUD & reordering
│   ├── supabase/             # Supabase client service and file upload handler
│   ├── app.module.ts         # Root application module
│   └── main.ts               # Application entrypoint (CORS, global prefix, validation)
├── test/
│   ├── health.e2e-spec.ts    # End-to-end integration tests
│   └── jest-e2e.json         # Jest e2e configuration
├── .env.example              # Template environment variables
├── docker-compose.yml        # Local/VPS Docker Compose specification
├── Dockerfile                # Multi-stage production container build (Node 22 Alpine)
├── package.json              # Dependencies and scripts
└── tsconfig.json             # TypeScript compiler configuration
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20.x or v22.x LTS recommended)
- [npm](https://www.npmjs.com/) (v10+ or v11+)
- [Docker](https://www.docker.com/) & Docker Compose (optional, for containerized run)
- A [Supabase](https://supabase.com/) project with database and storage buckets configured
- An SMTP provider (e.g., Brevo, SendGrid, Gmail SMTP) for email notifications

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/lord-joeh/portfolio-backend.git
   cd portfolio-backend
   ```

2. **Install dependencies**:
   ```bash
   npm ci
   ```

### Environment Variables

Copy the example environment configuration:

```bash
cp .env.example .env
```

Configure the environment variables in your `.env` file:

| Variable             | Description                                           | Example                        |
| :------------------- | :---------------------------------------------------- | :----------------------------- |
| `PORT`               | HTTP server port                                      | `3000`                         |
| `NODE_ENV`           | Environment mode (`development` or `production`)      | `development`                  |
| `FRONTEND_URL`       | Frontend URL allowed for CORS requests                | `https://mensah.dev-joseph.me` |
| `DOMAIN`             | Application public domain                             | `https://mensah.dev-joseph.me` |
| `SUPABASE_URL`       | Supabase project API URL                              | `https://xyz.supabase.co`      |
| `SUPABASE_KEY`       | Supabase Service Role Key                             | `eyJhbGciOi...`                |
| `SMTP_HOST`          | SMTP relay server hostname                            | `smtp-relay.brevo.com`         |
| `SMTP_PORT`          | SMTP port (`587` for STARTTLS, `465` for SSL, `2525`) | `587`                          |
| `SMTP_USER`          | SMTP username                                         | `user@smtp-brevo.com`          |
| `SMTP_PASS`          | SMTP password or API token                            | `secret_token`                 |
| `SMTP_FROM`          | Sender email address for outgoing messages            | `joseph@example.com`           |
| `NOTIFICATION_EMAIL` | Recipient inbox for contact form notifications        | `joseph@example.com`           |

### Running the Application

```bash
# Development (with hot-reload)
npm run start:dev

# Production build & run
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000/api`.

---

## Testing & Quality

```bash
# Run unit tests
npm test

# Run unit tests with coverage
npm run test:cov

# Run end-to-end (E2E) integration tests
npm run test:e2e

# Run ESLint check & autofix
npm run lint

# Check code formatting with Prettier
npx prettier --check "src/**/*.ts" "test/**/*.ts"

# Format all files with Prettier
npm run format
```

---

## Docker & Docker Compose

### Using Docker Compose

Start the container with your `.env` file:

```bash
docker compose up -d --build
```

View live logs:

```bash
docker compose logs -f
```

Stop the container:

```bash
docker compose down
```

### Manual Docker Build

```bash
# Build production image
docker build -t portfolio-backend:latest .

# Run container
docker run -d \
  -p 3000:3000 \
  --env-file .env \
  --name portfolio-backend \
  portfolio-backend:latest
```

---

## API Reference

All routes are prefixed with `/api`. Protected routes require an `Authorization: Bearer <supabase_jwt_token>` header.

### Health Check

| Method | Endpoint      | Auth   | Description                                  |
| :----- | :------------ | :----- | :------------------------------------------- |
| `GET`  | `/api/health` | Public | Returns system status, timestamp, and uptime |

### About

| Method | Endpoint          | Auth     | Description                                             |
| :----- | :---------------- | :------- | :------------------------------------------------------ |
| `GET`  | `/api/about/info` | Public   | Retrieve current about bio, links, and avatar/resume    |
| `POST` | `/api/about`      | Required | Update about bio, social links, resume file, and avatar |

### Projects

| Method   | Endpoint                | Auth     | Description                                           |
| :------- | :---------------------- | :------- | :---------------------------------------------------- |
| `GET`    | `/api/projects`         | Public   | Retrieve all portfolio projects                       |
| `POST`   | `/api/projects`         | Required | Create a new project (supports multipart file upload) |
| `PATCH`  | `/api/projects/:id`     | Required | Update project metadata or cover file                 |
| `PATCH`  | `/api/projects/reorder` | Required | Reorder projects display index                        |
| `DELETE` | `/api/projects/:id`     | Required | Delete a project                                      |

### Skills

| Method   | Endpoint              | Auth     | Description                            |
| :------- | :-------------------- | :------- | :------------------------------------- |
| `GET`    | `/api/skills`         | Public   | Retrieve all skills grouped or indexed |
| `POST`   | `/api/skills`         | Required | Add a new skill with icon attachment   |
| `PATCH`  | `/api/skills/:id`     | Required | Update an existing skill               |
| `PATCH`  | `/api/skills/reorder` | Required | Update skills display order            |
| `DELETE` | `/api/skills/:id`     | Required | Delete a skill                         |

### Certificates

| Method   | Endpoint                    | Auth     | Description                |
| :------- | :-------------------------- | :------- | :------------------------- |
| `GET`    | `/api/certificates`         | Public   | Retrieve all certificates  |
| `POST`   | `/api/certificates`         | Required | Upload a new certificate   |
| `PATCH`  | `/api/certificates/:id`     | Required | Update certificate details |
| `PATCH`  | `/api/certificates/reorder` | Required | Reorder certificates       |
| `DELETE` | `/api/certificates/:id`     | Required | Delete a certificate       |

### Notifications & Contact Form

| Method | Endpoint             | Auth     | Description                                      |
| :----- | :------------------- | :------- | :----------------------------------------------- |
| `POST` | `/api/notifications` | Public   | Submit contact message (triggers email delivery) |
| `GET`  | `/api/notifications` | Required | Retrieve all incoming contact submissions        |

---

## CI/CD Pipeline

The repository utilizes **GitHub Actions** for continuous integration and delivery:

1. **Continuous Integration (`.github/workflows/ci.yml`)**:
   - Triggers on pull requests and pushes to `main`.
   - Runs Prettier and ESLint code checks.
   - Runs unit tests and verifies code coverage.
   - Compiles the NestJS TypeScript application.
   - Executes a Docker smoke test with Docker Buildx.

2. **Continuous Deployment (`.github/workflows/deploy.yml`)**:
   - Triggers automatically upon merges into `main`.
   - Builds and tags a production Docker image and publishes it to **GitHub Container Registry (`ghcr.io`)**.
   - Connects to your production VPS via SSH.
   - Pulls the latest container image and runs `docker compose up -d --no-deps portfolio-backend`.
   - Executes container health checks against `/api/health` before confirming deployment success.

### Required GitHub Secrets

To enable the deployment workflow, configure the following in **Settings > Secrets and variables > Actions**:

- `SSH_HOST`: IP address or domain of the VPS
- `SSH_USER`: SSH login username (e.g., `root` or `deploy`)
- `SSH_KEY`: Private SSH key
- `SSH_PORT`: SSH port (typically `22`)

---

## License

This project is licensed under the [MIT License](LICENSE).
