export type MissionStatus = 'planning' | 'active' | 'completed' | 'on-hold';
export type MissionPriority = 'low' | 'medium' | 'high' | 'critical';
export type ScheduleType = 'focus' | 'meeting' | 'planning' | 'break';

export interface Mission {
  id: string;
  name: string;
  description: string | null;
  responsible_agent: string;
  participating_agents: string[];
  status: MissionStatus;
  progress: number;
  priority: MissionPriority;
  created_at: string;
  deadline: string | null;
}

export interface MissionInsert {
  name: string;
  description?: string;
  responsible_agent: string;
  participating_agents?: string[];
  status?: MissionStatus;
  progress?: number;
  priority?: MissionPriority;
  deadline?: string;
}

export interface MissionUpdate {
  name?: string;
  description?: string;
  responsible_agent?: string;
  participating_agents?: string[];
  status?: MissionStatus;
  progress?: number;
  priority?: MissionPriority;
  deadline?: string;
}

export interface AgentSchedule {
  id: string;
  agent_id: string;
  title: string;
  day_of_week: number;
  start_hour: number;
  end_hour: number;
  type: ScheduleType;
  created_at: string;
}

export interface AgentScheduleInsert {
  agent_id: string;
  title: string;
  day_of_week: number;
  start_hour: number;
  end_hour: number;
  type?: ScheduleType;
}

export interface UserGoal {
  id: string;
  user_id: string;
  title: string;
  progress: number;
  category: string;
  quarter: number;
  year: number;
  created_at: string;
  updated_at: string;
}

export interface UserGoalInsert {
  user_id?: string;
  title: string;
  progress?: number;
  category: string;
  quarter?: number;
  year?: number;
}

export interface UserSkill {
  id: string;
  user_id: string;
  skill_name: string;
  level: number;
  max_level: number;
  created_at: string;
  updated_at: string;
}

export interface UserSkillInsert {
  user_id?: string;
  skill_name: string;
  level?: number;
  max_level?: number;
}

export interface UserStat {
  id: string;
  user_id: string;
  stat_key: string;
  stat_value: number;
  stat_change: number;
  updated_at: string;
  created_at: string;
}

// Learning Streak
export interface LearningStreak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_learning_date: string | null;
  total_learning_days: number;
  created_at: string;
  updated_at: string;
}

export interface LearningStreakInsert {
  user_id?: string;
  current_streak?: number;
  longest_streak?: number;
  last_learning_date?: string | null;
  total_learning_days?: number;
}

// Learning Log
export interface LearningLog {
  id: string;
  user_id: string;
  date: string;
  total_minutes: number;
  items_completed: number;
  daily_goal_percent: number;
  created_at: string;
  updated_at: string;
}

export interface LearningLogInsert {
  user_id?: string;
  date?: string;
  total_minutes?: number;
  items_completed?: number;
  daily_goal_percent?: number;
}

// Task
export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: 'pending' | 'in_progress' | 'completed' | 'archived';
  category: string;
  priority: 'low' | 'medium' | 'high';
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Database {
  missions: Mission;
  agent_schedules: AgentSchedule;
  user_goals: UserGoal;
  user_skills: UserSkill;
  user_stats: UserStat;
  learning_streaks: LearningStreak;
  learning_logs: LearningLog;
  tasks: Task;
}
