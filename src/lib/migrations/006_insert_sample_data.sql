-- Insert sample missions data
INSERT INTO missions (name, description, responsible_agent, participating_agents, status, progress, priority, deadline) VALUES
    ('Launch Mission Control v1.0', 'Complete the dashboard with all agent features and real-time data sync', 'rex', ARRAY['mosa', 'tricera'], 'active', 78, 'critical', NOW() + INTERVAL '30 days'),
    ('Build Bronto Finance Bot', 'Create automated finance briefing system for daily market updates', 'bronto', ARRAY['rex'], 'planning', 45, 'high', NOW() + INTERVAL '60 days'),
    ('Agent Communication Protocol', 'Secure messaging system for inter-agent coordination', 'mosa', ARRAY['bronto'], 'active', 62, 'high', NULL),
    ('Design System v2', 'Update Jurassic theme with new color palette and animations', 'tricera', ARRAY['mosa'], 'completed', 100, 'medium', NOW() - INTERVAL '7 days'),
    ('Knowledge Base Research', 'Research and document best practices for AI agent workflows', 'pteroda', ARRAY['rex', 'mosa'], 'on-hold', 30, 'medium', NULL)
ON CONFLICT DO NOTHING;

-- Insert sample agent schedules
INSERT INTO agent_schedules (agent_id, title, day_of_week, start_hour, end_hour, type) VALUES
    ('rex', 'Daily Standup', 0, 9, 9.5, 'meeting'),
    ('rex', 'Strategy Planning', 0, 10, 12, 'focus'),
    ('mosa', 'Deep Work', 1, 9, 12, 'focus'),
    ('mosa', 'Code Review', 1, 14, 15, 'meeting'),
    ('bronto', 'Market Analysis', 2, 8, 10, 'focus'),
    ('bronto', 'Finance Briefing', 2, 9, 9.5, 'meeting'),
    ('tricera', 'Design Sprint', 3, 10, 16, 'focus'),
    ('pteroda', 'Research Block', 4, 9, 12, 'focus')
ON CONFLICT DO NOTHING;

-- Insert sample user goals
INSERT INTO user_goals (title, progress, category, quarter, year) VALUES
    ('Launch Mission Control v1.0', 78, 'Product', 2, 2026),
    ('Complete AI Agent Framework', 65, 'Development', 2, 2026),
    ('Establish Daily Workflow', 90, 'Productivity', 2, 2026),
    ('Expand Agent Capabilities', 45, 'Research', 2, 2026)
ON CONFLICT DO NOTHING;

-- Insert sample user skills
INSERT INTO user_skills (skill_name, level, max_level) VALUES
    ('Strategic Planning', 85, 100),
    ('System Architecture', 78, 100),
    ('Team Leadership', 92, 100),
    ('AI Automation', 70, 100),
    ('Product Design', 65, 100)
ON CONFLICT DO NOTHING;
