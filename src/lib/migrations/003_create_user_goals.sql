-- Create user_goals table
CREATE TABLE IF NOT EXISTS user_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL DEFAULT 'yuan',
  title TEXT NOT NULL,
  progress INTEGER CHECK (progress >= 0 AND progress <= 100) DEFAULT 0,
  category TEXT NOT NULL,
  quarter INTEGER CHECK (quarter >= 1 AND quarter <= 4) DEFAULT 1,
  year INTEGER DEFAULT EXTRACT(YEAR FROM NOW()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Allow all" ON user_goals FOR ALL USING (true) WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_goals_user ON user_goals(user_id);
CREATE INDEX idx_goals_quarter ON user_goals(quarter, year);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_user_goals_updated_at ON user_goals;
CREATE TRIGGER update_user_goals_updated_at
  BEFORE UPDATE ON user_goals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
