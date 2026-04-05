-- Create user_stats table for real-time dashboard stats
CREATE TABLE IF NOT EXISTS public.user_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    stat_key VARCHAR(50) NOT NULL UNIQUE,
    stat_value INTEGER NOT NULL DEFAULT 0,
    stat_change INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Enable RLS
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own stats"
    ON public.user_stats FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own stats"
    ON public.user_stats FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats"
    ON public.user_stats FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON public.user_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_user_stats_key ON public.user_stats(stat_key);

-- Insert default stats for Yuan
INSERT INTO public.user_stats (stat_key, stat_value, stat_change) VALUES
    ('tasks_completed', 247, 12),
    ('projects_active', 5, 1),
    ('agent_hours', 1200, 89),
    ('win_rate', 94, 3)
ON CONFLICT (stat_key) DO NOTHING;
