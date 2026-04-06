'use client';

import { useState, useEffect } from "react";
import { Calendar, Clock } from "lucide-react";
import { getAgentSchedules } from "@/lib/db-actions";
import { AgentSchedule, ScheduleType } from "@/lib/supabase-types";

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
  type: ScheduleType;
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

// Map agent_id from database to AgentId type
const mapAgentId = (agentId: string): AgentId => {
  const validAgents: AgentId[] = ["rex", "mosa", "bronto", "tricera", "pteroda"];
  return validAgents.includes(agentId as AgentId) ? (agentId as AgentId) : "rex";
};

// Convert database schedule to calendar event
const mapScheduleToEvent = (schedule: AgentSchedule): CalendarEvent => ({
  id: schedule.id,
  title: schedule.title,
  agentId: mapAgentId(schedule.agent_id),
  day: schedule.day_of_week,
  startHour: schedule.start_hour,
  endHour: schedule.end_hour,
  type: schedule.type || "focus",
});

export default function DinoCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch schedules on mount
  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      setError(null);
      const schedules = await getAgentSchedules();
      setEvents(schedules.map(mapScheduleToEvent));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load schedules");
    } finally {
      setLoading(false);
    }
  };

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
            <p className="text-[#8a8a95]">Agent schedules & cron jobs</p>
          </div>
        </div>
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-[#00F5FF] border-t-transparent rounded-full animate-spin" />
            <p className="text-[#8a8a95]">Loading schedules...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-rose-500/20 border border-rose-500/30">
          <p className="text-rose-200">{error}</p>
        </div>
      )}

      {/* Calendar Grid */}
      {!loading && !error && (
        <div className="bg-[#161B22] border border-white/10 rounded-2xl overflow-hidden">
          {/* Header Row */}
          <div className="grid grid-cols-8 border-b border-white/10">
            <div className="p-4 border-r border-white/10" /> {/* Time column */}
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
                const dayEvents = events.filter(
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
      )}

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
