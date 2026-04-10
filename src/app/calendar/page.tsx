'use client';

import { Calendar, Clock, RefreshCw } from "lucide-react";
import { useState, useEffect } from 'react';

interface CronEvent {
  id: string;
  title: string;
  agentId: string;
  day: number; // 0-6 (Mon-Sun), -1 for every day
  startHour: number;
  endHour: number;
  type: string;
  intervalMinutes?: number;
  description?: string;
}

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const agentColors: Record<string, { gradient: string; emoji: string }> = {
  system: { gradient: "from-gray-500 to-gray-400", emoji: "⚙️" },
  rex: { gradient: "from-[#0066ff] to-[#00ffff]", emoji: "🦖" },
  pteroda: { gradient: "from-amber-500 to-orange-500", emoji: "🦅" },
  mosa: { gradient: "from-rose-500 to-red-500", emoji: "🧩" },
  bronto: { gradient: "from-emerald-500 to-teal-500", emoji: "🦴" },
  tricera: { gradient: "from-purple-500 to-pink-500", emoji: "🦕" },
};

const getEventTypeStyle = (type: string) => {
  switch (type) {
    case "task":
      return "bg-gradient-to-r from-blue-500/80 to-cyan-500/80 border-blue-400/50";
    case "analysis":
      return "bg-gradient-to-r from-amber-500/80 to-orange-500/80 border-amber-400/50";
    case "maintenance":
      return "bg-gradient-to-r from-gray-500/80 to-gray-400/80 border-gray-400/50";
    case "trading":
      return "bg-gradient-to-r from-green-500/80 to-emerald-500/80 border-green-400/50";
    case "interval":
      return "bg-gradient-to-r from-purple-500/80 to-pink-500/80 border-purple-400/50";
    default:
      return "bg-gradient-to-r from-blue-500/80 to-cyan-500/80 border-blue-400/50";
  }
};

const getEventTypeLabel = (type: string) => {
  switch (type) {
    case "task": return "Task";
    case "analysis": return "Analysis";
    case "maintenance": return "Maint";
    case "trading": return "Trading";
    case "interval": return "Interval";
    default: return "Task";
  }
};

export default function DinoCalendar() {
  const [events, setEvents] = useState<CronEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const today = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

  useEffect(() => {
    fetchCronEvents();
  }, []);

  const fetchCronEvents = async () => {
    try {
      const response = await fetch('/api/cron');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error('Error fetching cron events:', error);
    } finally {
      setLoading(false);
    }
  };

  // Group events by day
  const eventsByDay = (dayIndex: number) => {
    return events.filter(e => e.day === dayIndex || e.day === -1);
  };

  // Get unique agents from events
  const getAgentsFromEvents = () => {
    const agentIds = [...new Set(events.map(e => e.agentId))];
    return agentIds.map(id => ({
      id,
      name: id.charAt(0).toUpperCase() + id.slice(1),
      ...agentColors[id] || agentColors.system
    }));
  };

  const agents = getAgentsFromEvents();

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
            <p className="text-[#8a8a95]">Real cron jobs & scheduled tasks</p>
          </div>
          <button 
            onClick={fetchCronEvents}
            className="ml-auto p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            disabled={loading}
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Interval Jobs Summary */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-[#8a8a95] mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Interval Jobs
        </h2>
        <div className="flex flex-wrap gap-2">
          {events
            .filter(e => e.intervalMinutes)
            .map(e => (
              <div 
                key={e.id}
                className={`px-3 py-1.5 rounded-lg text-sm border ${getEventTypeStyle(e.type)}`}
              >
                <span className="font-medium">{e.title}</span>
                <span className="text-white/60 ml-2">every {e.intervalMinutes}m</span>
              </div>
            ))}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-[#161B22] border border-white/10 rounded-2xl overflow-hidden">
        {/* Header Row */}
        <div className="grid grid-cols-8 border-b border-white/10">
          <div className="p-4 border-r border-white/10 text-sm text-[#8a8a95]">
            Agent
          </div>
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

        {/* Events by Agent */}
        {loading ? (
          <div className="p-12 text-center text-[#8a8a95]">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
            Loading cron jobs...
          </div>
        ) : (
          agents.map((agent) => (
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
                  e => (e.day === dayIndex || e.day === -1) && e.agentId === agent.id && !e.intervalMinutes
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
                        title={event.description}
                      >
                        <p className="font-medium text-white truncate">{event.title}</p>
                        <p className="text-white/70">
                          {String(event.startHour).padStart(2, '0')}:{String((event.startHour % 1) * 60).padStart(2, '0')}
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
          ))
        )}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 text-sm text-[#8a8a95]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gradient-to-r from-blue-500 to-cyan-500" />
          <span>Task</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gradient-to-r from-amber-500 to-orange-500" />
          <span>Analysis</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gradient-to-r from-green-500 to-emerald-500" />
          <span>Trading</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gradient-to-r from-gray-500 to-gray-400" />
          <span>Maintenance</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gradient-to-r from-purple-500 to-pink-500" />
          <span>Interval</span>
        </div>
      </div>
    </div>
  );
}
