# UBIT Hub — Build Plan

> A student platform for a University of Karachi department.
> Stack: Next.js 16 · Supabase Auth · PostgreSQL via `pg` · Supabase Storage
> Operational rules live in `/CLAUDE.md`. This document is the plan behind them.

---

## 1. Scope

Eight features, grouped into five modules. Nothing is dropped — grouping just makes the
build order and the shared pieces obvious.

| Module | Features | Depends on |
|---|---|---|
| **A. Foundation** | Auth, profiles, courses | — |
| **B. People** | Teacher profiles + ratings ⭐ | A |
| **C. Academics** | Notes & past papers · GPA calculator | A (courses) |
| **D. Community** | Global chat · Events · Requests board · Carpooling | A |
| **E. Places** | Campus map + place reviews (GeoRate) | A |

⭐ = your stated priority feature.

**Why group this way:** modules that share tables belong together. Notes and the GPA
calculator both hang off `courses`. Teacher ratings and place reviews are the *same shape*
(a score + a comment attached to a thing) — build one and the second is a copy. Chat,
events, requests and carpooling share nothing but `profiles`, so they can be built in any
order.

**Requests and carpooling are separate features**, not one board with a category filter.
The requests board is a general student noticeboard (notes, past papers, project partners,
tutoring, lost & found). Carpooling has entirely different fields — origin, destination,
departure time, seats — and entirely different queries. See Step 5 for the reasoning.

**Foundation is not a feature.** It is the thing all seven others sit on. It ships first or
nothing else can be built.

---

## 2. How to go from a feature list to a database

This is the part worth internalising. The schema in section 4 is the *output* of this
process — if you only copy the output, you'll be stuck the next time.

### Step 1 — Do not start with tables. Start with sentences.

Write what people actually *do*, one plain sentence each:

- "A **student** uploads a **past paper** for a **course**."
- "A **student** rates a **teacher** on teaching, grading and vibe."
- "A **student** posts a **carpool offer** from Gulshan to campus at 8am."
- "A **student** reviews the **canteen** and gives it 4 stars."
- "An **admin** announces an **event** on 12 March."

Ten to twenty sentences covering your whole app. This takes 20 minutes and saves days.

### Step 2 — Circle the nouns

From above: student, past paper, course, teacher, rating, carpool offer, canteen, review,
admin, event.

Those are your **candidate** tables. Not all survive.

### Step 3 — Three tests: is this noun a table, or just a column?

Run every candidate through all three.

**Test 1 — Identity.** *Does anything else need to point at it?*
`course` → notes point at it, teachers teach it, GPA entries use it. **Yes → table.**

**Test 2 — Multiplicity.** *Can one parent have many of these?*
A teacher has many ratings. So ratings cannot be columns on `teachers` — you'd need
`rating1`, `rating2`… which is the classic signal you're looking at a table. **Yes → table.**

**Test 3 — Own attributes.** *Does it carry data of its own?*
A rating has three scores, a comment, an author and a date. **Yes → table.**

**Now a counter-example.** "Urgency" on a carpool post:

- Identity? Nothing points at an urgency. ✗
- Multiplicity? One post has exactly one urgency. ✗
- Attributes? It's a single word. ✗

**Zero of three → it's a column,** `urgency text`. Same for `status`, `kind`, `category`.

> **The rule:** three yeses → table. Zero or one → column. Exactly two → think harder,
> usually a column until it grows.

### Step 4 — Name the relationship shapes

Once you have tables, connect them. There are only three shapes:

**One-to-many** — one course, many notes. The foreign key goes on the **many** side:
`resources.course_id`. This is 90% of your relationships.

**Many-to-many** — a teacher teaches many courses; a course is taught by many teachers.
Neither side can hold the key, so you need a third table that holds both:

```
teachers ──< teacher_courses >── courses
```

Every many-to-many costs you an extra table. That's how you predict your table count.

**One-to-one** — a profile and an auth user. Same primary key on both sides
(`profiles.user_id` → `auth.users.id`). Rare; usually means the data could have been one
table, but here it's forced because Supabase owns `auth.users`.

### Step 5 — Merge or split? The 80% rule

Notes and past papers *feel* like two features. Are they two tables?

