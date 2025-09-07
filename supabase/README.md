# Supabase integration (MemoClarity MVP)

This folder contains the canonical Supabase artifacts for the MVP: migrations and a starter Edge Function template.

Quick checklist to get the backend live

1. Apply migrations
 - Open your Supabase Project → SQL Editor → New query
 - Open `migrations/0001_create_attempts_and_actions.sql` and paste the contents into the editor
 - Run the query. Confirm tables `test_attempts` and `test_actions` were created.

2. Verify RLS policies
 - In the Table Editor, open `public.test_attempts` → Policies. Ensure RLS is enabled and the policies from the migration exist.
 - If you're testing quickly, temporarily create an "open" policy for your admin account, then lock down afterwards.

3. Deploy the Edge Function (validate-attempt)
 - Use the Supabase Dashboard Functions UI or the Supabase CLI.
 - The template is in `functions/validate-attempt/index.ts` (minimal handler). Expand this to run deterministic replay/validation.

4. Test the function
 - Example curl (replace placeholders):

  curl -X POST "https://<project>.functions.supabase.co/validate-attempt" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer <SERVICE_ROLE_OR_ANON>" \
    -d '{"attemptId":"<id>","user_id":"<user id>","seed":"abc","actions":[] }'

Notes
- Use the service_role key for trusted server-side operations (keep it secret).
- For production, implement deterministic replay on the server and return a server_score before persisting.
- If you lack time, apply the schema and let the frontend insert attempts as 'pending' for later validation.
