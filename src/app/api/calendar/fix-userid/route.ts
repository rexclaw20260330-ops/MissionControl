import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// POST /api/calendar/fix-userid
// This is a one-time fix to update system events to proper user_id
export async function POST() {
  try {
    // Update Pteroda events
    const { error: error1 } = await supabase
      .from('calendar_events')
      .update({ user_id: 'pteroda' })
      .ilike('title', '%Pteroda%');

    if (error1) throw error1;

    // Update Session Cleanup events
    const { error: error2 } = await supabase
      .from('calendar_events')
      .update({ user_id: 'system' })
      .eq('title', 'Session Cleanup');

    if (error2) throw error2;

    // Check remaining events for yuan
    const { data: yuanEvents, error: error3 } = await supabase
      .from('calendar_events')
      .select('id, title, user_id')
      .eq('user_id', 'yuan');

    if (error3) throw error3;

    return NextResponse.json({
      success: true,
      message: 'Events updated successfully',
      yuanEvents: yuanEvents || []
    });
  } catch (error) {
    console.error('Error fixing events:', error);
    return NextResponse.json(
      { error: 'Failed to fix events' },
      { status: 500 }
    );
  }
}