Ask three questions:
1. Do they share most of their columns? — Yes: file, title, course, uploader, date.
2. Do they share their flow? — Yes: upload, browse, download, approve.
3. Do the queries diverge? — No: "list resources for course X" serves both.

> **If two things share ~80% of their columns *and* all of their code, use one table with a
> `kind` column.** Split only when the queries genuinely diverge.

So: **one `resources` table**, `kind in ('note','past_paper')`, with `paper_year` and
`exam_type` nullable because only past papers use them.

The opposite call: carpooling looks like it could join a generic "requests" board, but its
fields (origin, destination, departure time, seats) are *entirely* different and its queries
diverge ("find rides leaving Gulshan before 9am" makes no sense for a notes request).
**Different columns + different queries → separate table.**

### Step 6 — Does this feature need a table at all?

The GPA calculator is pure arithmetic. A student types grades and credit hours, sees a
number. **That needs zero tables.**

> Ask: *"does this need to still be there after the tab closes?"*
> No → no table. Just a React component.

Add `gpa_semesters` **only** when you decide students should save results across semesters.
That is a Phase-2 decision, not a Day-1 one.

### Step 7 — Counting the tables

```
tables = (nouns passing the 3 tests) + (one join table per many-to-many)
```

For this project: **15 core + 2 optional (GPA persistence) = 17.**

Don't aim at a number, and don't be alarmed by it — **you will never create 17 tables at
once.** Create each one in the session where you build the feature that uses it. You design
a table far better with its screen in front of you.

### Step 8 — What to build first

Two orderings, applied together:

1. **Dependency order** — build what everything else needs. Auth and `profiles` first,
   always. Nothing can be owned by a user until users exist.
2. **Risk order** — after the foundation, build your *priority* feature, not your easiest.
   You learn what's wrong with your design while it's still cheap to change.

Then: **one vertical slice at a time.** Table → route → page → working in the browser.
One complete feature beats six half-built ones, because the first slice teaches you the
patterns you reuse for the rest.

---

## 3. Entities and relationships

```
auth.users (Supabase)
     │ 1:1
  profiles ─────┬──────< teacher_ratings >──── teachers ──< teacher_courses >── courses
                │                                                                  │
                ├──────< resources >───────────────────────────────────────────────┤
                ├──────< requests >────────────────────────────────────────────────┘
                ├──────< chat_messages >──── chat_channels
                ├──────< events >──────────< event_rsvps
                ├──────< carpool_posts >───< carpool_responses
                ├──────< place_reviews >─── places
                └──────< gpa_semesters >───< gpa_entries          (optional)
```

`──<` means one-to-many. `>──<` means a join table (many-to-many).

**Read it as:** everything a student creates points back at `profiles`. That single column,
`user_id`, is what every ownership check in the app is built on.

---

## 4. Schema

Run these in the **Supabase SQL editor**, one module at a time, as you reach that phase.
Every table ends with `enable row level security` — see rule 3 in `/CLAUDE.md`.

### Module A — Foundation

`profiles` already exists. It needs three more columns:

```sql
alter table profiles add column if not exists role text not null default 'student'
  check (role in ('student','admin'));
alter table profiles add column if not exists batch_year  int;
alter table profiles add column if not exists avatar_url  text;
```

`role` is what gates admin-only actions (creating events, approving uploads). Adding it now
costs nothing; retrofitting it after three features exist is painful.

```sql
create table courses (
  id           uuid primary key default gen_random_uuid(),
  code         text not null unique,             -- 'CS-301'
  title        text not null,                    -- 'Database Systems'
  semester_no  int check (semester_no between 1 and 8),
  credit_hours int not null default 3,
  created_at   timestamptz not null default now()
);
alter table courses enable row level security;
```

> **Why `courses` is in the foundation:** notes, past papers, teachers and the GPA
> calculator all reference it. It is shared infrastructure, not a feature.

### Module B — Teachers & ratings (priority)

```sql
create table teachers (
  id          uuid primary key default gen_random_uuid(),
  full_name   text not null,
  designation text,                              -- 'Assistant Professor'
  email       text,
  bio         text,
  avatar_url  text,
  created_at  timestamptz not null default now()
);
alter table teachers enable row level security;
```

