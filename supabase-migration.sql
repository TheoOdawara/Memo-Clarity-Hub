-- SQL Migration for MemoClarity MVP
-- Execute this in your Supabase SQL Editor

-- 1. Update profiles table to match our needs
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS streak_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_checkin_date DATE;

-- 2. Create checkins table
CREATE TABLE IF NOT EXISTS checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
  checked_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  streak_day INTEGER DEFAULT 1,
  mood_score INTEGER CHECK (mood_score >= 1 AND mood_score <= 5),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create tests table for cognitive test results
CREATE TABLE IF NOT EXISTS tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
  phase_scores JSONB NOT NULL, -- Array of 4 numbers [sequence, association, reaction, memory]
  total_score INTEGER NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_checkins_user_id ON checkins(user_id);
CREATE INDEX IF NOT EXISTS idx_checkins_checked_at ON checkins(checked_at);
CREATE INDEX IF NOT EXISTS idx_tests_user_id ON tests(user_id);
CREATE INDEX IF NOT EXISTS idx_tests_completed_at ON tests(completed_at);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 7. Create RLS policies for checkins
CREATE POLICY "Users can view own checkins" ON checkins
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own checkins" ON checkins
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own checkins" ON checkins
  FOR UPDATE USING (auth.uid() = user_id);

-- 8. Create RLS policies for tests
CREATE POLICY "Users can view own tests" ON tests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tests" ON tests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 9. Create function to update streak count
CREATE OR REPLACE FUNCTION update_user_streak()
RETURNS TRIGGER AS $$
BEGIN
  -- Update streak count in profiles
  UPDATE profiles 
  SET 
    streak_count = CASE 
      WHEN last_checkin_date = CURRENT_DATE - INTERVAL '1 day' THEN streak_count + 1
      WHEN last_checkin_date = CURRENT_DATE THEN streak_count
      ELSE 1
    END,
    last_checkin_date = CURRENT_DATE
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 10. Create trigger for automatic streak update
CREATE TRIGGER update_streak_trigger
  AFTER INSERT ON checkins
  FOR EACH ROW
  EXECUTE FUNCTION update_user_streak();
