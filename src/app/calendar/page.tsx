'use client';

import { Calendar } from "lucide-react";

type AgentId = "rex" | "mosa" | "bronto" | "tricera" | "pteroda";

interface Agent {
  id: AgentId;
  name: string;
  emoji: string;
  gradient: string;
  color: string;
}

interface ScheduleEvent {
  id: string;
  title: string;
  agentId: AgentId;
  day: number; // 0-6 (Mon-Sun)
  startHour: number;
  endHour: number;
  type: "focus" | "meeting" | "planning" | "break";
}

const agents: Agent[] = [
  { id: "rex", name: "Rex", emoji: "🦖", gradient: "from-[#0066ff] to-[#00ffff]", color: "#00F5FF" },
  { id: "tricera", name: "Tricera", emoji: "🦕", gradient: "from-purple-500 to-pink-500", color: "#A855F7" },
  { id: "pteroda", name: "Pteroda", emoji: "🦅", gradient: "from-amber-500 to-orange-500", color: "#F59E0B" },
  { id: "bronto", name: "Bronto", emoji: "🦴", gradient: "from-emerald-500 to-teal-500", color: "#10B981" },
  { id: "mosa", name: "Mosa", emoji: "🧩", gradient: "from-rose-500 to-red-500", color: "#F43F5E" },
];

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Hardcoded schedules (written in code, no database needed)
const hardcodedSchedules: ScheduleEvent[] = [
  // Rex - Monday
  { id: "rex-mon-focus", title: "Deep Work", agentId: "rex", day: 0, startHour: 9, endHour: 12, type: "focus" },
  { id: "rex-mon-plan", title: "Sprint Planning", agentId: "rex", day: 0, startHour: 14, endHour: 15, type: "planning" },
  
  // Rex - Tuesday
  { id: "rex-tue-focus", title: "Code Review", agentId: "rex", day: 1, startHour: 10, endHour: 12, type: "focus" },
  { id: "rex-tue-meet", title: "Team Sync", agentId: "rex", day: 1, startHour: 14, endHour: 15, type: "meeting" },
  
  // Rex - Wednesday
  { id: "rex-wed-focus", title: "Architecture", agentId: "rex", day: 2, startHour: 9, endHour: 11, type: "focus" },
  
  // Rex - Thursday
  { id: "rex-thu-focus", title: "Feature Dev", agentId: "rex", day: 3, startHour: 9, endHour: 13, type: "focus" },
  
  // Rex - Friday
  { id: "rex-fri-wrap", title: "Week Wrap", agentId: "rex", day: 4, startHour: 15, endHour: 17, type: "planning" },
  
  // Mosa - Daily Standups
  { id: "mosa-mon-standup", title: "Standup", agentId: "mosa", day: 0, startHour: 9, endHour: 9.5, type: "meeting" },
  { id: "mosa-tue-standup", title: "Standup", agentId: "mosa", day: 1, startHour: 9, endHour: 9.5, type: "meeting" },
  { id: "mosa-wed-standup", title: "Standup", agentId: "mosa", day: 2, startHour: 9, endHour: 9.5, type: "meeting" },
  { id: "mosa-thu-standup", title: "Standup", agentId: "mosa", day: 3, startHour: 9, endHour: 9.5, type: "meeting" },
  { id: "mosa-fri-standup", title: "Standup", agentId: "mosa", day: 4, startHour: 9, endHour: 9.5, type: "meeting" },
  
  // Mosa - Coding blocks
  { id: "mosa-tue-code", title: "Feature Coding", agentId: "mosa", day: 1, startHour: 10, endHour: 18, type: "focus" },
  { id: "mosa-wed-code", title: "Feature Coding", agentId: "mosa", day: 2, startHour: 10, endHour: 18, type: "focus" },
  { id: "mosa-thu-code", title: "Feature Coding", agentId: "mosa", day: 3, startHour: 10, endHour: 18, type: "focus" },
  
  // Tricera - Design sessions
  { id: "tricera-tue-design", title: "UI Design", agentId: "tricera", day: 1, startHour: 10, endHour: 14, type: "focus" },
  { id: "tricera-thu-design", title: "UI Design", agentId: "tricera", day: 3, startHour: 10, endHour: 14, type: "focus" },
  
  // Pteroda - Daily Crypto Analysis
  { id: "pteroda-daily-crypto", title: "Crypto Analysis", agentId: "pteroda", day: 0, startHour: 9, endHour: 10, type: "focus" },
  { id: "pteroda-daily-crypto2", title: "Crypto Analysis", agentId: "pteroda", day: 1, startHour: 9, endHour: 10, type: "focus" },
  { id: "pteroda-daily-crypto3", title: "Crypto Analysis", agentId: "pteroda", day: 2, startHour: 9, endHour: 10, type: "focus" },
  { id: "pteroda-daily-crypto4", title: "Crypto Analysis", agentId: "pteroda", day: 3, startHour: 9, endHour: 10, type: "focus" },
  { id: "pteroda-daily-crypto5", title: "Crypto Analysis", agentId: "pteroda", day: 4, startHour: 9, endHour: 10, type: "focus" },
  
  // Bronto - QA sessions
  { id: "bronto-tue-qa", title: "Code QA", agentId: "bronto", day: 1, startHour: 14, endHour: 17, type: "focus" },
  { id: "bronto-thu-qa", title: "Code QA", agentId: "bronto", day: 3, startHour: 14, endHour: 17, type: "focus" },
  { id: "bronto-fri-qa", title: "Weekly Review", agentId: "bronto", day: 4, startHour: 10, endHour: 12, type: "planning" },
];

