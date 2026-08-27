/* =========================================================
   ADMIN PATH — the ONLY way to reach the login screen.
   ---------------------------------------------------------
   It is not linked from the navbar, footer, sitemap, or any
   page on the public site, and it is deliberately NOT listed
   in robots.txt (a disallow rule would advertise the path to
   anyone who reads that file).

   Change this string to your own private value before you
   deploy, and don't share it publicly. It is a second layer
   on top of the real protection, which is the Supabase email
   + password login itself — treat this path as an obscurity
   measure, not the actual security boundary.
   ========================================================= */
export const ADMIN_PATH = "/mgmt-portal-9f2k7";
