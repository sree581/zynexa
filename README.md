# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

## Supabase conference submission platform

This project now supports a paper submission workflow backed by Supabase.

### What’s included

- Paper submission form with PDF upload to Supabase Storage bucket `papers`
- `submissions` table with review status, notes, and PDF URL
- Admin/reviewer dashboard at `/admin`
- Supabase Auth login for reviewer/admin access
- Row level security so anonymous users can submit and reviewers/admins can read/update

### Environment variables

Create a local `.env` file in the project root with:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Replace both placeholder values with your actual Supabase project URL and anon key from Project Settings → API.

Also create a Supabase Storage bucket named `papers`. This bucket should be accessible for uploads and for reviewer PDF access.

After updating `.env`, restart the dev server so Vite picks up the real environment variables.

Use `.env.example` as a reference for deployment.

### Supabase SQL

Run this SQL in the Supabase SQL editor:

```sql
create type submission_status as enum ('pending', 'under_review', 'accepted', 'rejected');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'author',
  full_name text,
  created_at timestamp with time zone default now()
);

create table submissions (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  abstract text not null,
  author_names text not null,
  author_email text not null,
  affiliation text not null,
  track text not null,
  pdf_url text not null,
  status submission_status not null default 'pending',
  submitted_at timestamp with time zone not null default now(),
  reviewer_notes text
);
```

Then enable RLS and add policies:

```sql
alter table submissions enable row level security;

create policy "Anonymous insert submissions" on submissions
  for insert
  with check (true);

create policy "Reviewer/Admin select submissions" on submissions
  for select
  using (
    auth.role() = 'authenticated' and exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.role in ('reviewer', 'admin')
    )
  );

create policy "Reviewer/Admin update submissions" on submissions
  for update
  using (
    auth.role() = 'authenticated' and exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.role in ('reviewer', 'admin')
    )
  );
```

### Create the first reviewer/admin user

1. In Supabase, go to Authentication → Users.
2. Create a user with email and password.
3. Run this SQL with the new user's UUID:

```sql
insert into profiles (id, role, full_name)
values ('<user-uuid>', 'admin', 'First Admin');
```

Replace `<user-uuid>` with the Supabase Auth user ID from the created user.

### Local development

Install dependencies and run the project locally:

```bash
npm install
npm run dev
```

### Deployment

Set these environment variables in Vercel/Netlify or another host:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Do not commit your local `.env` file.
