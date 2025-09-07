# 🚀 Setup Instructions - MemoClarity MVP

## Database Setup (Supabase)

### 1. Create Supabase Project
1. Go to [app.supabase.io](https://app.supabase.io)
2. Create a new project
3. Wait for the project to be ready

### 2. Configure Environment Variables
1. Copy `.env.example` to `.env`:
   ```powershell
   cp .env.example .env
   ```
2. Update `.env` with your Supabase credentials:
   ```bash
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

### 3. Run Database Migration
1. Open Supabase SQL Editor in your project dashboard
2. Copy and paste the content from `supabase-migration.sql`
3. Click "Run" to execute the migration

### 4. Test the Setup
```powershell
npm run build
npm run dev
```

## Features Implemented

### ✅ Authentication
- [x] Email/password signup and signin
- [x] Automatic profile creation
- [x] Session management
- [ ] Google OAuth (pending client setup)

### ✅ Database Integration
- [x] User profiles with streak tracking
- [x] Check-ins with mood scoring
- [x] Cognitive test results storage
- [x] Row Level Security (RLS) policies

### ✅ Core Features
- [x] Combined cognitive test (4 phases)
- [x] Test results persistence to Supabase
- [x] Backward compatibility with localStorage
- [x] Streak counting system

## Next Steps

1. **Test authentication flow**: Create account → verify email → login
2. **Implement check-in UI**: Connect the check-in page to `checkinService`
3. **Dashboard integration**: Show real data from Supabase instead of placeholders
4. **Google OAuth**: Configure OAuth app and update `authService`

## Database Schema

```sql
profiles: user_id, username, full_name, streak_count, last_checkin_date
checkins: user_id, checked_at, mood_score, notes, streak_day
tests: user_id, phase_scores (jsonb), total_score, completed_at
```

## Services Available

- `authService`: signup, signin, signout, session management
- `checkinService`: create/fetch checkins, streak counting
- `testService`: save/fetch test results, statistics

## Security Notes

- ✅ Environment variables for sensitive data
- ✅ Row Level Security enabled
- ✅ User isolation (users can only access their own data)
- ✅ Proper TypeScript types for all database operations
