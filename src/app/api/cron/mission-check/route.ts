import { NextResponse } from 'next/server';
import { getTasks } from '@/lib/supabaseClient';

// Discord webhook URL (應該從環境變數讀取)
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

// GET /api/cron/mission-check - 每天早上10點自動檢查任務
export async function GET() {
  try {
    // 取得所有任務
    const tasks = await getTasks();
    
    // 篩選待處理的任務 (pending 或 in-progress)
    const pendingTasks = tasks.filter((t: any) => 
      t.status === 'pending' || t.status === 'in-progress'
    );
    
    // 篩選今日到期的任務
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dueTodayTasks = tasks.filter((t: any) => {
      if (!t.due_date) return false;
      const dueDate = new Date(t.due_date);
      return dueDate >= today && dueDate < tomorrow;
    });
    
    // 篩選逾期任務
    const overdueTasks = tasks.filter((t: any) => {
      if (!t.due_date || t.status === 'completed') return false;
      const dueDate = new Date(t.due_date);
      return dueDate < today;
    });
    
    // 準備通知內容
    const summary = {
      total: tasks.length,
      pending: pendingTasks.length,
      dueToday: dueTodayTasks.length,
      overdue: overdueTasks.length
    };
    
    // 如果有 Discord webhook，發送通知
    if (DISCORD_WEBHOOK_URL) {
      await sendDiscordNotification(summary, pendingTasks, dueTodayTasks, overdueTasks);
    }
    
    return NextResponse.json({
      success: true,
      summary,
      pendingTasks: pendingTasks.slice(0, 5), // 回傳前5個
      dueTodayTasks,
      overdueTasks,
      message: DISCORD_WEBHOOK_URL 
        ? 'Mission check completed and notification sent'
        : 'Mission check completed (no Discord webhook configured)'
    });
  } catch (error) {
    console.error('Error checking missions:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

async function sendDiscordNotification(
  summary: any, 
  pendingTasks: any[], 
  dueTodayTasks: any[], 
  overdueTasks: any[]
) {
  try {
    const webhookUrl = DISCORD_WEBHOOK_URL!;
    
    // 建立 Discord embed
    const embed = {
      title: '🦖 Rex | 每日 Mission 檢查報告',
      description: `早上好！以下是今天的任務狀況：`,
      color: 0xfbbf24, // 琥珀色
      fields: [
        {
          name: '📊 總覽',
          value: `總任務: ${summary.total} | 待處理: ${summary.pending} | 今日到期: ${summary.dueToday} | 逾期: ${summary.overdue}`,
          inline: false
        }
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: 'Mission Control • DinoSquad'
      }
    };
    
    // 如果有逾期任務，加入紅色警告區塊
    if (overdueTasks.length > 0) {
      embed.fields.push({
        name: `⚠️ 逾期任務 (${overdueTasks.length})`,
        value: overdueTasks.slice(0, 5).map(t => `• ${t.title}`).join('\n') || '無',
        inline: false
      });
    }
    
    // 加入今日到期任務
    if (dueTodayTasks.length > 0) {
      embed.fields.push({
        name: `📅 今日到期 (${dueTodayTasks.length})`,
        value: dueTodayTasks.map(t => `• ${t.title}`).join('\n') || '無',
        inline: false
      });
    }
    
    // 加入待處理任務（前5個）
    if (pendingTasks.length > 0) {
      embed.fields.push({
        name: `📝 待處理任務 (顯示前5個)`,
        value: pendingTasks.slice(0, 5).map(t => `• ${t.title} (${t.status})`).join('\n') || '無',
        inline: false
      });
    }
    
    // 發送到 Discord
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: '<@327405394672615424>', // 標註 Master
        embeds: [embed]
      })
    });
    
    if (!response.ok) {
      console.error('Failed to send Discord notification:', await response.text());
    }
  } catch (error) {
    console.error('Error sending Discord notification:', error);
  }
}
