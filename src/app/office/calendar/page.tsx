"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar, Clock } from "lucide-react";

type AgentId = "rex" | "mosa" | "bronto" | "tricera" | "pteroda";

interface Agent {
  id: AgentId;
  name: string;
  emoji: string;
  gradient: string;
  color: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  agentId: AgentId;
  day: number;
  startHour: number;
  endHour: number;
  type: "focus" | "meeting" | "break" | "planning";
}

const agents: Agent[] = [
  { id: "rex", name: "Rex", emoji: "🦖", gradient: "from-[#0066ff] to-[#00ffff]", color: "#00F5FF" },
  { id: "tricera", name: "Tricera", emoji: "🦕", gradient: "from-purple-500 to-pink-500", color: "#A855F7" },
  { id: "pteroda", name: "Pteroda", emoji: "🦅", gradient: "from-amber-500 to-orange-500", color: "#F59E0B" },
  { id: "bronto", name: "Bronto", emoji: "🦒", gradient: "from-emerald-500 to-teal-500", color: "#10B981" },
  { id: "mosa", name: "Mosa", emoji: "🐊", gradient: "from-rose-500 to-red-500", color: "#F43F5E" },
];

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = Array.from({ length: 14 }, (_, i) => i + 8);

const events: CalendarEvent[] = [
  { id: "1", title: "Daily Standup", agentId: "rex", day: 0, startHour: 9, endHour: 9.5, type: "meeting" },
  { id: "2", title: "Code Review", agentId: "mosa", day: 0, startHour: 10, endHour: 11, type: "focus" },
  { id: "3", title: "Design Sync", agentId: "tricera", day: 0, startHour: 14, endHour: 15, type: "meeting" },
  { id: "4", title: "Research Deep Dive", agentId: "pteroda", day: 0, startHour: 9, endHour: 12, type: "focus" },
  { id: "5", title: "Strategy Planning", agentId: "bronto", day: 0, startHour: 13, endHour: 15, type: "planning" },
  { id: "6", title: "Sprint Planning", agentId: "rex", day: 1, startHour: 10, endHour: 11.5, type: "planning" },
  { id: "7", title: "UI Implementation", agentId: "mosa", day: 1, startHour: 9, endHour: 12, type: "focus" },
  { id: "8", title: "Asset Creation", agentId: "tricera", day: 1, startHour: 13, endHour: 16, type: "focus" },
  { id: "9", title: "Market Analysis", agentId: "pteroda", day: 1, startHour: 14, endHour: 17, type: "focus" },
  { id: "10", title: "Architecture Review", agentId: "bronto", day: 2, startHour: 9, endHour: 11, type: "meeting" },
  { id: "11", title: "Feature Development", agentId: "mosa", day: 2, startHour: 11, endHour: 16, type: "focus" },
  { id: "12", title: "Creative Workshop", agentId: "tricera", day: 2, startHour: 10, endHour: 12, type: "meeting" },
  { id: "13", title: "Daily Standup", agentId: "rex", day: 2, startHour: 9, endHour: 9.5, type: "meeting" },
  { id: "14", title: "Bug Fixes", agentId: "mosa", day: 3, startHour: 9, endHour: 11, type: "focus" },
  { id: "15", title: "Performance Audit", agentId: "pteroda", day: 3, startHour: 13, endHour: 15, type: "focus" },
  { id: "16", title: "Team Sync", agentId: "rex", day: 3, startHour: 15, endHour: 16, type: "meeting" },
  { id: "17", title: "Code Review", agentId: "bronto", day: 3, startHour: 11, endHour: 12, type: "meeting" },
  { id: "18", title: "Design Review", agentId: "tricera", day: 4, startHour: 10, endHour: 12, type: "meeting" },
  { id: "19", title: "Documentation", agentId: "pteroda", day: 4, startHour: 9, endHour: 11, type: "focus" },
  { id: "20", title: "Weekly Review", agentId: "rex", day: 4, startHour: 16, endHour: 17, type: "meeting" },
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

export default function OfficeCalendar() {
  const [currentWeek, setCurrentWeek] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const today = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const currentHour = currentTime.getHours() + currentTime.getMinutes() / 60;
  const timeIndicatorTop = ((currentHour - 8) / 14) * 100;

  return (
    <div className="min-h-screen bg-[#0D1117] text-white p-6">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#161B22] rounded-xl border border-white/10">
              <Calendar className="text-[#00F5FF]" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">Jurassic Office Calendar</h1>
              <p className="text-sm text-[#8a8a95]">Team schedules across the squad</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCurrentWeek(w => w - 1)}
              className="p-2 rounded-lg bg-[#161B22] border border-white/10 hover:border-[#00F5FF]/50 hover:text-[#00F5FF] transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="px-4 py-2 bg-[#161B22] rounded-lg border border-white/10">
              <span className="font-medium">Week {currentWeek === 0 ? "Current" : currentWeek > 0 ? `+${currentWeek}` : currentWeek}</span>
            </div>
            <button 
              onClick={() => setCurrentWeek(w => w + 1)}
              className="p-2 rounded-lg bg-[#161B22] border border-white/10 hover:border-[#00F5FF]/50 hover:text-[#00F5FF] transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Agent Legend */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {agents.map((agent) => (
            <div 
              key={agent.id}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#161B22] border border-white/5"
            >
              <div 
                className={`w-3 h-3 rounded-full bg-gradient-to-br ${agent.gradient}`}
                style={{ boxShadow: `0 0 8px ${agent.color}` }}
              />
              <span className="text-sm font-medium">{agent.name}</span>
              <span>{agent.emoji}</span>
            </div>
          ))}
        </div>
      </header>

      {/* Calendar Grid */}
      <div className="bg-[#161B22] rounded-xl border border-white/10 overflow-hidden">
        {/* Header Row - Days */}
        <div className="grid grid-cols-[60px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] border-b border-white/10">
          <div className="p-4 text-center text-xs text-[#8a8a95] uppercase tracking-wider border-r border-white/5">
            Agent
          </div>
          {weekDays.map((day, index) => (
            <div 
              key={day}
              className={`p-4 text-center border-r border-white/5 last:border-r-0 ${
                index === today ? "bg-[#00F5FF]/5" : ""
              }`}
            >
              <p className={`text-xs uppercase tracking-wider ${index === today ? "text-[#00F5FF]" : "text-[#8a8a95]"}`}>
                {day}
              </p>
              {index === today && (
                <div className="mt-1 text-[10px] text-[#00F5FF]">Today</div>
              )}
            </div>
          ))}
        </div>

        {/* Agent Rows */}
        <div className="relative">
          {agents.map((agent, agentIndex) => (
            <div 
              key={agent.id}
              className="grid grid-cols-[60px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] border-b border-white/5 last:border-b-0 group"
            >
              {/* Agent Column */}
              <div className="p-3 border-r border-white/5 flex flex-col items-center justify-center bg-[#0D1117]/50">
                <div 
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${agent.gradient} flex items-center justify-center text-xl shadow-lg transition-transform group-hover:scale-110`}
                  style={{ boxShadow: `0 0 20px ${agent.color}30` }}
                >
                  {agent.emoji}
                </div>
                <p className="text-xs text-[#8a8a95] mt-1 text-center">{agent.name}</p>
              </div>

              {/* Day Columns */}
              {weekDays.map((_, dayIndex) => {
                const dayEvents = events.filter(
                  e => e.agentId === agent.id && e.day === dayIndex
                );
                const isToday = dayIndex === today;

                return (
                  <div 
                    key={dayIndex}
                    className={`relative p-2 border-r border-white/5 last:border-r-0 min-h-[180px] ${
                      isToday ? "bg-[#00F5FF]/5" : ""
                    } hover:bg-white/5 transition-colors`}
                  >
                    {/* Hour grid lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                      {hours.map((_, i) => (
                        <div key={i} className="border-t border-white/5 first:border-t-0" />
                      ))}
                    </div>

                    {/* Events */}
                    {dayEvents.map((event) => {
                      const startOffset = ((event.startHour - 8) / 14) * 100;
                      const height = ((event.endHour - event.startHour) / 14) * 100;

                      return (
                        <div
                          key={event.id}
                          className={`absolute left-1 right-1 rounded-lg px-2 py-1 text-xs border cursor-pointer hover:brightness-110 transition-all hover:scale-[1.02] ${getEventTypeStyle(event.type)}`}
                          style={{
                            top: `${startOffset}%`,
                            height: `${height}%`,
                            minHeight: "24px",
                          }}
                          title={`${event.title} (${event.startHour}:00 - ${event.endHour}:00)`}
                        >
                          <p className="font-medium text-white truncate">{event.title}</p>
                          <p className="text-white/70 text-[10px]">
                            {Math.floor(event.startHour)}:{String((event.startHour % 1) * 60).padStart(2, "0")} - {Math.floor(event.endHour)}:{String((event.endHour % 1) * 60).padStart(2, "0")}
                          </p>
                        </div>
                      );
                    })}

                    {/* Current time indicator - only for today */}
                    {isToday && currentHour >= 8 && currentHour <= 22 && agentIndex === 0 && (
                      <div
                        className="absolute left-0 right-0 pointer-events-none z-10"
                        style={{ top: `${timeIndicatorTop}%` }}
                      >
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-[#00F5FF] shadow-[0_0_8px_#00F5FF]" />
                          <div className="flex-1 h-px bg-gradient-to-r from-[#00F5FF] to-transparent" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          {/* Time Labels - Left side */}
          <div className="absolute left-[60px] top-0 bottom-0 w-12 pointer-events-none">
            {hours.map((hour, i) => (
              <div 
                key={hour}
                className="absolute text-[10px] text-[#8a8a95] -translate-y-1/2"
                style={{ top: `${(i / (hours.length - 1)) * 100}%` }}
              >
                {hour}:00
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Current Time Display */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#161B22] border border-white/10">
            <Clock size={16} className="text-[#00F5FF]" />
            <span className="font-mono text-lg">
              {currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}
            </span>
          </div>
          <div className="text-sm text-[#8a8a95]">
            Local Time
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4">
          {[
            { type: "focus", label: "Focus", color: "from-blue-500 to-cyan-500" },
            { type: "meeting", label: "Meeting", color: "from-purple-500 to-pink-500" },
            { type: "planning", label: "Planning", color: "from-emerald-500 to-teal-500" },
          ].map((item) => (
            <div key={item.type} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded bg-gradient-to-r ${item.color}`} />
              <span className="text-xs text-[#8a8a95]">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
