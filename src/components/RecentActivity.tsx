"use client";

import { useState } from "react";
import { Activity, Bot, Zap, Clock, CheckCircle2, Sparkles, Terminal, FileText, MessageSquare } from "lucide-react";

interface Activity {
  id: number;
  type: "task" | "message" | "file" | "system";
  agent: string;
  action: string;
  target: string;
  time: string;
  icon: typeof Bot;
  agentColor: string;
}

const initialActivities: Activity[] = [
  {
    id: 1,
    type: "task",
    agent: "Rex",
    action: "completed",
    target: "Gateway configuration update",
    time: "2 min ago",
    icon: CheckCircle2,
    agentColor: "from-[#0066ff] to-[#00ffff]"
  },
  {
    id: 2,
    type: "message",
    agent: "Tricera",
    action: "suggested design changes for",
    target: "QuickActions component",
    time: "15 min ago",
    icon: Sparkles,
    agentColor: "from-violet-500 to-violet-400"
  },
  {
    id: 3,
    type: "file",
    agent: "Rex",
    action: "created",
    target: "DashboardStats.tsx",
    time: "1 hour ago",
    icon: FileText,
    agentColor: "from-[#0066ff] to-[#00ffff]"
  },
  {
    id: 4,
    type: "system",
    agent: "System",
    action: " Mission Control started on",
    target: "localhost:3000",
    time: "2 hours ago",
    icon: Terminal,
    agentColor: "from-emerald-500 to-emerald-400"
  }
];

const typeIcons = {
  task: CheckCircle2,
  message: MessageSquare,
  file: FileText,
  system: Terminal
};

const typeColors = {
  task: "text-emerald-400",
  message: "text-violet-400",
  file: "text-amber-400",
  system: "text-[#00ffff]"
};

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [filter, setFilter] = useState<"all" | "tasks" | "messages">("all");

  const filteredActivities = filter === "all" 
    ? activities 
    : activities.filter(a => filter === "tasks" ? a.type === "task" : a.type === "message");

  const addActivity = (activity: Omit<Activity, "id" | "time">) => {
    const newActivity: Activity = {
      ...activity,
      id: Date.now(),
      time: "just now"
    };
    setActivities(prev => [newActivity, ...prev].slice(0, 10));
  };

  return (
    <div className="bg-[#15151a] border border-[#0066ff]/20 rounded-2xl p-5 relative overflow-hidden">
      {/* Animated scan line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00ffff]/30 to-transparent animate-scan" />
      
      {/* Corner glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#0066ff]/10 rounded-full blur-3xl animate-pulse" />
      
      <div className="relative">
        {/* Header with filter tabs */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-[#0066ff] to-[#00ffff] rounded-xl shadow-lg shadow-[#0066ff]/20">
              <Activity size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">Recent Activity</h2>
              <p className="text-[10px] text-[#8a8a95] font-mono">LIVE FEED // {activities.length} EVENTS</p>
            </div>
          </div>
          
          <div className="flex gap-1">
            {(["all", "tasks", "messages"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-medium uppercase tracking-wider transition-all duration-300
                  ${filter === f 
                    ? "bg-[#0066ff]/30 text-white border border-[#0066ff]/50" 
                    : "text-[#8a8a95] hover:text-white hover:bg-white/5"
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          {filteredActivities.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-[#0066ff]/20 rounded-xl relative overflow-hidden"
            >
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#0066ff]/5 to-[#00ffff]/5 opacity-50" />
              <div className="relative"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#0066ff]/20 to-[#00ffff]/20 flex items-center justify-center animate-pulse"
                >
                  <Bot size={28} className="text-[#00ffff]" />
                </div>
                <p className="text-[#8a8a95] font-medium">No recent activity</p>
                <p className="text-sm text-[#8a8a95]/70 mt-1">Ask Rex to start working on tasks!</p>
                
                <button 
                  className="mt-4 px-4 py-2 rounded-lg bg-[#0066ff]/20 text-[#00ffff] text-sm font-medium
                    hover:bg-[#0066ff]/30 transition-colors border border-[#0066ff]/30"
                >
                  Create First Task
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Timeline line */}
              <div className="absolute left-[34px] top-[80px] bottom-4 w-px bg-gradient-to-b from-[#0066ff]/40 via-[#00ffff]/20 to-transparent" />
              
              {filteredActivities.map((activity, index) => {
                const TypeIcon = typeIcons[activity.type];
                const Icon = activity.icon;
                const isLast = index === filteredActivities.length - 1;
                
                return (
                  <div 
                    key={activity.id} 
                    className="group flex items-start gap-4 p-3 rounded-xl 
                      hover:bg-white/5 transition-all duration-300 
                      border border-transparent hover:border-[#0066ff]/20
                      relative"
                  >
                    {/* Timeline dot */}
                    <div className={`absolute left-[30px] top-5 w-2 h-2 rounded-full bg-[#00ffff] shadow-[0_0_8px_rgba(0,255,255,0.5)]
                      ${isLast ? "" : ""}`} />
                    
                    {/* Agent avatar */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                      bg-gradient-to-br ${activity.agentColor} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon size={18} className="text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-[#f0f0f5]">
                          <span className="font-semibold text-white">{activity.agent}</span>
                          {" "}
                          <span className="text-[#8a8a95]">{activity.action}</span>
                          {" "}
                          <span className="text-[#00ffff]">{activity.target}</span>
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-1">
                        <div className={`p-1 rounded bg-white/5 ${typeColors[activity.type]}`}>
                          <TypeIcon size={12} />
                        </div>
                        <p className="text-[11px] text-[#8a8a95] font-mono">{activity.time}</p>
                      </div>
                    </div>
                    
                    {/* Hover action */}
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg hover:bg-white/10"
                    >
                      <Zap size={14} className="text-[#00ffff]" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
