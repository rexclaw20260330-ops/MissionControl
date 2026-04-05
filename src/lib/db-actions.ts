import { supabase } from './supabase';
import { Mission, MissionInsert, MissionUpdate, AgentSchedule, AgentScheduleInsert, UserGoal, UserGoalInsert, UserSkill, UserSkillInsert } from './supabase-types';

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

export async function updateMissionStatus(id: string, status: string) {
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
