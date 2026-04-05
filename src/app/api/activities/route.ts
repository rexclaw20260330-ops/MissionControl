import { NextResponse } from 'next/server';
import { createActivity } from '@/lib/supabaseClient';

// POST /api/activities - 建立新活動記錄
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const activity = await createActivity({
      action: body.action,
      type: body.type || 'update',
      metadata: body.metadata || {}
    });
    return NextResponse.json({ success: true, activity });
  } catch (error) {
    console.error('Error creating activity:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
