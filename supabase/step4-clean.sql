CREATE INDEX IF NOT EXISTS idx_missions_status ON missions(status);
CREATE INDEX IF NOT EXISTS idx_missions_responsible_agent ON missions(responsible_agent);
CREATE INDEX IF NOT EXISTS idx_agent_schedules_agent_id ON agent_schedules(agent_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_activities_created_at ON activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_calendar_events_start_time ON calendar_events(start_time);

INSERT INTO missions (name, description, responsible_agent, participating_agents, status, progress, priority) VALUES
    ('Launch Mission Control v1.0', 'Complete the dashboard with all agent features', 'rex', ARRAY['mosa', 'tricera'], 'active', 78, 'critical'),
    ('Build Bronto Finance Bot', 'Create automated finance briefing system', 'bronto', ARRAY['rex'], 'planning', 45, 'high')
ON CONFLICT DO NOTHING;

INSERT INTO projects (name, description, status, progress, color) VALUES
    ('Mission Control Dashboard', 'Personal AI agent dashboard', 'planning', 75, '#0066ff'),
    ('DinoSquad Automation', 'Agent task automation system', 'planning', 30, '#00ffff')
ON CONFLICT DO NOTHING;

INSERT INTO tasks (title, status, priority) VALUES
    ('Complete Database Setup', 'completed', 'high'),
    ('Fix Calendar Events', 'in_progress', 'high')
ON CONFLICT DO NOTHING;

INSERT INTO activities (action, type, agent) VALUES
    ('Completed database migration', 'deployment', 'mosa'),
    ('Updated dashboard components', 'update', 'tricera')
ON CONFLICT DO NOTHING;

INSERT INTO dashboard_stats (tasks_completed, in_progress, scheduled, documents) VALUES
    (3, 4, 7, 23)
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_goals (title, progress, category, quarter, year) VALUES
    ('Launch Mission Control v1.0', 78, 'Product', 2, 2026),
    ('Complete AI Agent Framework', 65, 'Development', 2, 2026)
ON CONFLICT DO NOTHING;

INSERT INTO user_skills (skill_name, level, max_level) VALUES
    ('Strategic Planning', 85, 100),
    ('System Architecture', 78, 100)
ON CONFLICT DO NOTHING;

INSERT INTO user_stats (focus_sessions, tasks_completed, missions_accomplished, learning_hours) VALUES
    (1, 3, 2, 1.5)
ON CONFLICT (id) DO NOTHING;
