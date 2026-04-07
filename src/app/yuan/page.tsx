"use client";

import { useState, useEffect } from "react";
import { 
  Calendar as CalendarIcon, 
  Crown, 
  Plus, 
  X, 
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

// Calendar Event Type
interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  color?: string;
  category: string;
}

// Category colors
const categoryColors: Record<string, string> = {
  learning: '#00F5FF',
  work: '#0066ff',
  personal: '#8b5cf6',
  fitness: '#10b981',
  other: '#f59e0b',
};

type CalendarView = 'month' | 'week';

// Week View Component
const WeekView = ({ date, events, onDayClick }: { date: Date; events: CalendarEvent[]; onDayClick?: (date: Date) => void }) => {
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay());
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    return day;
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {weekDays.map((day, i) => (
          <div 
            key={i} 
            className={`flex-1 text-center p-2 rounded-lg cursor-pointer transition-colors ${
              day.toDateString() === new Date().toDateString() ? 'bg-[#00F5FF]/20' : 'hover:bg-white/5'
            }`}
            onClick={() => onDayClick && onDayClick(day)}
          >
            <div className="text-xs text-[#8a8a95]">{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
            <div className={`font-bold ${day.toDateString() === new Date().toDateString() ? 'text-[#00F5FF]' : ''}`}>
              {day.getDate()}
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day, i) => {
          const dayEvents = events.filter(event => {
            const eventDate = new Date(event.start_time);
            return eventDate.toDateString() === day.toDateString();
          });
          return (
            <div 
              key={i} 
              className="min-h-[150px] bg-[#0D1117] rounded-lg p-2 space-y-1 cursor-pointer hover:bg-[#0D1117]/80 transition-colors"
              onClick={() => onDayClick && onDayClick(day)}
            >
              {dayEvents.map(event => (
                <div
                  key={event.id}
                  className="text-[10px] px-1 py-0.5 rounded text-white truncate"
                  style={{ backgroundColor: event.color || '#00F5FF' }}
                >
                  {event.title}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Month View Component
const MonthView = ({ date, events, onDayClick }: { date: Date; events: CalendarEvent[]; onDayClick?: (date: Date) => void }) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const today = new Date();

  const getEventDensity = (day: number) => {
    const dayEvents = events.filter(event => {
      const eventDate = new Date(event.start_time);
      return eventDate.getDate() === day && eventDate.getMonth() === month && eventDate.getFullYear() === year;
    });
    return dayEvents.length;
  };

  return (
    <div className="space-y-4">
      <div className="text-center text-[#00F5FF] font-bold text-lg">
        {date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm text-[#8a8a95]">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="py-2">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDay }, (_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        {days.map(day => {
          const density = getEventDensity(day);
          const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

          return (
            <div
              key={day}
              onClick={() => onDayClick && onDayClick(new Date(year, month, day))}
              className={`aspect-square p-2 rounded-lg cursor-pointer transition-all ${
                isToday
                  ? 'bg-[#00F5FF] text-black font-bold'
                  : density > 0
                  ? `bg-[#00F5FF]/${Math.min(density * 20, 80)} border border-[#00F5FF]/30`
                  : 'hover:bg-white/5'
              }`}
            >
              <div className="text-sm">{day}</div>
              {density > 0 && !isToday && (
                <div className="flex gap-0.5 justify-center mt-1">
                  {Array.from({ length: Math.min(density, 3) }, (_, i) => (
                    <div key={i} className="w-1 h-1 rounded-full bg-[#00F5FF]" />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function YuanPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState<CalendarView>('month');
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    category: "personal",
    user_id: "yuan"
  });

  // Load events
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/calendar/events?user_id=yuan');
      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (calendarView === 'week') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date) return;

    try {
      const eventData = {
        title: newEvent.title,
        description: newEvent.description,
        start_time: newEvent.date + 'T00:00',
        end_time: newEvent.date + 'T23:59',
        category: newEvent.category,
        user_id: newEvent.user_id,
        color: categoryColors[newEvent.category] || categoryColors.other
      };

      const response = await fetch('/api/calendar/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      });

      if (!response.ok) throw new Error('Failed to create event');

      setIsEventModalOpen(false);
      setNewEvent({ title: "", description: "", date: "", category: "personal", user_id: "yuan" });
      fetchEvents();
    } catch (err) {
      console.error("Failed to create event:", err);
    }
  };

  const openEventModal = (date?: Date) => {
    const dateStr = date ? date.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
    setNewEvent({
      ...newEvent,
      date: dateStr
    });
    setIsEventModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D1117] text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-[#00F5FF] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-[#8a8a95]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      {/* Header */}
      <header className="px-6 py-4 border-b border-[#00F5FF]/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00F5FF] to-[#0066ff] flex items-center justify-center">
              <Crown className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">Yuan&apos;s Sanctum</h1>
              <p className="text-sm text-[#8a8a95]">Your personal command center</p>
            </div>
          </div>
          
          <Link
            href="/projects"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00F5FF]/20 to-[#0066ff]/20 border border-[#00F5FF]/40 rounded-xl hover:border-[#00F5FF]/60 transition-all group"
          >
            <span className="font-medium text-[#00F5FF]">Projects</span>
          </Link>
        </div>
      </header>

      <main className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Calendar */}
          <div className="bg-[#161B22] border border-[#00F5FF]/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <CalendarIcon className="text-[#00F5FF]" size={24} />
                <h2 className="text-xl font-bold">Yuan&apos;s Calendar</h2>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigateDate('prev')}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                
                <div className="flex bg-[#0D1117] rounded-lg p-1">
                  {(['month', 'week'] as const).map((view) => (
                    <button
                      key={view}
                      onClick={() => setCalendarView(view)}
                      className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                        calendarView === view
                          ? 'bg-[#00F5FF] text-black'
                          : 'text-[#8a8a95] hover:text-white'
                      }`}
                    >
                      {view.charAt(0).toUpperCase() + view.slice(1)}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => navigateDate('next')}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
                <button
                  onClick={() => openEventModal()}
                  className="ml-2 flex items-center gap-2 px-3 py-2 bg-[#00F5FF] text-black rounded-lg hover:bg-[#00F5FF]/90 transition-colors text-sm font-medium"
                >
                  <Plus size={16} />
                  Add Event
                </button>
              </div>
            </div>

            {/* Calendar Content */}
            {calendarView === 'month' && <MonthView date={currentDate} events={events} onDayClick={openEventModal} />}
            {calendarView === 'week' && <WeekView date={currentDate} events={events} onDayClick={openEventModal} />}
          </div>
        </div>
      </main>

      {/* Event Modal */}
      {isEventModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#161B22] border border-[#00F5FF]/20 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">New Event</h2>
              <button onClick={() => setIsEventModalOpen(false)} className="text-[#8a8a95] hover:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-sm text-[#8a8a95] mb-1">Event Title</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0D1117] border border-[#00F5FF]/20 rounded-lg text-white focus:border-[#00F5FF] focus:outline-none"
                  placeholder="e.g., Study React Hooks"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-[#8a8a95] mb-1">Description</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0D1117] border border-[#00F5FF]/20 rounded-lg text-white focus:border-[#00F5FF] focus:outline-none resize-none"
                  placeholder="Optional details..."
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#8a8a95] mb-1">Date</label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0D1117] border border-[#00F5FF]/20 rounded-lg text-white focus:border-[#00F5FF] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#8a8a95] mb-1">Category</label>
                  <select
                    value={newEvent.category}
                    onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0D1117] border border-[#00F5FF]/20 rounded-lg text-white focus:border-[#00F5FF] focus:outline-none"
                  >
                    <option value="learning">📚 Learning</option>
                    <option value="work">💼 Work</option>
                    <option value="personal">👤 Personal</option>
                    <option value="fitness">💪 Fitness</option>
                    <option value="other">📝 Other</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="px-4 py-2 text-[#8a8a95] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00F5FF] text-black rounded-lg font-semibold hover:bg-[#00D9E6] transition-colors"
                >
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
