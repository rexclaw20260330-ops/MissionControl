import { supabase } from './supabase';
import { Mission, MissionInsert, MissionUpdate, MissionStatus, AgentSchedule, AgentScheduleInsert, UserGoal, UserGoalInsert, UserSkill, UserSkillInsert, LearningStreak, LearningStreakInsert, LearningLog, LearningLogInsert, Task } from './supabase-types';

// Re-export types for components
export type { Mission, MissionInsert, MissionUpdate, MissionStatus, AgentSchedule, AgentScheduleInsert, UserGoal, UserGoalInsert, UserSkill, UserSkillInsert };

// Missions
export async function getMissions() {
  const { data, error } = await supabase
    .from('missions')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Mission[];
}

export async function getMissionsByAgent(agentId: string) {
  const { data, error } = await supabase
    .from('missions')
    .select('*')
    .or(`responsible_agent.eq.${agentId},participating_agents.cs.{${agentId}}`)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Mission[];
}

export async function getMissionsByStatus(status: string) {
  const { data, error } = await supabase
    .from('missions')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Mission[];
}

export async function createMission(mission: MissionInsert) {
  const { data, error } = await supabase
    .from('missions')
    .insert(mission)
    .select()
    .single();
  
  if (error) throw error;
  return data as Mission;
}

