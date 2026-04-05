-- Create user_skills table
CREATE TABLE IF NOT EXISTS user_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL DEFAULT 'yuan',
  skill_name TEXT NOT NULL,
  level INTEGER CHECK (level >= 0) DEFAULT 0,
  max_level INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, skill_name)
);

-- Enable RLS
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Allow all" ON user_skills FOR ALL USING (true) WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_skills_user ON user_skills(user_id);

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_user_skills_updated_at ON user_skills;
CREATE TRIGGER update_user_skills_updated_at
  BEFORE UPDATE ON user_skills
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
