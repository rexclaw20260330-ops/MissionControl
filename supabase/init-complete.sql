-- Mission Control 完整初始化 SQL
-- 執行順序：從上到下依序執行

-- ============================================
-- 1. 延伸模組
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 2. Core Tables
-- ============================================

-- missions 表 (Missionboard)
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

-- agent_schedules 表 (Office Calendar)
CREATE TABLE IF NOT EXISTS agent_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id TEXT NOT NULL,
  title TEXT NOT NULL,
  day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_hour NUMERIC,
  end_hour NUMERIC,
  type TEXT CHECK (type IN ('focus', 'meeting', 'planning', 'break')) DEFAULT 'focus',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- user_goals 表 (Yuan's Goals)
CREATE TABLE IF NOT EXISTS user_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  progress INTEGER DEFAULT 0,
  category TEXT,
  quarter INTEGER,
  year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- user_skills 表 (Yuan's Skills)
CREATE TABLE IF NOT EXISTS user_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  skill_name TEXT NOT NULL,
  level INTEGER DEFAULT 0,
  max_level INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- user_stats 表 (Yuan's Stats)
CREATE TABLE IF NOT EXISTS user_stats (
  id INTEGER PRIMARY KEY DEFAULT 1,
  focus_sessions INTEGER DEFAULT 0,
  tasks_completed INTEGER DEFAULT 0,
  missions_accomplished INTEGER DEFAULT 0,
  learning_hours NUMERIC DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. Dashboard Tables (新增)
-- ============================================

-- activities 表 (Dashboard Recent Activity)
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action TEXT NOT NULL,
  type TEXT CHECK (type IN ('deployment', 'update', 'feature', 'fix', 'other')) DEFAULT 'other',
  agent TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- dashboard_stats 表 (Dashboard Stats)
CREATE TABLE IF NOT EXISTS dashboard_stats (
  id INTEGER PRIMARY KEY DEFAULT 1,
  tasks_completed INTEGER DEFAULT 0,
  in_progress INTEGER DEFAULT 0,
  scheduled INTEGER DEFAULT 0,
  documents INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- projects 表 (Projects 頁面)
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('planning', 'in_progress', 'review', 'done')) DEFAULT 'planning',
  progress INTEGER CHECK (progress >= 0 AND progress <= 100) DEFAULT 0,
  color TEXT DEFAULT '#3b82f6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- tasks 表 (Dashboard QuickActions)
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'in_progress', 'completed')) DEFAULT 'pending',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  project_id UUID REFERENCES projects(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- calendar_events 表
CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  color TEXT DEFAULT '#0066ff',
  category TEXT DEFAULT '其他',
  user_id TEXT DEFAULT 'yuan',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 4. RLS Policies
-- ============================================

ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- Allow all (單人使用簡化版)
CREATE POLICY "Allow all" ON missions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON agent_schedules FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON user_goals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON user_skills FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON user_stats FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON activities FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON dashboard_stats FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON calendar_events FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- 5. Indexes
-- ============================================

CREATE INDEX IF NOT EXISTS idx_missions_status ON missions(status);
CREATE INDEX IF NOT EXISTS idx_missions_responsible_agent ON missions(responsible_agent);
CREATE INDEX IF NOT EXISTS idx_agent_schedules_agent_id ON agent_schedules(agent_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_activities_created_at ON activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_calendar_events_start_time ON calendar_events(start_time);

-- ============================================
-- 6. Sample Data
-- ============================================

-- Sample Missions
INSERT INTO missions (name, description, responsible_agent, participating_agents, status, progress, priority) VALUES
    ('Launch Mission Control v1.0', 'Complete the dashboard with all agent features', 'rex', ARRAY['mosa', 'tricera'], 'active', 78, 'critical'),
    ('Build Bronto Finance Bot', 'Create automated finance briefing system', 'bronto', ARRAY['rex'], 'planning', 45, 'high'),
    ('Agent Communication Protocol', 'Secure messaging system for agents', 'mosa', ARRAY['bronto'], 'active', 62, 'high'),
    ('Design System v2', 'Update Jurassic theme with new colors', 'tricera', ARRAY['mosa'], 'completed', 100, 'medium')
ON CONFLICT DO NOTHING;

-- Sample Projects
INSERT INTO projects (name, description, status, progress, color) VALUES
    ('Mission Control Dashboard', 'Personal AI agent dashboard', 'in_progress', 75, '#0066ff'),
    ('DinoSquad Automation', 'Agent task automation system', 'planning', 30, '#00ffff'),
    ('Finance Analysis Bot', 'Daily crypto analysis', 'in_progress', 60, '#ffb800')
ON CONFLICT DO NOTHING;

-- Sample Tasks
INSERT INTO tasks (title, status, priority) VALUES
    ('Complete Database Setup', 'completed', 'high'),
    ('Fix Calendar Events', 'in_progress', 'high'),
    ('Add Project Management', 'pending', 'medium')
ON CONFLICT DO NOTHING;

-- Sample Activities
INSERT INTO activities (action, type, agent) VALUES
    ('Completed database migration', 'deployment', 'mosa'),
    ('Updated dashboard components', 'update', 'tricera'),
    ('Created new project structure', 'feature', 'rex')
ON CONFLICT DO NOTHING;

-- Initialize Dashboard Stats
INSERT INTO dashboard_stats (tasks_completed, in_progress, scheduled, documents) VALUES
    (3, 4, 7, 23)
ON CONFLICT (id) DO NOTHING;

-- Sample User Goals
INSERT INTO user_goals (title, progress, category, quarter, year) VALUES
    ('Launch Mission Control v1.0', 78, 'Product', 2, 2026),
    ('Complete AI Agent Framework', 65, 'Development', 2, 2026),
    ('Establish Daily Workflow', 90, 'Productivity', 2, 2026)
ON CONFLICT DO NOTHING;

-- Sample User Skills
INSERT INTO user_skills (skill_name, level, max_level) VALUES
    ('Strategic Planning', 85, 100),
    ('System Architecture', 78, 100),
    ('Team Leadership', 92, 100),
    ('AI Automation', 70, 100)
ON CONFLICT DO NOTHING;

-- Initialize User Stats
INSERT INTO user_stats (focus_sessions, tasks_completed, missions_accomplished, learning_hours) VALUES
    (1, 3, 2, 1.5)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 7. Cron Job Events (Calendar)
-- ============================================

-- Pteroda Daily Crypto Analysis (Weekdays 09:00)
INSERT INTO calendar_events (title, description, start_time, end_time, color, category) VALUES
    ('Pteroda 每日加密貨幣分析', 'Pteroda 自動生成 3 個加密貨幣投資分析並發送到 Discord', 
     '2026-04-07T09:00:00+08:00', '2026-04-07T09:30:00+08:00', '#00F5FF', 'Agent Task'),
    ('Pteroda 每日加密貨幣分析', 'Pteroda 自動生成 3 個加密貨幣投資分析並發送到 Discord', 
     '2026-04-08T09:00:00+08:00', '2026-04-08T09:30:00+08:00', '#00F5FF', 'Agent Task'),
    ('Pteroda 每日加密貨幣分析', 'Pteroda 自動生成 3 個加密貨幣投資分析並發送到 Discord', 
     '2026-04-09T09:00:00+08:00', '2026-04-09T09:30:00+08:00', '#00F5FF', 'Agent Task'),
    ('Pteroda 每日加密貨幣分析', 'Pteroda 自動生成 3 個加密貨幣投資分析並發送到 Discord', 
     '2026-04-10T09:00:00+08:00', '2026-04-10T09:30:00+08:00', '#00F5FF', 'Agent Task'),
    ('Pteroda 每日加密貨幣分析', 'Pteroda 自動生成 3 個加密貨幣投資分析並發送到 Discord', 
     '2026-04-11T09:00:00+08:00', '2026-04-11T09:30:00+08:00', '#00F5FF', 'Agent Task')
ON CONFLICT DO NOTHING;

-- Session Cleanup (Daily 03:00)
INSERT INTO calendar_events (title, description, start_time, end_time, color, category) VALUES
    ('Session Cleanup', '自動清理已完成的 subagent sessions', 
     '2026-04-06T03:00:00+08:00', '2026-04-06T03:15:00+08:00', '#FFB800', 'System Maintenance'),
    ('Session Cleanup', '自動清理已完成的 subagent sessions', 
     '2026-04-07T03:00:00+08:00', '2026-04-07T03:15:00+08:00', '#FFB800', 'System Maintenance'),
    ('Session Cleanup', '自動清理已完成的 subagent sessions', 
     '2026-04-08T03:00:00+08:00', '2026-04-08T03:15:00+08:00', '#FFB800', 'System Maintenance')
ON CONFLICT DO NOTHING;

-- Sample Agent Schedules
INSERT INTO agent_schedules (agent_id, title, day_of_week, start_hour, end_hour, type) VALUES
    ('rex', 'Daily Standup', 0, 9, 9.5, 'meeting'),
    ('mosa', 'Deep Work', 1, 9, 12, 'focus'),
    ('bronto', 'Market Analysis', 2, 8, 10, 'focus'),
    ('tricera', 'Design Sprint', 3, 10, 16, 'focus'),
    ('pteroda', 'Research Block', 4, 9, 12, 'focus')
ON CONFLICT DO NOTHING;