export async function updateMission(id: string, updates: MissionUpdate) {
  const { data, error } = await supabase
    .from('missions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Mission;
}

export async function updateMissionProgress(id: string, progress: number) {
  return updateMission(id, { progress });
}

export async function updateMissionStatus(id: string, status: MissionStatus) {
  return updateMission(id, { status });
}

export async function deleteMission(id: string) {
  const { error } = await supabase
    .from('missions')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// Agent Schedules
export async function getAgentSchedules() {
  const { data, error } = await supabase
    .from('agent_schedules')
    .select('*')
    .order('day_of_week')
    .order('start_hour');
  
  if (error) throw error;
  return data as AgentSchedule[];
}

export async function getSchedulesByDay(dayOfWeek: number) {
  const { data, error } = await supabase
    .from('agent_schedules')
    .select('*')
    .eq('day_of_week', dayOfWeek)
    .order('start_hour');
  
  if (error) throw error;
  return data as AgentSchedule[];
}

export async function createSchedule(schedule: AgentScheduleInsert) {
  const { data, error } = await supabase
    .from('agent_schedules')
    .insert(schedule)
    .select()
    .single();
  
  if (error) throw error;
  return data as AgentSchedule;
}

export async function deleteSchedule(id: string) {
  const { error } = await supabase
    .from('agent_schedules')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

export async function deleteSchedulesByAgent(agentId: string) {
  const { error } = await supabase
    .from('agent_schedules')
    .delete()
    .eq('agent_id', agentId);
  
  if (error) throw error;
}

// User Goals
export async function getUserGoals(userId: string = 'yuan') {
  const { data, error } = await supabase
    .from('user_goals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as UserGoal[];
}

export async function getGoalsByQuarter(quarter: number, year: number, userId: string = 'yuan') {
  const { data, error } = await supabase
    .from('user_goals')
    .select('*')
    .eq('user_id', userId)
    .eq('quarter', quarter)
    .eq('year', year)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as UserGoal[];
}

export async function createGoal(goal: UserGoalInsert) {
  const { data, error } = await supabase
    .from('user_goals')
    .insert(goal)
    .select()
    .single();
  
  if (error) throw error;
  return data as UserGoal;
}

export async function updateGoalProgress(id: string, progress: number) {
  const { data, error } = await supabase
    .from('user_goals')
    .update({ progress })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as UserGoal;
}

export async function deleteGoal(id: string) {
  const { error } = await supabase
    .from('user_goals')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// User Skills
export async function getUserSkills(userId: string = 'yuan') {
  const { data, error } = await supabase
    .from('user_skills')
    .select('*')
    .eq('user_id', userId)
    .order('skill_name');
  
  if (error) throw error;
  return data as UserSkill[];
}

export async function createSkill(skill: UserSkillInsert) {
  const { data, error } = await supabase
    .from('user_skills')
    .insert(skill)
    .select()
    .single();
  
  if (error) throw error;
  return data as UserSkill;
}

export async function upsertSkill(skill: UserSkillInsert) {
  const { data, error } = await supabase
    .from('user_skills')
    .upsert(skill, { onConflict: 'user_id,skill_name' })
    .select()
    .single();
  
  if (error) throw error;
  return data as UserSkill;
}

export async function updateSkillLevel(id: string, level: number) {
  const { data, error } = await supabase
    .from('user_skills')
    .update({ level })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as UserSkill;
}

export async function addSkillExperience(skillName: string, exp: number, userId: string = 'yuan') {
  const { data: existing } = await supabase
    .from('user_skills')
    .select('*')
    .eq('user_id', userId)
    .eq('skill_name', skillName)
    .single();
  
  if (existing) {
    const newLevel = Math.min(existing.level + exp, existing.max_level);
    return updateSkillLevel(existing.id, newLevel);
  } else {
    return createSkill({ user_id: userId, skill_name: skillName, level: exp });
  }
}

export async function deleteSkill(id: string) {
  const { error } = await supabase
    .from('user_skills')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// User Stats
export interface UserStat {
  id: string;
  user_id: string;
  stat_key: string;
  stat_value: number;
  stat_change: number;
  updated_at: string;
  created_at: string;
}

export async function getUserStats() {
  const { data, error } = await supabase
    .from('user_stats')
    .select('*')
    .order('stat_key', { ascending: true });
  
  if (error) throw error;
  return data as UserStat[];
}

export async function updateStat(key: string, value: number, change: number = 0) {
  const { data, error } = await supabase
    .from('user_stats')
    .upsert({ stat_key: key, stat_value: value, stat_change: change }, { onConflict: 'stat_key' })
    .select()
    .single();
  
  if (error) throw error;
  return data as UserStat;
}

export async function incrementStat(key: string, amount: number = 1) {
  const { data: existing } = await supabase
    .from('user_stats')
    .select('*')
    .eq('stat_key', key)
    .single();
  
  if (existing) {
    const newValue = existing.stat_value + amount;
    const newChange = existing.stat_change + amount;
    return updateStat(key, newValue, newChange);
  }
  
  return updateStat(key, amount, amount);
}

// Learning Streaks
export async function getLearningStreak(userId: string = 'yuan'): Promise<LearningStreak | null> {
  const { data, error } = await supabase
    .from('learning_streaks')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data as LearningStreak | null;
}

export async function updateLearningStreak(userId: string = 'yuan', data: Partial<LearningStreakInsert>): Promise<LearningStreak> {
  const { data: existing } = await supabase
    .from('learning_streaks')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (existing) {
    const { data: updated, error } = await supabase
      .from('learning_streaks')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', existing.id)
      .select()
      .single();
    if (error) throw error;
    return updated as LearningStreak;
  } else {
    const { data: created, error } = await supabase
      .from('learning_streaks')
      .insert({ user_id: userId, ...data })
      .select()
      .single();
    if (error) throw error;
    return created as LearningStreak;
  }
}

// Learning Logs
export async function getLearningLogs(userId: string = 'yuan', startDate?: string, endDate?: string): Promise<LearningLog[]> {
  let query = supabase
    .from('learning_logs')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });
  
  if (startDate) {
    query = query.gte('date', startDate);
  }
  if (endDate) {
    query = query.lte('date', endDate);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data as LearningLog[];
}

export async function createLearningLog(log: LearningLogInsert): Promise<LearningLog> {
  const { data, error } = await supabase
    .from('learning_logs')
    .insert(log)
    .select()
    .single();
  
  if (error) throw error;
  return data as LearningLog;
}

export async function getWeeklyStudyHours(userId: string = 'yuan'): Promise<number> {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  
  const { data, error } = await supabase
    .from('learning_logs')
    .select('total_minutes')
    .eq('user_id', userId)
    .gte('date', startOfWeek.toISOString().split('T')[0]);
  
  if (error) throw error;
  
  const totalMinutes = (data || []).reduce((sum, log) => sum + (log.total_minutes || 0), 0);
  return Math.round((totalMinutes / 60) * 10) / 10;
}

export async function getTodayProgress(userId: string = 'yuan'): Promise<{ percent: number; minutes: number; items: number }> {
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('learning_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  
  if (data) {
    return {
      percent: data.daily_goal_percent || 0,
      minutes: data.total_minutes || 0,
      items: data.items_completed || 0,
    };
  }
  
  return { percent: 0, minutes: 0, items: 0 };
}

// Tasks
export async function getRecentlyCompletedTasks(userId: string = 'yuan', limit: number = 5): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'completed')
    .order('completed_at', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data as Task[];
}
