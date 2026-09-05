# Supabase setup

Apply the migration in `supabase/migrations/001_initial_schema.sql` to the connected Supabase project.

Required environment variables:

- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY

For the frontend, expose only the browser-safe values:

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

RLS is enabled for all user-owned tables. Each table enforces ownership by user_id or a direct auth user relationship.
