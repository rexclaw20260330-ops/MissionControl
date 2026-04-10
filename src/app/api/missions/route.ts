import { NextResponse } from 'next/server';
import { getMissions } from '@/lib/db-actions';

// GET /api/missions - 取得所有 missions
export async function GET() {
  try {
    const missions = await getMissions();
    return NextResponse.json({
      success: true,
      missions
    });
  } catch (error) {
    console.error('Error fetching missions:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
