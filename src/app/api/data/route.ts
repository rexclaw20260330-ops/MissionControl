import { NextResponse } from 'next/server';
import { 
  getTasks, 
  getProjects, 
  getActivities, 
  getDashboardStats,
  createTask,
  updateTask,
  deleteTask,
  createProject,
  updateProject,
  deleteProject,
  createActivity,
  updateStats
} from '@/lib/supabaseClient';

// GET /api/data - 讀取所有資料
export async function GET() {
  try {
    const [tasks, projects, activities, stats] = await Promise.all([
      getTasks(),
      getProjects(),
      getActivities(20),
      getDashboardStats()
    ]);

    const data = {
      tasks: tasks.map(t => ({
        id: t.id,
        title: t.title,
        status: t.status,
        priority: t.priority,
        description: t.description,
        dueDate: t.due_date,
        projectId: t.project_id,
        createdAt: t.created_at
      })),
      projects: projects.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        status: p.status,
        progress: p.progress,
        color: p.color,
        createdAt: p.created_at
      })),
      stats: {
        tasksCompleted: stats.tasks_completed,
        inProgress: stats.in_progress,
        scheduled: stats.scheduled,
        documents: stats.documents
      },
      activities: activities.map(a => ({
        id: a.id,
        action: a.action,
        type: a.type,
        metadata: a.metadata,
        timestamp: a.created_at
      })),
      lastUpdated: stats.updated_at
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

// POST /api/data - 更新資料
export async function POST(request: Request) {
  try {
    const updates = await request.json();
    
    // Handle stats update
    if (updates.stats) {
      await updateStats({
        tasks_completed: updates.stats.tasksCompleted,
        in_progress: updates.stats.inProgress,
        scheduled: updates.stats.scheduled,
        documents: updates.stats.documents
      });
    }

    // Handle tasks update
    if (updates.tasks) {
      // This would need individual task operations based on your needs
      // For now, tasks are managed individually
    }

    // Handle projects update
    if (updates.projects) {
      // Similar to tasks
    }

    // Handle activities update
    if (updates.activities) {
      // Similar to above
    }

    // Return updated data
    const [tasks, projects, activities, stats] = await Promise.all([
      getTasks(),
      getProjects(),
      getActivities(20),
      getDashboardStats()
    ]);

    const data = {
      tasks: tasks.map(t => ({
        id: t.id,
        title: t.title,
        status: t.status,
        priority: t.priority,
        description: t.description,
        dueDate: t.due_date,
        projectId: t.project_id,
        createdAt: t.created_at
      })),
      projects: projects.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        status: p.status,
        progress: p.progress,
        color: p.color,
        createdAt: p.created_at
      })),
      stats: {
        tasksCompleted: stats.tasks_completed,
        inProgress: stats.in_progress,
        scheduled: stats.scheduled,
        documents: stats.documents
      },
      activities: activities.map(a => ({
        id: a.id,
        action: a.action,
        type: a.type,
        metadata: a.metadata,
        timestamp: a.created_at
      })),
      lastUpdated: stats.updated_at
    };

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error updating dashboard data:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
