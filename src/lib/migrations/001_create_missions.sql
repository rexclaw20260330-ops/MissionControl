-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create missions table
CREATE TABLE IF NOT EXISTS missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  responsible_agent TEXT NOT NULL,
  participating_agents TEXT[] DEFAULT '{}',
  status TEXT CHECK (status IN ('planning', 'active', 'completed', 'on-hold')) DEFAULT 'planning',
  progress INTEGER CHECK (progress >= 0 AND progress <= 100) DEFAULT 0,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deadline TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Allow all" ON missions FOR ALL USING (true) WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_missions_status ON missions(status);
CREATE INDEX idx_missions_responsible_agent ON missions(responsible_agent);