> **Teachers are not users.** They don't log in, so they are *not* rows in `profiles`.
> This is the most common modelling mistake in a project like this: "a teacher is a person,
> a student is a person, so one `people` table". No — a student **authenticates**, a teacher
> is **data about someone**. Different lifecycles, different tables.

```sql
create table teacher_courses (
  teacher_id uuid not null references teachers(id) on delete cascade,
  course_id  uuid not null references courses(id)  on delete cascade,
  primary key (teacher_id, course_id)
);
alter table teacher_courses enable row level security;
```

The many-to-many from Step 4. The composite primary key also prevents duplicate pairings
for free — no extra constraint needed.

```sql
create table teacher_ratings (
  id         uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references teachers(id) on delete cascade,
  user_id    uuid not null references profiles(user_id) on delete cascade,
  teaching   int  not null check (teaching between 1 and 5),
  grading    int  not null check (grading  between 1 and 5),
  vibe       int  not null check (vibe     between 1 and 5),
  comment    text,
  is_anonymous boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (teacher_id, user_id)
);
alter table teacher_ratings enable row level security;
create index on teacher_ratings (teacher_id);
```

> **`unique (teacher_id, user_id)` is the most important line here.** It means one rating
> per student per teacher, enforced by the database. Without it, one angry student can
> submit fifty 1-star ratings and the averages become meaningless. It also gives you
> "edit my rating" for free via `on conflict (teacher_id, user_id) do update`.

The three separate score columns (not one `rating`) exist because you asked for teaching
style, grading strictness and vibe as distinct axes. Averages are computed at query time:

```sql
select t.*,
       round(avg(r.teaching)::numeric, 1) as avg_teaching,
       round(avg(r.grading )::numeric, 1) as avg_grading,
       round(avg(r.vibe    )::numeric, 1) as avg_vibe,
       count(r.id) as rating_count
from teachers t
left join teacher_ratings r on r.teacher_id = t.id
group by t.id
order by t.full_name;
```

