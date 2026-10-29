# Tales by Threads — Aari Work Studio

Single-page marketing site for a handcrafted aari & maggam work studio, built with
Next.js 16, React 19, Tailwind CSS 4 and PostgreSQL (Drizzle ORM).

## Requirements

- Node.js 20+
- PostgreSQL 14+

## Setup

```bash
npm ci
cp .env.example .env      # Windows: copy .env.example .env
```

Fill in `.env`:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Postgres connection string |
| `ADMIN_TOKEN` | Bearer token for admin-only APIs |
| `NEXT_PUBLIC_SITE_URL` | Public origin used for canonical/OG/JSON-LD (auto-detected on Vercel) |
| `NEXT_PUBLIC_GA_ID` | Optional GA4 measurement ID (`G-XXXXXXXXXX`) |
| `GALLERY_IMAGE_HOSTS` | Optional comma-separated hosts for gallery images |

Create the database tables:

```bash
npm run db:push          # quick sync for development
# or, for versioned migrations:
npm run db:generate
npm run db:migrate
```

Run the app:

```bash
npm run dev
```

Check the database connection at `GET /api/health`.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Start the production server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run db:generate` | Generate SQL migrations from `src/db/schema.ts` |
| `npm run db:migrate` | Apply pending migrations |
| `npm run db:push` | Push the schema directly (development) |
| `npm run db:studio` | Open Drizzle Studio |

## API

### `POST /api/enquiry`

Public. Creates an enquiry after validating name, mobile and work type.

### `GET /api/enquiry`

Admin only. Requires `Authorization: Bearer <ADMIN_TOKEN>`. Returns the latest 50
enquiries. Customer contact details are never exposed without the token.

### `GET /api/gallery`

Public. Returns database gallery items followed by the static items in
`src/lib/site.ts`. Falls back to static items when the database is empty or offline.

### `POST /api/gallery`

Admin only. Requires `Authorization: Bearer <ADMIN_TOKEN>`.

```bash
curl -X POST http://localhost:3000/api/gallery \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Bridal Peacock Blouse","category":"Aari Work","imageUrl":"/images/download.jpg"}'
```

`imageUrl` must be a path inside `/images/` or an `https` URL on a host listed in
`GALLERY_IMAGE_HOSTS` (or `images.unsplash.com`). Add new hosts before the build so
`next/image` can optimize them.

## Project structure

```
src/
  app/            App Router pages, metadata and API routes
  components/     Page sections and interactive UI
  db/             Drizzle client and schema
  lib/            Site content and admin auth helper
public/           Images, videos and brand assets
drizzle/          Generated SQL migrations
```

## Notes

- Gallery images uploaded through the API are stored as URLs only. File uploads need
  an external object store; reference photos are currently sent over WhatsApp.
- On Vercel, `NEXT_PUBLIC_SITE_URL` is derived from `VERCEL_PROJECT_PRODUCTION_URL`
  automatically. Set it explicitly only for a custom domain.
- Analytics is disabled unless `NEXT_PUBLIC_GA_ID` is set. WhatsApp and phone clicks
  are tracked automatically; form submissions emit an `enquiry_submitted` event.
