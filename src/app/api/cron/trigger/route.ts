import { NextResponse } from 'next/server';

// GET /api/cron/trigger - 手動觸發 cron 檢查
export async function GET() {
  try {
    // 呼叫本地 cron endpoint
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/cron/mission-check`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      message: 'Mission check triggered manually',
      result: data
    });
  } catch (error) {
    console.error('Error triggering mission check:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