> **Don't store the average on `teachers`.** A stored average must be recalculated on every
> insert, update and delete, and it silently drifts out of sync the first time you forget.
> Compute it. If it ever becomes slow (it won't at department scale — a few hundred rows),
> add a materialised view then.

#### Optional anonymity — and the trap that breaks it

**Decided:** a student chooses per rating whether to attach their name. `is_anonymous`
defaults to `true` — the safe default, so nobody publishes their name by accident.

`user_id` is stored either way. It is required for the unique constraint, for "edit my
rating", and for admin moderation. **Anonymity is a display decision, not a storage one.**

Here is the mistake that makes the whole feature fake:

```ts
// ❌ BROKEN — the name reaches the browser even though the UI hides it
select r.*, p.first_name, p.last_name
from teacher_ratings r join profiles p on p.user_id = r.user_id
```

Hiding the name in JSX does nothing. The name travelled over the network, and anyone can
press **F12 → Network** and read it. It is a see-through envelope with *"please don't read
this"* written on the front.

**The server must never send it:**

```sql
select r.id, r.teaching, r.grading, r.vibe, r.comment, r.created_at, r.is_anonymous,
       case when r.is_anonymous then null else p.first_name end as first_name,
       case when r.is_anonymous then null else p.last_name  end as last_name,
       (r.user_id = $1) as is_mine
from teacher_ratings r
join profiles p on p.user_id = r.user_id
where r.teacher_id = $2
order by r.created_at desc;
```

**Note what is *not* in that select list: `user_id`.** This is the half everyone misses.
If you return the id even on anonymous rows, ratings can be grouped by it — so a student
who rates four teachers anonymously and one publicly gets **all five linked to their name**.
Pseudonymous ids deanonymise through correlation. Anonymous letters signed with the same
distinctive doodle stop being anonymous the moment one is signed with a name too.

`is_mine` is computed server-side so the UI can still offer "edit your rating" without ever
receiving an id.

**Two honest limits:** admins can still see authorship in the database (correct — you need
it for abuse), and in a department this small, *"the professor who taught DB Systems to
section B"* identifies the writer regardless. Anonymity means you don't print the name; it
cannot stop someone self-identifying through content.

**The rule:** *if the browser shouldn't know it, the server shouldn't send it.*

The same `is_anonymous` column appears on `requests` (Module D) — lost & found and tutoring
posts often want it — and could be added to `place_reviews` if you ever want it there.

### Module C — Notes, past papers & GPA

```sql
create table resources (
  id             uuid primary key default gen_random_uuid(),
  course_id      uuid not null references courses(id) on delete cascade,
  uploaded_by    uuid not null references profiles(user_id) on delete cascade,
  kind           text not null check (kind in ('note','past_paper')),
  title          text not null,
  description    text,
  file_path      text not null,                  -- Supabase Storage path
  file_size      int,
  mime_type      text,
  exam_type      text check (exam_type in ('midterm','final','quiz','assignment')),
  paper_year     int,                            -- past papers only
  status         text not null default 'pending'
                 check (status in ('pending','approved','rejected')),
  download_count int not null default 0,
  created_at     timestamptz not null default now()
);
alter table resources enable row level security;
create index on resources (course_id, kind, status);
```

One table for both, per the 80% rule in Step 5. `exam_type` and `paper_year` are nullable
because notes don't use them.

> **`status` exists because uploads are public.** Anyone can upload anything; without an
> approval step your notes section fills with junk and copyrighted material. Students see
> `status = 'approved'`; admins see everything.

The file itself goes in **Supabase Storage**, not Postgres. `file_path` stores the key.
Never put file bytes in a database column.

**GPA calculator — no tables required.** It is arithmetic on numbers the student types.
Build it as a client component with the grade scale hardcoded in TypeScript. Only if you
later want saved history do you add:

```sql
create table gpa_semesters (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references profiles(user_id) on delete cascade,
  semester_no   int not null check (semester_no between 1 and 8),
  gpa           numeric(3,2),
  total_credits int,
  created_at    timestamptz not null default now(),
  unique (user_id, semester_no)
);
alter table gpa_semesters enable row level security;

create table gpa_entries (
  id           uuid primary key default gen_random_uuid(),
  semester_id  uuid not null references gpa_semesters(id) on delete cascade,
  course_name  text not null,
  credit_hours int  not null,
  grade        text not null,
  grade_points numeric(3,2) not null
);
alter table gpa_entries enable row level security;
```

### Module D — Chat, events, requests, carpooling

```sql
create table chat_channels (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,              -- 'general'
  name        text not null,
  description text,
  created_at  timestamptz not null default now()
);
alter table chat_channels enable row level security;

create table chat_messages (
  id          uuid primary key default gen_random_uuid(),
  channel_id  uuid not null references chat_channels(id) on delete cascade,
  user_id     uuid not null references profiles(user_id) on delete cascade,
  body        text not null,
  reply_to_id uuid references chat_messages(id) on delete set null,
  created_at  timestamptz not null default now(),
  edited_at   timestamptz,
  deleted_at  timestamptz
);
alter table chat_messages enable row level security;
create index on chat_messages (channel_id, created_at desc);
```

> **Start with one channel** (`general`) even though the table supports many. The table
> costs nothing extra now and saves a migration later — but don't build channel UI until
> one room actually feels crowded.

`deleted_at` instead of a real `DELETE`: soft deletion keeps reply threads from breaking
when a parent message disappears.

```sql
create table events (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  starts_at   timestamptz not null,
  ends_at     timestamptz,
  venue       text,
  poster_path text,
  created_by  uuid not null references profiles(user_id) on delete cascade,
  created_at  timestamptz not null default now()
);
alter table events enable row level security;
create index on events (starts_at);

create table event_rsvps (
  event_id   uuid not null references events(id) on delete cascade,
  user_id    uuid not null references profiles(user_id) on delete cascade,
  status     text not null default 'going' check (status in ('going','interested')),
  created_at timestamptz not null default now(),
  primary key (event_id, user_id)
);
alter table event_rsvps enable row level security;
```

Creating an event is gated on `profiles.role = 'admin'` **in the route handler** — there is
no database-side check. Use `timestamptz`, never `timestamp`, for anything on a calendar.

#### The requests board

A general student noticeboard. The page already exists (`requests/page.tsx`) with the
categories below — **`CARPOOL` is removed from that list**, since carpooling is now its own
feature with its own fields.

```sql
create table requests (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references profiles(user_id) on delete cascade,
  category     text not null check (category in
               ('notes','past_paper','project','tutoring','lost_found')),
  title        text not null,
  description  text,
  urgency      text not null default 'low'
               check (urgency in ('low','medium','high','urgent')),
  status       text not null default 'open'
               check (status in ('open','resolved','closed')),
  course_id    uuid references courses(id) on delete set null,
  is_anonymous boolean not null default false,
  created_at   timestamptz not null default now()
);
alter table requests enable row level security;
create index on requests (status, category, created_at desc);
```

> **`color` is not a column.** The existing dummy data carries `color: 'bg-blue-400'` per
> row, but that is presentation, not data. Derive it from `category` in the frontend —
> otherwise a redesign becomes a database migration.

`status` matters more than it looks: without it the board fills with solved requests forever
and nobody scrolls past week two. `course_id` is nullable because a student asking for
"Automata slides" may not know the course code.

`is_anonymous` defaults to `false` here (unlike teacher ratings) — asking for notes carries
no risk, so the useful default is your name attached. Lost & found and tutoring posts are
where students will reach for it. **The same query rule from Module B applies: when the flag
is set, the server must not send the name or the `user_id`.**

```sql
create table carpool_posts (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references profiles(user_id) on delete cascade,
  kind           text not null check (kind in ('offer','request')),
  origin         text not null,
  destination    text not null,
  departure_time time not null,
  days_of_week   text[] not null default '{}',
  seats          int check (seats >= 0),
  notes          text,
  contact_phone  text,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now()
);
alter table carpool_posts enable row level security;

create table carpool_responses (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid not null references carpool_posts(id) on delete cascade,
  user_id    uuid not null references profiles(user_id) on delete cascade,
  message    text,
  status     text not null default 'pending'
             check (status in ('pending','accepted','declined')),
  created_at timestamptz not null default now(),
  unique (post_id, user_id)
);
alter table carpool_responses enable row level security;
```

One `kind` column covers both "I'm offering a ride" and "I need a ride" — they have
identical fields, so the 80% rule applies again. `is_active` lets a full car disappear from
listings without deleting its history.

### Module E — Campus map

```sql
create table places (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  category    text not null check (category in
              ('canteen','library','lab','atm','parking','hostel','other')),
  description text,
  latitude    double precision not null,
  longitude   double precision not null,
  image_path  text,
  created_by  uuid references profiles(user_id) on delete set null,
  created_at  timestamptz not null default now()
);
alter table places enable row level security;

create table place_reviews (
  id         uuid primary key default gen_random_uuid(),
  place_id   uuid not null references places(id) on delete cascade,
  user_id    uuid not null references profiles(user_id) on delete cascade,
  rating     int  not null check (rating between 1 and 5),
  comment    text,
  created_at timestamptz not null default now(),
  unique (place_id, user_id)
);
alter table place_reviews enable row level security;
create index on place_reviews (place_id);
```

> **Notice `place_reviews` is `teacher_ratings` with one score instead of three.** Same
> shape, same unique constraint, same aggregate query, same ownership check. Build teachers
> first and this module is largely a copy — which is exactly why B comes before E.

**On GeoRate reuse:** port the *Leaflet UI and the review logic*, not the old schema. Two
plain `double precision` columns are correct here — **do not reach for PostGIS.** It earns
its keep for radius search across a city; for one campus with a few dozen pins you fetch
them all and let Leaflet draw them.

---

## 5. Architecture decisions

### 5.1 Supabase for auth, `pg` for data

Supabase Auth handles password hashing, sessions, email verification and resets — none of
which is worth hand-building. Everything else is raw SQL through `pg`.

The seam is one line in every route handler:

```ts
const { data: { user } } = await supabase.auth.getUser();   // Supabase's entire job
...
await pool.query('insert into ... values ($1, ...)', [user.id, ...]);   // your job
```

**Consequence:** authorisation lives in your route handlers, not the database. See 5.2.

### 5.2 RLS enabled, zero policies

Supabase automatically publishes a REST API over every table in the `public` schema,
unlocked by `NEXT_PUBLIC_SUPABASE_ANON_KEY` — a key that ships to every visitor's browser.
**With RLS off, that API can read and write everything, bypassing your route handlers
entirely.**

`enable row level security` with no policies means "deny everyone". Your `pg` connection is
unaffected because it connects as the table owner, and Postgres exempts owners from RLS.

Result: the public API is sealed, your SQL still works, and there are no policies to
maintain. **Verify it after creating tables:**

```bash
curl 'https://<project>.supabase.co/rest/v1/<table>' -H "apikey: <anon-key>"
# expect [] or a permission error, never rows
```

### 5.3 No Prisma

Raw SQL through `pg`. Aggregates like the teacher-rating averages are a natural `GROUP BY`
and awkward through an ORM, and you keep full control of every query.

**The cost, stated plainly:** no generated types and no automatic ownership enforcement.
`rows` comes back as `any`. Define a TypeScript type per table by hand and annotate query
results. Discipline replaces the tooling.

### 5.4 Files in Supabase Storage

Notes, past papers and event posters go to Storage buckets; Postgres stores only the path.
Buckets are private, served through signed URLs generated in a route handler after the
usual auth check.

### 5.5 The chat problem — read this before building Module D

Real-time chat is the one feature that fights this architecture.

**Postgres `LISTEN/NOTIFY` is not available.** Your `DATABASE_URL` uses the pooler in
transaction mode (port 6543), which doesn't support it. That rules out the pure-`pg`
approach to push updates.

Two workable options:

| | How | Trade-off |
|---|---|---|
| **A. Polling** *(start here)* | `GET /api/chat?since=<timestamp>` every 3s | Trivially simple, pure `pg`, no exceptions. A few seconds of latency. |
| **B. Supabase Realtime** | Subscribe with the Supabase browser client | True push. **Requires a real RLS policy on `chat_messages`** — a deliberate, documented exception to 5.2. |

**Recommendation: ship A, upgrade to B only if latency actually bothers people.** Polling
one table every three seconds is nothing at department scale, and it keeps the architecture
uniform while you're still learning it.

If you do choose B, the exception is scoped to exactly one table:

```sql
create policy "read messages" on chat_messages
  for select to authenticated using (true);
```

Writes still go through your route handler. Only reads open up, and only for logged-in
users, and only on chat.

---

## 6. Roadmap

Build order = dependency order, then priority. Each phase is a **vertical slice**: table →
route → page → working in the browser. Don't start the next phase until the current one
works end to end.

### Phase 0 — Foundation (in progress)

- [x] Supabase + `pg` connected and verified
- [x] `profiles` table with RLS
- [ ] Fix the 5 lint errors (`next build` fails without this)
- [ ] Add `role`, `batch_year`, `avatar_url` to `profiles`
- [ ] `POST /api/profile` — upsert
- [ ] Wire signup: `signUp()` then `POST /api/profile`
- [ ] Wire login: `signInWithPassword()`; add logout to the navbar

**Done when:** you can sign up, see a row in both `auth.users` and `profiles`, log out, and
log back in.

### Phase 1 — Teachers & ratings (priority)

Tables: `courses`, `teachers`, `teacher_courses`, `teacher_ratings`

- [ ] Seed courses and teachers (SQL insert is fine — an admin UI can come later)
- [ ] `GET /api/teachers` — list with average scores
- [ ] `GET /api/teachers/[id]` — one teacher, their courses, their ratings
- [ ] `POST /api/teachers/[id]/ratings` — upsert on `(teacher_id, user_id)`
- [ ] Replace the dummy arrays in `teachers/page.tsx` and `teachers/[id]/page.tsx`

**Why this is first:** it's your priority feature, and it exercises the entire stack — auth,
reads, writes, a unique constraint, and an aggregate query — with **no file uploads and no
realtime**. Everything you learn here is reused by every later module.

**Done when:** you can rate a teacher, reload, and see your rating counted in the average —
and rating twice updates rather than duplicates.

### Phase 2 — Notes & past papers

Tables: `resources` · New concept: **Supabase Storage**

- [ ] Create a private bucket; upload via a route handler
- [ ] `POST /api/resources` — upload + insert with `status = 'pending'`
- [ ] `GET /api/resources?course_id=&kind=` — approved only for students
- [ ] Admin approval view (`role = 'admin'`)
- [ ] Build the `/notes` page — **it's linked in the navbar but doesn't exist (404)**

**Done when:** you upload a PDF, it appears pending, you approve it as admin, and another
account can download it.

### Phase 3 — Events

Tables: `events`, `event_rsvps` · New concept: **role-gated writes**

Simplest CRUD in the project. Good consolidation phase after Storage.

### Phase 4 — Requests board

Tables: `requests` · New concept: **optional anonymity on a second feature**

- [ ] Remove `CARPOOL` from the category list in `requests/page.tsx`
- [ ] Drop the `color` field from the data; derive it from `category` in the component
- [ ] `GET /api/requests?category=&status=` · `POST /api/requests`
- [ ] `PATCH /api/requests/[id]` — mark resolved, scoped `where id = $1 and user_id = $2`

Single-table CRUD with no joins beyond `profiles`. A good place to reuse the anonymity
query pattern from Module B while it's still fresh.

### Phase 5 — Carpooling

Tables: `carpool_posts`, `carpool_responses` · New concept: **two-sided interaction**

First feature where one student acts on another's row — the ownership checks matter here
more than anywhere else so far.

### Phase 6 — Campus map

Tables: `places`, `place_reviews` · Port Leaflet from GeoRate

Largely a copy of Phase 1's rating logic with a map attached. Replaces the dummy data in
`map/page.tsx`.

### Phase 7 — Global chat

Tables: `chat_channels`, `chat_messages` · **Read 5.5 first**

Left until last deliberately: it's the only feature with an architectural conflict, and by
now you'll have built seven modules and be in a position to judge the trade-off.

### Side quest — GPA calculator (any time)

**Zero tables, zero routes.** A pure client component. Good for an evening when you want a
finished feature without touching the database. Add persistence later, or never.

### Also outstanding

- [ ] `/notes` is linked in `Navbar.tsx` but doesn't exist — 404 in production
- [ ] No mobile navigation: the menu is `hidden md:flex` with no hamburger, so the site is
      **unusable on phones** — which is how most students will open it

---

## 7. Decisions

### Decided

**Ratings are anonymous by choice, per rating.** A student can attach their name or not;
`is_anonymous` defaults to `true`. `user_id` is always stored for the unique constraint,
editing and moderation. See the trap in Module B — the name and the id must both be withheld
by the *server*, not the UI.

**The requests board survives as a separate eighth feature.** It stays a general noticeboard
— `NOTES · PAST PAPER · PROJECT · TUTORING · LOST & FOUND` — with `CARPOOL` removed from the
category list. Carpooling becomes its own module because its fields and queries share nothing
with the board.

**Signup is open — no university email requirement.** The university does not issue student
email addresses, so there is no domain to verify against; the gate isn't available. The app
is also distributed inside the student community rather than publicly listed.

Two things already in the plan carry the load instead, and neither costs extra work:

- `unique (teacher_id, user_id)` means one account = one rating per teacher.
- **Turn "Confirm email" back ON before launch.** It gets switched off during development
  (Phase 0) so signup returns a session immediately — but left off in production, one person
  can create unlimited accounts with fake addresses. On, they need a real inbox per account.
  This is the single highest-value control available without university emails.

If rating manipulation ever does show up, `profiles.created_at` makes it visible — a cluster
of accounts created the same day all rating one teacher is an obvious pattern. Deal with it
then; don't build for it now.

### Still open

**1. Who seeds teachers and courses?**
SQL inserts by you, or an admin UI? Start with SQL — an admin CRUD screen is a whole feature
and can wait until the data stops changing.

**2. Chat: polling or Realtime?** See 5.5. Recommendation is polling first.

**3. Do resolved requests expire?**
`status` keeps the board clean, but nothing currently removes a three-month-old resolved
request. A `closed_at` timestamp plus a "hide resolved older than 30 days" filter is the
cheap fix if the board gets noisy.

---

## 8. Quick reference — the shape of every route

```ts
import { pool } from "@/lib/pg";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();

  const { rows } = await pool.query(
    `insert into <table> (user_id, ...) values ($1, ...) returning *`,
    [user.id, ...]
  );
  return Response.json(rows[0], { status: 201 });
}
```

Updates and deletes add the ownership check:

```ts
const { rowCount, rows } = await pool.query(
  `update <table> set ... where id = $1 and user_id = $2 returning *`,
  [id, user.id]
);
if (rowCount === 0) return Response.json({ error: "Not found" }, { status: 404 });
```

That second snippet is the single most important pattern in this codebase. Everything else
is variations on it.
