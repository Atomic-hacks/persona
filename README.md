# persona

Content Lab / Screenshot Factory MVP. Generate. Save. Share.

## Install Dependencies

```bash
npm install framer-motion pg zod html-to-image clsx tailwind-merge
```

## Environment

Create `.env.local`:

```bash
DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DBNAME?sslmode=require
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

Notes:
- Use `sslmode=require` if your Postgres provider needs SSL (common for hosted DBs).
- `NEXT_PUBLIC_BASE_URL` is optional but recommended for correct share links behind proxies.

## Database

Apply the schema:

```bash
psql "$DATABASE_URL" -f db/schema.sql
```

## Run Dev Server

```bash
npm run dev
```

Open http://localhost:3000

## Troubleshooting SSL

If connections fail on hosted Postgres, ensure your `DATABASE_URL` includes `sslmode=require` or set `PGSSLMODE=require` in `.env.local`.
