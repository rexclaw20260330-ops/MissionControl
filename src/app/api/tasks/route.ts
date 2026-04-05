import { NextResponse } from 'next/server';
import { getTasks, createTask, updateTask, deleteTask } from '@/lib/supabaseClient';

// GET /api/tasks - 取得所有任務
export async function GET() {
  try {
    const tasks = await getTasks();
    return NextResponse.json({ success: true, tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

// POST /api/tasks - 建立新任務
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const task = await createTask({
      title: body.title,
      description: body.description,
      status: body.status || 'pending',
      priority: body.priority || 'medium',
      due_date: body.dueDate,
      project_id: body.projectId
    });
    return NextResponse.json({ success: true, task });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

// PUT /api/tasks - 更新任務
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    
    const mappedUpdates: any = {};
    if (updates.title !== undefined) mappedUpdates.title = updates.title;
    if (updates.description !== undefined) mappedUpdates.description = updates.description;
    if (updates.status !== undefined) mappedUpdates.status = updates.status;
    if (updates.priority !== undefined) mappedUpdates.priority = updates.priority;
    if (updates.dueDate !== undefined) mappedUpdates.due_date = updates.dueDate;
    if (updates.projectId !== undefined) mappedUpdates.project_id = updates.projectId;
    
    const task = await updateTask(id, mappedUpdates);
    return NextResponse.json({ success: true, task });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks - 刪除任務
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing task ID' },
        { status: 400 }
      );
    }
    
    await deleteTask(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
