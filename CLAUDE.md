# UBIT Hub

A platform for students of a University of Karachi department: notes & past papers,
teacher ratings, global chat, event announcements, a requests noticeboard, carpooling,
a GPA calculator, and a campus map with place reviews.

**Full plan, schema, roadmap and design guide: `docs/PLAN.md`**

## Stack

- Next.js 16 (App Router), React 19, TypeScript, Tailwind v4
- **Supabase Auth** — email + password. Auth **only**.
- **`pg` (node-postgres)** — **all** data queries. No Prisma. No Supabase query client.
- Supabase Storage — uploaded files (notes, past papers, event posters)
- Supabase Postgres via the connection pooler (port 6543)

## The architecture in one line

Supabase's only job is turning a cookie into a trusted `user.id`.
Everything after that is raw SQL through `pg`.

## Rules — do not break these

**1. Auth check first.** Every route handler touching user data starts with:

```ts
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();
if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
```

Use `getUser()` (or `getClaims()`). **Never `getSession()`** for a security decision — it
reads the cookie without verifying it.

**2. `user.id` never comes from the request body.** Only from `getUser()`.
The client decides *what* the values are; the server decides *whose* row it is.

**3. Every `create table` is followed by:**

```sql
alter table <name> enable row level security;   -- no policies
```

`pg` connects as the table owner and bypasses RLS, so this costs nothing. It exists to lock
Supabase's auto-generated public REST API, which is reachable by anyone holding the public
`NEXT_PUBLIC_SUPABASE_ANON_KEY`. Without it, every table is world-writable.

**4. Parameterised SQL only.** `$1`, `$2` — never string interpolation.

**4a. Anonymity is enforced in the query, never in the UI.** `teacher_ratings` and
`requests` carry `is_anonymous`. When it is set, the SELECT must return neither the author's
name **nor their `user_id`** — hiding a field in JSX still ships it over the network, and a
returned id lets anonymous rows be correlated with the author's public ones. Use
`case when r.is_anonymous then null else p.first_name end` and expose
`(r.user_id = $1) as is_mine` instead of the raw id. See Module B in `docs/PLAN.md`.

**5. Scope every update and delete by owner:**

```sql
delete from carpool_posts where id = $1 and user_id = $2
```

`rowCount === 0` → return 404. There is no database-side guard; this is the only thing
stopping one student editing another's data.

## Key files

| File | Purpose |
|---|---|
| `src/lib/pg.ts` | The connection pool. Import `pool` from here. |
| `src/lib/supabase/server.ts` | Server client — `getUser()` in routes and server components |
| `src/lib/supabase/client.ts` | Browser client — login / signup / logout **only**, never queries |
| `src/proxy.ts` | Session refresh, runs on every request |

## Status

- [x] Supabase + `pg` connected and verified (pooler + SSL OK)
- [x] `profiles` table live, RLS enabled
- [ ] Signup / login forms wired — they currently only `router.push()`
- [ ] Everything else — see `docs/PLAN.md`

## Gotchas

- `npm run lint` fails on 5 errors, so **`next build` fails too**. Fix before deploying.
- The pooler is **transaction mode**: no `LISTEN/NOTIFY`, no prepared statements.
  This rules out Postgres pub/sub for chat — see the chat section in `docs/PLAN.md`.
- Run schema changes in the **Supabase SQL editor**, not through the pooled connection.
- All pages currently render hardcoded dummy arrays. Nothing is wired to the database yet.
- **Before launch: turn "Confirm email" back ON** in Supabase → Authentication → Providers.
  It is off during development so signup returns a session immediately. Signup is open (no
  university email exists to gate on), so email confirmation is the main thing stopping one
  person from creating unlimited accounts to skew teacher ratings.
