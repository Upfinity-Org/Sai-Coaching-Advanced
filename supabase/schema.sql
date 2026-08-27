-- ============================================================
-- Sai Coaching Center — Admin Dashboard database schema
-- Run this once in: Supabase Dashboard -> SQL Editor -> New query
-- ============================================================

-- 1. FACULTY TABLE
create table if not exists faculty (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subject text not null,
  classes text not null default '',
  bio text default '',
  pin_color text default '#4A90D9',
  image_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- 2. GALLERY TABLE
create table if not exists gallery (
  id uuid primary key default gen_random_uuid(),
  caption text not null default 'Untitled',
  image_url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- 3. ROW LEVEL SECURITY
-- Everyone (including anonymous website visitors) can READ.
-- Only a signed-in user (your one admin account) can WRITE.
alter table faculty enable row level security;
alter table gallery enable row level security;

create policy "Public can read faculty" on faculty
  for select using (true);

create policy "Public can read gallery" on gallery
  for select using (true);

create policy "Authenticated can write faculty" on faculty
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated can write gallery" on gallery
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- 4. STORAGE BUCKET
-- Create the bucket itself in the Dashboard first (Storage -> New bucket):
--   name: site-images
--   public: ON  (so uploaded photos load on the public site)
-- Then run the policies below in the SQL Editor.

create policy "Public can view site-images"
  on storage.objects for select
  using (bucket_id = 'site-images');

create policy "Authenticated can upload site-images"
  on storage.objects for insert
  with check (bucket_id = 'site-images' and auth.role() = 'authenticated');

create policy "Authenticated can delete site-images"
  on storage.objects for delete
  using (bucket_id = 'site-images' and auth.role() = 'authenticated');

-- ============================================================
-- OPTIONAL: seed the tables with the same placeholder content
-- currently on the site, so it doesn't look empty on day one.
-- Skip this if you'd rather add real faculty/photos yourself
-- from the admin dashboard.
-- ============================================================

-- insert into faculty (name, subject, classes, bio, pin_color, sort_order) values
--   ('Mathematics Faculty', 'Mathematics', 'IX–XII', 'Expert in Algebra, Calculus & Coordinate Geometry', '#E05252', 0),
--   ('Physics Faculty', 'Physics', 'XI–XII', 'Specialist in Mechanics, Optics & Modern Physics', '#4A90D9', 1),
--   ('Chemistry Faculty', 'Chemistry', 'XI–XII', 'Expert in Organic, Inorganic & Physical Chemistry', '#48A86A', 2),
--   ('Science Faculty', 'Science', 'IX–X', 'Strong foundation building for CBSE 9th & 10th Science', '#D4A017', 3);
