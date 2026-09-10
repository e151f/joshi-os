# ELIF OS — iPad-first cloud setup

## One-time setup (requires internet browser; can be done from any device)

1. Open your Supabase project.
2. Go to **SQL Editor**.
3. Create a new query.
4. Paste the contents of `supabase-schema.sql`.
5. Run it.
6. In **Authentication → Providers → Email**, leave Email enabled. If email confirmation is enabled, complete the confirmation email after creating the ELIF OS account.

The app is already configured with the project's **publishable** key. Never put a `service_role` or secret key into the app.

## After the app is hosted

On iPad:

1. Open the ELIF OS web address in Safari.
2. Sign in / create your ELIF OS account from **Automation → Cloud Sync**.
3. Test **Sync Now**.
4. Safari Share → **Add to Home Screen**.
5. Open ELIF OS from the new home-screen icon.

The same account can then be used on iPhone. Local changes are kept locally and pushed to the cloud when a signed-in connection is available.

## Important

A static ZIP opened with `file://` is useful for local testing but is not the final iPad PWA. The final app must be served over HTTPS for reliable service-worker/PWA behavior.
