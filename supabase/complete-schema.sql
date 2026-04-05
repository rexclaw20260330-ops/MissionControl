-- ============================================
-- Mission Control 完整資料庫 Schema
-- 一次性執行，建立所有需要的表
-- ============================================

-- 1. 延伸模組
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Core Tables (現有)
-- ============================================

CREATE TABLE IF NOT EXISTS missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  responsible_agent TEXT NOT NULL,
  participating_agents TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'planning',
  progress INTEGER DEFAULT 0,
  priority TEXT DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deadline TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS agent_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id TEXT NOT NULL,
  title TEXT NOT NULL,
  day_of_week INTEGER,
  start_hour NUMERIC,
  end_hour NUMERIC,
  type TEXT DEFAULT 'focus',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

CREATE TABLE IF NOT EXISTS user_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  skill_name TEXT NOT NULL,
  level INTEGER DEFAULT 0,
  max_level INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_stats (
  id INTEGER PRIMARY KEY DEFAULT 1,
  focus_sessions INTEGER DEFAULT 0,
  tasks_completed INTEGER DEFAULT 0,
  missions_accomplished INTEGER DEFAULT 0,
  learning_hours NUMERIC DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Dashboard Tables (新增/現有)
-- ============================================

CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action TEXT NOT NULL,
  type TEXT DEFAULT 'other',
  agent TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS dashboard_stats (
  id INTEGER PRIMARY KEY DEFAULT 1,
  tasks_completed INTEGER DEFAULT 0,
  in_progress INTEGER DEFAULT 0,
  scheduled INTEGER DEFAULT 0,
  documents INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'planning',
  progress INTEGER DEFAULT 0,
  color TEXT DEFAULT '#3b82f6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  project_id UUID REFERENCES projects(id),
  assignee TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  color TEXT DEFAULT '#0066ff',
  category TEXT DEFAULT 'other',
  user_id TEXT DEFAULT 'yuan',
  is_recurring BOOLEAN DEFAULT false,
  recurrence_pattern TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Future Tables (預留，未來使用)
-- ============================================

-- 通知系統
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  message TEXT,
  type TEXT DEFAULT 'info',
  is_read BOOLEAN DEFAULT false,
  user_id TEXT DEFAULT 'yuan',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 設定/偏好
CREATE TABLE IF NOT EXISTS user_settings (
  user_id TEXT PRIMARY KEY DEFAULT 'yuan',
  theme TEXT DEFAULT 'dark',
  language TEXT DEFAULT 'zh-TW',
  timezone TEXT DEFAULT 'Asia/Taipei',
  notification_enabled BOOLEAN DEFAULT true,
  email_digest BOOLEAN DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 檔案/文件
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT,
  tags TEXT[],
  project_id UUID REFERENCES projects(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 時間追蹤
CREATE TABLE IF NOT EXISTS time_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID REFERENCES tasks(id),
  project_id UUID REFERENCES projects(id),
  duration_minutes INTEGER,
  description TEXT,
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- RLS Policies (單人使用簡化版)
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
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all" ON missions FOR ALL USING (true);
CREATE POLICY "Allow all" ON agent_schedules FOR ALL USING (true);
CREATE POLICY "Allow all" ON user_goals FOR ALL USING (true);
CREATE POLICY "Allow all" ON user_skills FOR ALL USING (true);
CREATE POLICY "Allow all" ON user_stats FOR ALL USING (true);
CREATE POLICY "Allow all" ON activities FOR ALL USING (true);
CREATE POLICY "Allow all" ON dashboard_stats FOR ALL USING (true);
CREATE POLICY "Allow all" ON projects FOR ALL USING (true);
CREATE POLICY "Allow all" ON tasks FOR ALL USING (true);
CREATE POLICY "Allow all" ON calendar_events FOR ALL USING (true);
CREATE POLICY "Allow all" ON notifications FOR ALL USING (true);
CREATE POLICY "Allow all" ON user_settings FOR ALL USING (true);
CREATE POLICY "Allow all" ON documents FOR ALL USING (true);
CREATE POLICY "Allow all" ON time_entries FOR ALL USING (true);

-- ============================================
-- Indexes
-- ============================================

CREATE INDEX IF NOT EXISTS idx_missions_status ON missions(status);
CREATE INDEX IF NOT EXISTS idx_missions_responsible_agent ON missions(responsible_agent);
CREATE INDEX IF NOT EXISTS idx_agent_schedules_agent_id ON agent_schedules(agent_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON tasks(assignee);
CREATE INDEX IF NOT EXISTS idx_activities_created_at ON activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_calendar_events_start_time ON calendar_events(start_time);
CREATE INDEX IF NOT EXISTS idx_calendar_events_user_id ON calendar_events(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_documents_project_id ON documents(project_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_task_id ON time_entries(task_id);

-- ============================================
-- Sample Data
-- ============================================

INSERT INTO missions (name, description, responsible_agent, participating_agents, status, progress, priority) VALUES
    ('Launch Mission Control v1.0', 'Complete the dashboard with all agent features', 'rex', ARRAY['mosa', 'tricera'], 'active', 78, 'critical'),
    ('Build Bronto Finance Bot', 'Create automated finance briefing system', 'bronto', ARRAY['rex'], 'planning', 45, 'high'),
    ('Agent Communication Protocol', 'Secure messaging system for agents', 'mosa', ARRAY['bronto'], 'active', 62, 'high'),
    ('Design System v2', 'Update Jurassic theme with new colors', 'tricera', ARRAY['mosa'], 'completed', 100, 'medium')
ON CONFLICT DO NOTHING;

INSERT INTO projects (name, description, status, progress, color) VALUES
    ('Mission Control Dashboard', 'Personal AI agent dashboard', 'planning', 75, '#0066ff'),
    ('DinoSquad Automation', 'Agent task automation system', 'planning', 30, '#00ffff'),
    ('Finance Analysis Bot', 'Daily crypto analysis', 'planning', 60, '#ffb800')
ON CONFLICT DO NOTHING;

INSERT INTO tasks (title, description, status, priority) VALUES
    ('Complete Database Setup', 'Set up all required tables', 'completed', 'high'),
    ('Fix Calendar Events', 'Debug and fix calendar display', 'in_progress', 'high'),
    ('Add Project Management', 'Create projects page with CRUD', 'pending', 'medium'),
    ('Design System Update', 'Unify color variables across app', 'pending', 'low')
ON CONFLICT DO NOTHING;

INSERT INTO activities (action, type, agent) VALUES
    ('Completed database migration', 'deployment', 'mosa'),
    ('Updated dashboard components', 'update', 'tricera'),
    ('Created new project structure', 'feature', 'rex'),
    ('Fixed Sidebar responsive issue', 'fix', 'mosa')
ON CONFLICT DO NOTHING;

INSERT INTO dashboard_stats (tasks_completed, in_progress, scheduled, documents) VALUES
    (3, 4, 7, 23)
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_goals (title, progress, category, quarter, year) VALUES
    ('Launch Mission Control v1.0', 78, 'Product', 2, 2026),
    ('Complete AI Agent Framework', 65, 'Development', 2, 2026),
    ('Establish Daily Workflow', 90, 'Productivity', 2, 2026),
    ('Expand Agent Capabilities', 45, 'Research', 2, 2026)
ON CONFLICT DO NOTHING;

INSERT INTO user_skills (skill_name, level, max_level) VALUES
    ('Strategic Planning', 85, 100),
    ('System Architecture', 78, 100),
    ('Team Leadership', 92, 100),
    ('AI Automation', 70, 100),
    ('Product Design', 65, 100)
ON CONFLICT DO NOTHING;

INSERT INTO user_stats (focus_sessions, tasks_completed, missions_accomplished, learning_hours) VALUES
    (1, 3, 2, 1.5)
ON CONFLICT (id) DO NOTHING;

INSERT INTO calendar_events (title, description, start_time, end_time, color, category, is_recurring) VALUES
    ('Pteroda Daily Crypto Analysis', 'Auto-generated crypto analysis', '2026-04-07T09:00:00+08:00', '2026-04-07T09:30:00+08:00', '#00F5FF', 'agent_task', true),
    ('Session Cleanup', 'Auto cleanup completed sessions', '2026-04-06T03:00:00+08:00', '2026-04-06T03:15:00+08:00', '#FFB800', 'maintenance', true)
ON CONFLICT DO NOTHING;

INSERT INTO agent_schedules (agent_id, title, day_of_week, start_hour, end_hour, type) VALUES
    ('rex', 'Daily Standup', 0, 9, 9.5, 'meeting'),
    ('mosa', 'Deep Work', 1, 9, 12, 'focus'),
    ('bronto', 'Market Analysis', 2, 8, 10, 'focus'),
    ('tricera', 'Design Sprint', 3, 10, 16, 'focus'),
    ('pteroda', 'Research Block', 4, 9, 12, 'focus')
ON CONFLICT DO NOTHING;

INSERT INTO user_settings (user_id, theme, language, timezone) VALUES
    ('yuan', 'dark', 'zh-TW', 'Asia/Taipei')
ON CONFLICT (user_id) DO NOTHING;

-- ============================================
-- Done! All tables created with sample data.
-- ============================================
