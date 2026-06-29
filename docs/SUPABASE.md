# Supabase Database Setup

The app already uses Prisma with PostgreSQL, so Supabase slots in as the hosted Postgres database.

## 1. Create the Supabase Project

Create a Supabase project for Babies & Todd's Academy and keep the database password somewhere safe.

## 2. Configure the API Environment

Copy the API env file if you have not already:

```bash
cp apps/api/.env.example apps/api/.env
```

Set `DATABASE_URL` in `apps/api/.env` to the Supabase Postgres connection string.

Use the pooled URI for normal app runtime:

```env
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?schema=public&sslmode=require&pgbouncer=true&connection_limit=10"
```

For one-off schema pushes, the direct connection string also works:

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?schema=public"
```

## 3. Push the Prisma Schema

From the repo root:

```bash
npm run prisma:generate -w @babies-tods/api
npm run prisma:push -w @babies-tods/api
```

## 4. Seed Demo Data

The seed script wipes existing app records before inserting demo data.

```bash
npm run seed -w @babies-tods/api
```

## 5. Verify the API

Start the API and check health:

```bash
npm run dev:api
```

Then open:

```text
http://localhost:4000/api/health
```

The response should show the database as healthy.

## Notes

- Keep the Supabase password out of Git.
- The public website still talks to the Nest API through `NEXT_PUBLIC_API_URL`.
- Supabase Auth and Storage can be added later; this setup is only for the database.
