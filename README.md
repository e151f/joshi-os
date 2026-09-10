# ELIF OS v1.4

A mobile-first personal operating system. Local-first, with optional free Supabase cloud sync and an in-app automation engine.

## What is new
- Goal → Project → Task data flow
- Habit streaks and consistency
- Study + spaced repetition
- Glow-up routines, water and sleep
- Wallet, accounts, categories and limits
- Meal planner, recipes, ingredients and grocery list
- Journal, priorities and dashboard
- Optional Supabase authentication + cloud sync
- Automation rules: daily check-in, weekly review, overdue guard, study review
- Notification permission control
- Versioned service worker cache

## Free cloud sync setup
1. Create a free Supabase project.
2. Open SQL Editor and run `supabase-schema.sql`.
3. Copy the project URL and anon/publishable key from Supabase.
4. Open ELIF OS → Settings → Cloud Sync.
5. Save the URL/key, create an account or sign in.
6. Use **Sync now**. Repeat the same setup on your other devices.

The app never needs a Supabase service-role key. Only the public anon/publishable key is used in the browser, and RLS restricts rows to the authenticated user.

## Important automation limitation
Browser/PWA automation is reliable while ELIF OS is open (and on launch). iOS does not guarantee arbitrary JavaScript execution in a closed PWA, so this version does not pretend to provide background scheduling it cannot guarantee. Notifications can be enabled when supported by the device/browser.

## Hosting
Host the folder as a static site on GitHub Pages or Cloudflare Pages. No paid Apple developer account or App Store distribution is required for the PWA approach.
