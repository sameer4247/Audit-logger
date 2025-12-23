# Audit-logger

Minimal audit-logging service built with Express + TypeScript + Prisma.

## Prerequisites
- Node.js 18+ (or compatible)
- npm
- SQLite (or DB configured in .env for Prisma)

## Setup & run (Windows)
1. Clone & install
   ```cmd
   git clone <repo>
   npm install
   ```

2. Create env file
   - Copy `.env.example` or create `.env` and set DATABASE_URL and PORT.
   -dummy .env 
   DATABASE_URL="file:./dev.db"
   HMAC_SECRET="66c66e76b682facd41275f4dc7fd84e08ba182cdfa4e6ad2a5873f035aeeaabe"
   LOG_LEVEL="info"

3. Generate Prisma client
   ```cmd
   npx prisma generate
   ```

4. Create/migrate DB (dev)
   ```cmd
   npx prisma migrate dev --name init
   ```

5. Seed two users
   ```cmd
   npm run seed
   ```
   - The seed script in `prisma/seed.ts` upserts two users (Jane, Bob). Ensure `prisma generate` ran and the generated client path is correct.

6. Build & start
   ```cmd
   npm run build   # runs prisma generate + tsc
   npm start       # runs node dist/app.js
   ```

7. Dev mode (live reload)
   ```cmd
   npm run dev
   ```

## Key scripts (package.json)
- `npm run build` — generate Prisma client then compile TypeScript.
- `npm start` — run compiled app from `dist`.
- `npm run dev` — nodemon + ts-node for development.
- `npm run seed` — run `prisma/seed.ts` to seed two users.

## Where to look
- App entry: `src/app.ts`
- Routes: `src/routes/*.ts`
- Controllers / Services / Repositories: `src/modules/*`
- Prisma schema: `src/prisma/schema/*.prisma`
- Seed: `prisma/seed.ts`
- Validation middleware: `src/middleware/validation.middleware.ts`
- Audit middleware / tracker: `src/middleware/audit.middleware.ts` / `src/common/utils/audit-trail.ts`

## Example API Endpoints

Note: adjust base path if your server mounts routes under a prefix (e.g. /api).

- List books (cursor pagination)
  ```bash
  curl "http://localhost:3000/api/books?limit=10&cursor=<cursor_id>"
  ```

- Get book by id
  ```bash
  curl "http://localhost:3000/api/books/<bookId>"
  ```

- Create book
  ```bash
  curl -X POST "http://localhost:3000/api/books" \
    -H "Content-Type: application/json" \
    -H "x-api-key: {{user_credential}}" \
    -d '{"title":"The Book","authors":"Author Name","publishedBy":"Publisher"}'
  ```


- Update book (PATCH)
  ```bash
  curl -X PATCH "http://localhost:3000/api/books/<bookId>" \
    -H "Content-Type: application/json" \
    -H "x-api-key: {{user_credential}}" \
    -d '{"title":"New Title"}'
  ```

- Delete book
  ```bash
  curl -X DELETE "http://localhost:3000/api/books/<bookId>" \
    -H "x-api-key: {{user_credential}}" \
  ```
//ADMIN only
- List audit logs (filtering via query)
  ```bash
  curl "http://localhost:3000/api/audit-logs?limit=20&entity=Book"
    -H "x-api-key: {{user_credential}}" \
  ```

- Get audit log by id
  ```bash
  curl "http://localhost:3000/api/audit-logs/<auditId>"
  -H "x-api-key: {{user_credential}}" \
  ```

## Design choices & reasons
- TypeScript + Prisma
  - Strong typing, generated DB types, fewer runtime errors.
- Express + middleware
  - Lightweight routing and composable concerns (auth, validation, audit).
- DTOs + class-transformer + class-validator
  - Keep incoming payloads typed and validated;
- Validation middleware
  - Centralized request validation and consistent error formatting.
- Repository + Service + Controller layers
  - Separation of concerns: DB access (Repository), business logic (Service), request handling (Controller). Easier testing and maintenance.
- Audit config + AuditTracker
  - Config-driven auditing (which entities/actions to track), produces JSON-Patch diffs and stores them to an `AuditLog` model for traceability and compliance.
  - Audit tracking is done via prisma client hooks so as to prevent illegal/malformed diffs
- Logging (pino)
  - Structured, performant logs for debugging and observability.

## Notes & common pitfalls
- Ensure `tsconfig.json` has `experimentalDecorators` for using class-validator/transformer.
- If you see errors about missing generated types or wrong import paths (e.g., `primsa` vs `prisma`), run `npx prisma generate` and fix typos in import paths to point to the generated client.
- Seed script imports the generated client — regenerate client if schema changed.
- If audit DB create fails due to FK constraint on `actorId`, ensure the actor/user exists before including `actorId` in the create payload.

If you want, I can:
- Add a fixed `README` section with example API endpoints and sample curl requests.
- Fix any typos in generated-client import paths (e.g., `primsa` → `prisma`) and update the seed script accordingly.