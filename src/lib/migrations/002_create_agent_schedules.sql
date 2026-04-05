-- Create agent_schedules table
CREATE TABLE IF NOT EXISTS agent_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id TEXT NOT NULL,
  title TEXT NOT NULL,
  day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6) NOT NULL,
  start_hour NUMERIC CHECK (start_hour >= 0 AND start_hour <= 24) NOT NULL,
  end_hour NUMERIC CHECK (end_hour >= 0 AND end_hour <= 24) NOT NULL,
  type TEXT CHECK (type IN ('focus', 'meeting', 'planning', 'break')) DEFAULT 'focus',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_time_range CHECK (start_hour < end_hour)
);

-- Enable RLS
ALTER TABLE agent_schedules ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Allow all" ON agent_schedules FOR ALL USING (true) WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_schedules_agent ON agent_schedules(agent_id);
CREATE INDEX idx_schedules_day ON agent_schedules(day_of_week);
