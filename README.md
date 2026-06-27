# Babies & Todd's Academy Platform

A TypeScript monorepo for the Babies & Todd's Academy public website, private academy management system, shared types, and NestJS API.

The platform has two connected surfaces: a public informational website for families and a private academy management system for parents, teachers, and the Admin/Director team.

## Technology Stack

- Frontend: Next.js App Router, TypeScript, Tailwind CSS
- Backend: NestJS, TypeScript
- ORM: Prisma
- Future database: PostgreSQL on AWS RDS
- Future auth: Amazon Cognito
- Future file storage: Amazon S3
- Future deployment: AWS with Cloudflare DNS

## Structure

- `apps/web` - Next.js App Router frontend with Tailwind CSS
- `apps/api` - NestJS API with Prisma setup
- `packages/shared` - shared TypeScript domain types and mock-friendly constants
- `docs` - project notes and the original `prototype.html` reference

## Local Development

```bash
npm install
```

Run both apps:

```bash
npm run dev
```

Run the frontend only:

```bash
npm run dev:web
```

Run the backend only:

```bash
npm run dev:api
```

The web app runs on `http://localhost:3000` and the API runs on `http://localhost:4000`.

## Build

```bash
npm run build
```

This builds the shared package, API, and web app in order.

## Environment

Copy the example files before running locally:

```bash
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env
```

No authentication, live database connection, or AI features are wired yet. All screens use mock data.

AWS, Cognito, PostgreSQL, S3, payments, and AI features are intentionally deferred for later phases.

Prisma is configured, but `prisma generate` is not run automatically during `npm install`. Run this manually when Prisma client generation is needed:

```bash
npm run prisma:generate
```
