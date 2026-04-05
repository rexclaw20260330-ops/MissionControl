import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials not configured');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Types
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  project_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'on_hold' | 'planning' | 'completed';
  progress: number;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: string;
  action: string;
  type: 'deployment' | 'update' | 'feature' | 'fix' | 'other';
  metadata?: Record<string, any>;
  created_at: string;
}

export interface DashboardStats {
  id: number;
  tasks_completed: number;
  in_progress: number;
  scheduled: number;
  documents: number;
  updated_at: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  color?: string;
  created_at?: string;
  updated_at?: string;
}

// API Functions
export async function getTasks() {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Task[];
}

export async function getProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Project[];
}

export async function getActivities(limit: number = 20) {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data as Activity[];
}

export async function getDashboardStats() {
  const { data, error } = await supabase
    .from('dashboard_stats')
    .select('*')
    .eq('id', 1)
    .single();
  
  if (error) throw error;
  return data as DashboardStats;
}

// Update functions
export async function createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('tasks')
    .insert([task])
    .select()
    .single();
  
  if (error) throw error;
  return data as Task;
}

export async function updateTask(id: string, updates: Partial<Task>) {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Task;
}

export async function deleteTask(id: string) {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

export async function createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('projects')
    .insert([project])
    .select()
    .single();
  
  if (error) throw error;
  return data as Project;
}

export async function updateProject(id: string, updates: Partial<Project>) {
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Project;
}

export async function deleteProject(id: string) {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

export async function createActivity(activity: Omit<Activity, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('activities')
    .insert([activity])
    .select()
    .single();
  
  if (error) throw error;
  return data as Activity;
}

export async function updateStats(updates: Partial<DashboardStats>) {
  const { data, error } = await supabase
    .from('dashboard_stats')
    .update(updates)
    .eq('id', 1)
    .select()
    .single();
  
  if (error) throw error;
  return data as DashboardStats;
}

// Subscribe to real-time changes
export function subscribeToTasks(callback: (payload: any) => void) {
  return supabase
    .channel('tasks-channel')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, callback)
    .subscribe();
}

export function subscribeToProjects(callback: (payload: any) => void) {
  return supabase
    .channel('projects-channel')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, callback)
    .subscribe();
}

export function subscribeToActivities(callback: (payload: any) => void) {
  return supabase
    .channel('activities-channel')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'activities' }, callback)
    .subscribe();
}
