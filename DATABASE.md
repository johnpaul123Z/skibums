# Jobs database (PostgreSQL)

Jobs are stored in PostgreSQL so the site loads fast. Every morning the DB is cleared and refilled from a fresh scrape.

## Setup

1. **Create a PostgreSQL database** (e.g. [Neon](https://neon.tech), [Supabase](https://supabase.com)). Get the connection string from Project Settings → Database → Connection string (URI). Replace `[YOUR-PASSWORD]` with your DB password.

2. **Set env var** (local and on your host):
   ```bash
   DATABASE_URL="postgresql://postgres:PASSWORD@host:5432/postgres?sslmode=require"
   ```

3. **Run migrations** (once, with `DATABASE_URL` set): Either let the build run `prisma migrate deploy`, or locally: `npx prisma migrate deploy`.

4. **Seed the DB** (first time): Call `POST https://skijobs.net/api/jobs/refresh` (or GET). If you set `CRON_SECRET`, add header: `Authorization: Bearer YOUR_CRON_SECRET`.

---

## Render (you're here)

- **Env vars**: In the Render dashboard → your **Web Service** → **Environment** → add `DATABASE_URL` (and optionally `CRON_SECRET`). Redeploy after adding.
- **Cron**: Render doesn't run `vercel.json`. To run refresh at **2 AM CT** daily, use either:
  - **Render Cron Job**: Create a separate **Cron Job** service. Command: `curl -X POST https://skijobs.net/api/jobs/refresh -H "Authorization: Bearer $CRON_SECRET"`. Schedule: `0 8 * * *` (2 AM CT = 08:00 UTC). Set `CRON_SECRET` in the cron job's env.
  - **External cron**: e.g. [cron-job.org](https://cron-job.org) — create a job that POSTs to `https://skijobs.net/api/jobs/refresh` at 2 AM CT, with header `Authorization: Bearer YOUR_CRON_SECRET` if you use one.

## Flow

- **GET /api/jobs** – reads from DB (fast). Used by the homepage and `/jobs` page.
- **GET/POST /api/jobs/refresh** – deletes all jobs, scrapes Vail + Alterra + Boyne + Powdr, inserts into DB.
- If the DB is empty, the frontend falls back to the scrape API.
