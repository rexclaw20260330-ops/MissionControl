import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface CronJob {
  id: string;
  name: string;
  enabled: boolean;
  schedule: {
    kind: string;
    expr?: string;
    everyMs?: number;
    tz?: string;
  };
  agentId?: string;
  payload: {
    kind: string;
    text?: string;
    message?: string;
  };
}

// Parse cron expression to get schedule info
function parseCronSchedule(expr: string, tz: string = 'UTC'): { 
  type: 'daily' | 'weekly' | 'interval' | 'custom';
  hour?: number;
  minute?: number;
  daysOfWeek?: number[]; // 0-6, 0 = Sunday
  intervalMinutes?: number;
} {
  const parts = expr.split(' ');
  
  if (parts.length === 5) {
    const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;
    
    // Check if it's a daily job (same time every day)
    if (dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
      return {
        type: 'daily',
        hour: parseInt(hour),
        minute: parseInt(minute)
      };
    }
    
    // Check if it's weekdays only (1-5)
    if (dayOfWeek === '1-5') {
      return {
        type: 'weekly',
        hour: parseInt(hour),
        minute: parseInt(minute),
        daysOfWeek: [1, 2, 3, 4, 5] // Mon-Fri
      };
    }
    
    // Parse specific days
    if (dayOfWeek !== '*') {
      const days: number[] = [];
      // Handle comma separated days
      dayOfWeek.split(',').forEach(d => {
        const day = parseInt(d.trim());
        if (!isNaN(day)) days.push(day);
      });
      return {
        type: 'weekly',
        hour: parseInt(hour),
        minute: parseInt(minute),
        daysOfWeek: days
      };
    }
  }
  
  return { type: 'custom' };
}

export async function GET(request: NextRequest) {
  try {
    // Read cron jobs from OpenClaw config
    const configPath = path.join(process.env.HOME || process.env.USERPROFILE || '', '.openclaw', 'cron', 'jobs.json');
    
    let jobs: CronJob[] = [];
    
    try {
      const data = await fs.readFile(configPath, 'utf-8');
      const parsed = JSON.parse(data);
      jobs = parsed.jobs || [];
    } catch (error) {
      console.log('Could not read cron jobs, using fallback data');
    }
    
    // Filter enabled jobs and parse schedule
    const calendarEvents = jobs
      .filter(job => job.enabled)
      .map(job => {
        const schedule = parseCronSchedule(
          job.schedule.expr || '',
          job.schedule.tz
        );
        
        // Map agent from agentId or sessionTarget
        const agentId = job.agentId || 
          (job.payload.kind === 'systemEvent' ? 'system' : 'unknown');
        
        // Create events based on schedule type
        const events: any[] = [];
        
        if (schedule.type === 'daily') {
          // Daily event - all 7 days
          for (let day = 0; day < 7; day++) {
            events.push({
              id: `${job.id}-${day}`,
              title: job.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
              agentId: agentId === 'pteroda' ? 'pteroda' : 
                       agentId === 'system' ? 'system' : 'system',
              day: day,
              startHour: schedule.hour || 0,
              endHour: (schedule.hour || 0) + 0.5,
              type: job.name.includes('cleanup') ? 'maintenance' : 
                    job.name.includes('crypto') ? 'analysis' : 'task',
              description: job.payload.text || job.payload.message || ''
            });
          }
        } else if (schedule.type === 'weekly' && schedule.daysOfWeek) {
          // Weekly event - specific days
          // Convert from cron format (0=Sun) to our format (0=Mon)
          schedule.daysOfWeek.forEach(cronDay => {
            const day = cronDay === 0 ? 6 : cronDay - 1; // Convert to Mon=0
            events.push({
              id: `${job.id}-${day}`,
              title: job.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
              agentId: agentId === 'pteroda' ? 'pteroda' : 'system',
              day: day,
              startHour: schedule.hour || 0,
              endHour: (schedule.hour || 0) + 0.5,
              type: job.name.includes('crypto') ? 'analysis' : 'task',
              description: job.payload.text || job.payload.message || ''
            });
          });
        } else if (job.schedule.everyMs) {
          // Interval-based job
          const intervalMinutes = Math.floor(job.schedule.everyMs / 60000);
          events.push({
            id: `${job.id}-interval`,
            title: `${job.name} (every ${intervalMinutes}m)`,
            agentId: 'system',
            day: -1, // Every day indicator
            intervalMinutes: intervalMinutes,
            type: 'interval',
            description: job.payload.text || job.payload.message || ''
          });
        }
        
        return events;
      })
      .flat();
    
    // Also include Windows Task Scheduler job for Polymarket trader
    calendarEvents.push({
      id: 'polymarket-trader-interval',
      title: 'Polymarket Trader',
      agentId: 'system',
      day: -1,
      intervalMinutes: 15,
      type: 'trading',
      description: 'Paper trading simulation every 15 minutes'
    });
    
    return NextResponse.json({ events: calendarEvents });
    
  } catch (error) {
    console.error('Error reading cron jobs:', error);
    return NextResponse.json({ events: [] }, { status: 500 });
  }
}
