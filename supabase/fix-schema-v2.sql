-- 修復 user_stats schema 不一致問題
-- 執行此 SQL 讓 Yuan 頁面正常運作

-- ============================================
-- 1. 修復 user_stats 表
-- ============================================

-- 刪除舊表（如果有）
DROP TABLE IF EXISTS user_stats CASCADE;

-- 建立正確 schema 的 user_stats 表
CREATE TABLE user_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT DEFAULT 'yuan',
  stat_key TEXT NOT NULL,
  stat_value INTEGER DEFAULT 0,
  stat_change INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 插入預設統計資料
INSERT INTO user_stats (user_id, stat_key, stat_value, stat_change) VALUES
  ('yuan', 'focus_sessions', 1, 0),
  ('yuan', 'tasks_completed', 3, 0),
  ('yuan', 'missions_accomplished', 2, 0),
  ('yuan', 'learning_hours', 150, 5);

-- 設定 RLS
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON user_stats FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- 2. 確認 user_goals 表（如不存在則建立）
-- ============================================

-- 先刪除舊表（如果結構不對）
DROP TABLE IF EXISTS user_goals CASCADE;

-- 建立正確的 user_goals 表
CREATE TABLE user_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT DEFAULT 'yuan',
  title TEXT NOT NULL,
  progress INTEGER DEFAULT 0,
  category TEXT,
  quarter INTEGER,
  year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 插入預設目標
INSERT INTO user_goals (user_id, title, progress, category) VALUES
  ('yuan', 'Launch Mission Control v1.0', 78, 'Product'),
  ('yuan', 'Complete AI Agent Framework', 65, 'Development'),
  ('yuan', 'Establish Daily Workflow', 90, 'Productivity');

ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON user_goals FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- 3. 確認 user_skills 表（如不存在則建立）
-- ============================================

-- 先刪除舊表（如果結構不對）
DROP TABLE IF EXISTS user_skills CASCADE;

-- 建立正確的 user_skills 表
CREATE TABLE user_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT DEFAULT 'yuan',
  skill_name TEXT NOT NULL,
  level INTEGER DEFAULT 0,
  max_level INTEGER DEFAULT 100,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 插入預設技能
INSERT INTO user_skills (user_id, skill_name, level, max_level, category) VALUES
  ('yuan', 'Strategic Planning', 85, 100, 'Leadership'),
  ('yuan', 'System Architecture', 78, 100, 'Technical'),
  ('yuan', 'Team Leadership', 92, 100, 'Leadership'),
  ('yuan', 'AI Automation', 70, 100, 'Technical');

ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON user_skills FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- 4. 建立索引
-- ============================================

CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON user_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_user_stats_stat_key ON user_stats(stat_key);
CREATE INDEX IF NOT EXISTS idx_user_goals_user_id ON user_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_user_id ON user_skills(user_id);

-- 完成！Yuan 頁面現在應該可以正常運作了。