const getEventTypeStyle = (type: string) => {
  switch (type) {
    case "focus":
      return "bg-gradient-to-r from-blue-500/80 to-cyan-500/80 border-blue-400/50";
    case "meeting":
      return "bg-gradient-to-r from-purple-500/80 to-pink-500/80 border-purple-400/50";
    case "planning":
      return "bg-gradient-to-r from-emerald-500/80 to-teal-500/80 border-emerald-400/50";
    case "break":
      return "bg-gradient-to-r from-gray-500/60 to-gray-400/60 border-gray-400/50";
    default:
      return "bg-gradient-to-r from-blue-500/80 to-cyan-500/80 border-blue-400/50";
  }
};

const getEventTypeLabel = (type: string) => {
  switch (type) {
    case "focus": return "Focus";
    case "meeting": return "Meeting";
    case "planning": return "Planning";
    case "break": return "Break";
    default: return "Focus";
  }
};

export default function DinoCalendar() {
  const today = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

  return (
    <div className="min-h-screen bg-[#0D1117] text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-xl bg-gradient-to-br from-[#0066ff] to-[#00ffff]">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Dino Calendar</h1>
            <p className="text-[#8a8a95]">Agent schedules &amp; cron jobs (hardcoded)</p>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-[#161B22] border border-white/10 rounded-2xl overflow-hidden">
        {/* Header Row */}
        <div className="grid grid-cols-8 border-b border-white/10">
          <div className="p-4 border-r border-white/10" />
          {weekDays.map((day, i) => (
            <div
              key={day}
              className={`p-4 text-center font-semibold ${
                i === today ? "bg-[#0066ff]/20 text-[#00F5FF]" : "text-[#8a8a95]"
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Agent Rows */}
        {agents.map((agent) => (
          <div key={agent.id} className="grid grid-cols-8 border-b border-white/10 last:border-b-0">
            {/* Agent Label */}
            <div className="p-4 border-r border-white/10 flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${agent.gradient} flex items-center justify-center text-lg`}>
                {agent.emoji}
              </div>
              <span className="font-medium text-sm">{agent.name}</span>
            </div>

            {/* Days */}
            {weekDays.map((_, dayIndex) => {
              const dayEvents = hardcodedSchedules.filter(
                (e) => e.agentId === agent.id && e.day === dayIndex
              );

              return (
                <div
                  key={dayIndex}
                  className={`p-2 border-r border-white/10 last:border-r-0 min-h-[100px] ${
                    dayIndex === today ? "bg-[#0066ff]/5" : ""
                  }`}
                >
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`mb-2 p-2 rounded-lg border text-xs ${getEventTypeStyle(event.type)}`}
                    >
                      <p className="font-medium text-white truncate">{event.title}</p>
                      <p className="text-white/70">
                        {Math.floor(event.startHour)}:{(event.startHour % 1) * 60 === 0 ? '00' : '30'} - {Math.floor(event.endHour)}:{(event.endHour % 1) * 60 === 0 ? '00' : '30'}
                      </p>
                      <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-black/30 text-white/80 text-[10px]">
                        {getEventTypeLabel(event.type)}
                      </span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center gap-6">
        <span className="text-[#8a8a95] text-sm">Event Types:</span>
        <div className="flex items-center gap-4">
          {[
            { type: "focus", label: "Focus", color: "from-blue-500 to-cyan-500" },
            { type: "meeting", label: "Meeting", color: "from-purple-500 to-pink-500" },
            { type: "planning", label: "Planning", color: "from-emerald-500 to-teal-500" },
            { type: "break", label: "Break", color: "from-gray-500 to-gray-400" },
          ].map(({ type, label, color }) => (
            <div key={type} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded bg-gradient-to-r ${color}`} />
              <span className="text-sm text-[#8a8a95]">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
