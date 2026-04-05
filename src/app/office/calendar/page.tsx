"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar, Clock, Plus, X, Loader2 } from "lucide-react";
import { getAgentSchedules, createSchedule, deleteSchedule } from "@/lib/db-actions";
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

export default function OfficeCalendar() {
  const [currentWeek, setCurrentWeek] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [newEvent, setNewEvent] = useState({
    agent_id: "rex" as AgentId,
    title: "",
    day_of_week: 0,
    start_hour: 9,
    end_hour: 10,
    type: "focus" as ScheduleType,
  });

  const today = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

  // Fetch schedules on mount
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    fetchSchedules();
    return () => clearInterval(timer);
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

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setFormLoading(true);
      await createSchedule({
        agent_id: newEvent.agent_id,
        title: newEvent.title,
        day_of_week: newEvent.day_of_week,
        start_hour: newEvent.start_hour,
        end_hour: newEvent.end_hour,
        type: newEvent.type,
      });
      await fetchSchedules();
      setShowForm(false);
      setNewEvent({
        agent_id: "rex",
        title: "",
        day_of_week: 0,
        start_hour: 9,
        end_hour: 10,
        type: "focus",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create schedule");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await deleteSchedule(id);
      await fetchSchedules();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete schedule");
    }
  };

  const currentHour = currentTime.getHours() + currentTime.getMinutes() / 60;
  const timeIndicatorTop = ((currentHour - 8) / 14) * 100;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D1117] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-[#00F5FF] animate-spin" />
          <p className="text-[#8a8a95]">Loading schedules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1117] text-white p-6">
      {/* Error Toast */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-500/90 text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="hover:text-red-200">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Add Event Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#161B22] rounded-xl border border-white/10 p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Add New Schedule</h2>
              <button 
                onClick={() => setShowForm(false)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-sm text-[#8a8a95] mb-1">Agent</label>
                <select
                  value={newEvent.agent_id}
                  onChange={(e) => setNewEvent({...newEvent, agent_id: e.target.value as AgentId})}
                  className="w-full bg-[#0D1117] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#00F5FF] focus:outline-none"
                >
                  {agents.map(agent => (
                    <option key={agent.id} value={agent.id}>{agent.emoji} {agent.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-[#8a8a95] mb-1">Title</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  placeholder="e.g., Daily Standup"
                  required
                  className="w-full bg-[#0D1117] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#00F5FF] focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm text-[#8a8a95] mb-1">Day</label>
                <select
                  value={newEvent.day_of_week}
                  onChange={(e) => setNewEvent({...newEvent, day_of_week: parseInt(e.target.value)})}
                  className="w-full bg-[#0D1117] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#00F5FF] focus:outline-none"
                >
                  {weekDays.map((day, i) => (
                    <option key={i} value={i}>{day}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#8a8a95] mb-1">Start Hour</label>
                  <select
                    value={newEvent.start_hour}
                    onChange={(e) => setNewEvent({...newEvent, start_hour: parseFloat(e.target.value)})}
                    className="w-full bg-[#0D1117] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#00F5FF] focus:outline-none"
                  >
                    {hours.map(h => (
                      <option key={h} value={h}>{h}:00</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-[#8a8a95] mb-1">End Hour</label>
                  <select
                    value={newEvent.end_hour}
                    onChange={(e) => setNewEvent({...newEvent, end_hour: parseFloat(e.target.value)})}
                    className="w-full bg-[#0D1117] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#00F5FF] focus:outline-none"
                  >
                    {hours.filter(h => h > newEvent.start_hour).map(h => (
                      <option key={h} value={h}>{h}:00</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-[#8a8a95] mb-1">Type</label>
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({...newEvent, type: e.target.value as ScheduleType})}
                  className="w-full bg-[#0D1117] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#00F5FF] focus:outline-none"
                >
                  <option value="focus">Focus</option>
                  <option value="meeting">Meeting</option>
                  <option value="planning">Planning</option>
                  <option value="break">Break</option>
                </select>
              </div>
              
              <button
                type="submit"
                disabled={formLoading || !newEvent.title.trim()}
                className="w-full py-3 bg-gradient-to-r from-[#0066ff] to-[#00ffff] rounded-lg font-medium hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {formLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus size={18} />
                )}
                Add Schedule
              </button>
            </form>
          </div>
        </div>
      )}

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
            <button
              onClick={() => setShowForm(true)}
              className="ml-2 px-4 py-2 bg-gradient-to-r from-[#0066ff] to-[#00ffff] rounded-lg font-medium hover:brightness-110 transition-all flex items-center gap-2"
            >
              <Plus size={18} />
              Add
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
                          className={`absolute left-1 right-1 rounded-lg px-2 py-1 text-xs border cursor-pointer hover:brightness-110 transition-all hover:scale-[1.02] group/event ${getEventTypeStyle(event.type)}`}
                          style={{
                            top: `${startOffset}%`,
                            height: `${height}%`,
                            minHeight: "24px",
                          }}
                          title={`${event.title} (${event.startHour}:00 - ${event.endHour}:00)`}
                        >
                          <div className="flex items-start justify-between">
                            <p className="font-medium text-white truncate flex-1">{event.title}</p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteEvent(event.id);
                              }}
                              className="opacity-0 group-hover/event:opacity-100 hover:text-red-300 transition-opacity p-0.5"
                            >
                              <X size={12} />
                            </button>
                          </div>
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
