# Admin Dashboard Setup

The site now has a hidden admin area where you can add or remove faculty
profiles and gallery photos yourself, without touching code or redeploying.
It's backed by [Supabase](https://supabase.com) (free tier) — a hosted
database + login system + file storage.

This is a one-time setup, about 10 minutes.

## 1. Create a free Supabase project

1. Go to [supabase.com](https://supabase.com) → sign up (free) → **New project**.
2. Pick any name/region, set a database password (save it somewhere — you
   won't need it day-to-day, but keep it safe).
3. Wait ~2 minutes for the project to finish provisioning.

## 2. Run the database schema

1. In your project, open **SQL Editor** → **New query**.
2. Copy the entire contents of `supabase/schema.sql` (in this project) and
   paste it in, then click **Run**.
   - This creates the `faculty` and `gallery` tables and the security rules
     that let visitors *read* but only you *write*.
   - The storage bucket policies are in the same file, but you must create
     the bucket itself first — see step 3.

## 3. Create the image storage bucket

1. Open **Storage** in the left sidebar → **New bucket**.
2. Name it exactly: `site-images`
3. Toggle **Public bucket** → ON (so uploaded photos display on the live site).
4. Create it, then go back to **SQL Editor** and run the storage policy
   statements at the bottom of `supabase/schema.sql` (if you didn't already
   run the whole file after creating the bucket).

## 4. Create your admin login

There is no public sign-up form — by design, the only way to get an account
is for you to create it yourself in the dashboard:

1. Open **Authentication** → **Users** → **Add user** → **Create new user**.
2. Enter the email and password you want to log in with.
3. Leave "Auto Confirm User" checked (so you don't need to click an email
   confirmation link) and save.

This is the one account that can add/remove content. Keep the password
somewhere safe (a password manager, not a text file on the desktop).

## 5. Connect the site to your project

1. In Supabase, go to **Project Settings** → **API**.
2. Copy the **Project URL** and the **anon public** key (NOT the
   `service_role` key — never use that one here or anywhere in this project).
3. In the project folder, copy `.env.example` to a new file named `.env`:
   ```
   cp .env.example .env
   ```
4. Paste your two values in:
   ```
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```
5. Restart the dev server (`npm run dev`) or rebuild (`npm run build`) so
   the new values are picked up.

## 6. Log in

Go to:
```
http://localhost:5173/mgmt-portal-9f2k7   (while developing)
https://your-live-site.com/mgmt-portal-9f2k7   (once deployed)
```
using the email/password you created in step 4. From there you can add or
remove faculty and gallery photos — changes appear on the live site
immediately, no redeploy needed.

## Deploying to production

Whatever host you use (Vercel, Netlify, etc.), add the same two
`VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` values as environment
variables in that host's dashboard — the same way you would any other
secret. Don't commit your `.env` file (it's already git-ignored).

## Security notes — please read

- **The admin URL itself is not a secret boundary — the login is.** The path
  (`/mgmt-portal-9f2k7`) is never linked anywhere on the site, isn't in the
  sitemap, and is deliberately left out of `robots.txt` (listing it there
  would advertise it to anyone who reads that file). But someone could still
  guess or stumble on it, so the real protection is the email+password login
  behind it. Change the path in `src/admin/config.ts` to your own private
  string before you deploy, and don't post it publicly.
- **The anon key in `.env` is safe to expose** — it's meant to be visible in
  a browser bundle. It only grants what the Row Level Security policies in
  `schema.sql` allow (public read, authenticated-only write). Never use the
  `service_role` key in this project; that one bypasses all security rules.
- **Only create one admin user**, and use a strong, unique password. Anyone
  with those credentials has full add/delete access to faculty and gallery
  content.
- If you ever need to reset the admin password, do it from **Authentication
  → Users** in the Supabase dashboard.

## What happens if Supabase isn't configured

If `.env` is missing or empty, the public site automatically falls back to
the placeholder faculty/gallery content that shipped with the template, and
the admin path shows a "not configured yet" message instead of crashing.
