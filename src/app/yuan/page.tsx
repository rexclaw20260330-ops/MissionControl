"use client";

import { useState, useEffect } from "react";
import { 
  Calendar as CalendarIcon, 
  Target, 
  Zap, 
  Trophy, 
  Crown, 
  Activity, 
  TrendingUp, 
  Star, 
  Plus, 
  X, 
  Brain, 
  ArrowRight,
  Flame,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  ListTodo
} from "lucide-react";
import { 
  getUserGoals, 
  createGoal, 
  updateGoalProgress, 
  UserGoal, 
  getUserSkills, 
  createSkill, 
  updateSkillLevel, 
  UserSkill, 
  getUserStats,
  UserStat,
  getLearningStreak,
  getLearningLogs,
  getWeeklyStudyHours,
  getTodayProgress,
  getRecentlyCompletedTasks,
  LearningStreak,
  LearningLog,
  Task
} from "@/lib/db-actions";
import Link from "next/link";

// Calendar Event Type
interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  color: string;
  category: string;
  created_at: string;
}

type CalendarView = 'day' | 'week' | 'month';

const formatStatValue = (stat: UserStat | undefined, suffix: string = '') => {
  if (!stat) return 'Loading...';
  const value = stat.stat_value;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K${suffix}`;
  return `${value}${suffix}`;
};

const formatStatChange = (stat: UserStat | undefined) => {
  if (!stat) return '';
  const change = stat.stat_change;
  if (change === 0) return '';
  if (change > 0) return `+${change}`;
  return `${change}`;
};

// Quotes array
const quotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Knowledge is power.", author: "Francis Bacon" },
];

// Circular Progress Component
const CircularProgress = ({ progress, size = 120, strokeWidth = 8 }: { progress: number; size?: number; strokeWidth?: number }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#1f2937"
        strokeWidth={strokeWidth}
        fill="transparent"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#00F5FF"
        strokeWidth={strokeWidth}
        fill="transparent"
        strokeLinecap="round"
        style={{
          strokeDasharray: circumference,
          strokeDashoffset: offset,
          transition: 'stroke-dashoffset 0.5s ease-in-out',
        }}
      />
    </svg>
  );
};

// Hexagonal radar chart component
const SkillsRadar = ({ skills }: { skills: UserSkill[] }) => {
  const size = 200;
  const center = size / 2;
  const radius = 70;
  const angleStep = (2 * Math.PI) / (skills.length || 6);

  const getPoint = (index: number, level: number, maxLevel: number = 100) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (level / maxLevel) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  if (skills.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-[#8a8a95]">
        No skills tracked yet
      </div>
    );
  }

  const skillPoints = skills.map((skill, i) => getPoint(i, skill.level, skill.max_level));
  const polygonPoints = skillPoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg width={size} height={size} className="mx-auto">
      {[20, 40, 60, 80, 100].map((level) => {
        const points = skills.map((_, i) => getPoint(i, level, 100));
        const pointStr = points.map((p) => `${p.x},${p.y}`).join(" ");
        return (
          <polygon
            key={level}
            points={pointStr}
            fill="none"
            stroke="#3D3D3D"
            strokeWidth="1"
          />
        );
      })}
      <polygon
        points={polygonPoints}
        fill="rgba(0, 245, 255, 0.2)"
        stroke="#00F5FF"
        strokeWidth="2"
      />
      {skills.map((skill, i) => {
        const point = skillPoints[i];
        return (
          <g key={skill.id}>
            <circle cx={point.x} cy={point.y} r="4" fill="#00F5FF" />
            <text
              x={point.x}
              y={point.y - 10}
              textAnchor="middle"
              fill="#FFF8E7"
              fontSize="10"
            >
              {skill.skill_name}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// Day View Component
const DayView = ({ date, events }: { date: Date; events: CalendarEvent[] }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const dayEvents = events.filter(event => {
    const eventDate = new Date(event.start_time);
    return eventDate.toDateString() === date.toDateString();
  });

  return (
    <div className="space-y-2">
      <div className="text-center text-[#00F5FF] font-bold text-lg mb-4">
        {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
      </div>
      <div className="space-y-1 max-h-[400px] overflow-y-auto">
        {hours.map(hour => {
          const hourEvents = dayEvents.filter(event => {
            const eventHour = new Date(event.start_time).getHours();
            return eventHour === hour;
          });
          return (
            <div key={hour} className="flex gap-2 min-h-[40px]">
              <div className="w-12 text-xs text-[#8a8a95] text-right pt-2">
                {hour.toString().padStart(2, '0')}:00
              </div>
              <div className="flex-1 border-t border-[#1f2937] relative">
                {hourEvents.map(event => (
                  <div
                    key={event.id}
                    className="absolute left-0 right-0 px-2 py-1 text-xs rounded text-white truncate"
                    style={{ backgroundColor: event.color || '#00F5FF', top: '2px' }}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Week View Component
const WeekView = ({ date, events }: { date: Date; events: CalendarEvent[] }) => {
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
          <div key={i} className={`flex-1 text-center p-2 rounded-lg ${day.toDateString() === new Date().toDateString() ? 'bg-[#00F5FF]/20' : ''}`}>
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
            <div key={i} className="min-h-[150px] bg-[#0D1117] rounded-lg p-2 space-y-1">
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
const MonthView = ({ date, events }: { date: Date; events: CalendarEvent[] }) => {
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
  const [goals, setGoals] = useState<UserGoal[]>([]);
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [stats, setStats] = useState<UserStat[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: "", category: "", progress: 0 });
  const [newSkill, setNewSkill] = useState({ skill_name: "", level: 0 });
  const [calendarView, setCalendarView] = useState<CalendarView>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dailyQuote, setDailyQuote] = useState(quotes[0]);

  // Event modal state
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    start_time: "",
    end_time: "",
    category: "personal",
    user_id: "yuan"
  });

  // Category color mapping
  const categoryColors: Record<string, string> = {
    learning: "#10B981",
    work: "#0066ff",
    personal: "#F59E0B",
    fitness: "#EF4444",
    other: "#8B5CF6"
  };

  // Real data from database
  const [streak, setStreak] = useState<LearningStreak | null>(null);
  const [todayProgress, setTodayProgress] = useState({ percent: 0, minutes: 0, items: 0 });
  const [weeklyHours, setWeeklyHours] = useState(0);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [weeklyTasks, setWeeklyTasks] = useState(0);

  useEffect(() => {
    loadData();
    // Set a random quote
    setDailyQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load data with individual error handling - don't fail everything if one fails
      const results = await Promise.allSettled([
        getUserGoals(),
        getUserSkills(),
        getUserStats(),
        fetch('/api/calendar/events?user_id=yuan').then(res => res.json()),
        getLearningStreak().catch(() => null),
        getTodayProgress().catch(() => ({ percent: 0, minutes: 0, items: 0 })),
        getWeeklyStudyHours().catch(() => 0),
        getRecentlyCompletedTasks().catch(() => []),
      ]);
      
      // Extract data from results
      const [goalsData, skillsData, statsData, eventsResponse, streakData, todayProg, weeklyHrs, completed] = results.map((r, i) => {
        if (r.status === 'fulfilled') {
          return r.value;
        } else {
          console.error(`Failed to load data[${i}]:`, r.reason);
          // Return default values
          if (i === 3) return { events: [] }; // eventsResponse
          if (i === 4) return null; // streakData
          if (i === 5) return { percent: 0, minutes: 0, items: 0 }; // todayProg
          if (i === 6) return 0; // weeklyHrs
          if (i === 7) return []; // completed
          return [];
        }
      });
      
      setGoals(goalsData || []);
      setSkills(skillsData || []);
      setStats(statsData || []);
      setEvents(eventsResponse?.events || []);
      setStreak(streakData);
      setTodayProgress(todayProg || { percent: 0, minutes: 0, items: 0 });
      setWeeklyHours(weeklyHrs || 0);
      setCompletedTasks(completed || []);
      setWeeklyTasks((completed || []).length);
    } catch (err) {
      setError("Failed to load data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.title || !newGoal.category) return;
    
    try {
      await createGoal(newGoal);
      setIsGoalModalOpen(false);
      setNewGoal({ title: "", category: "", progress: 0 });
      await loadData();
    } catch (err) {
      console.error("Failed to create goal:", err);
    }
  };

  const handleProgressUpdate = async (id: string, progress: number) => {
    try {
      await updateGoalProgress(id, progress);
      await loadData();
    } catch (err) {
      console.error("Failed to update progress:", err);
    }
  };

  const handleCreateSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.skill_name) return;
    
    try {
      await createSkill(newSkill);
      setIsSkillModalOpen(false);
      setNewSkill({ skill_name: "", level: 0 });
      await loadData();
    } catch (err) {
      console.error("Failed to create skill:", err);
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (calendarView === 'day') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    } else if (calendarView === 'week') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.start_time || !newEvent.end_time) return;

    try {
      const eventData = {
        ...newEvent,
        color: categoryColors[newEvent.category] || categoryColors.other
      };

      const response = await fetch('/api/calendar/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      });

      if (!response.ok) throw new Error('Failed to create event');

      setIsEventModalOpen(false);
      setNewEvent({
        title: "",
        description: "",
        start_time: "",
        end_time: "",
        category: "personal",
        user_id: "yuan"
      });
      await loadData();
    } catch (err) {
      console.error("Failed to create event:", err);
    }
  };

  const openEventModal = (date?: Date, hour?: number) => {
    const now = date || new Date();
    const startHour = hour !== undefined ? hour : now.getHours();
    const startTime = new Date(now);
    startTime.setHours(startHour, 0, 0, 0);
    const endTime = new Date(startTime);
    endTime.setHours(startHour + 1);

    setNewEvent({
      ...newEvent,
      start_time: startTime.toISOString().slice(0, 16),
      end_time: endTime.toISOString().slice(0, 16)
    });
    setIsEventModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D1117] text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-[#00F5FF] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-[#8a8a95]">Loading your data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0D1117] text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-rose-400 mb-2">Error: {error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-[#00F5FF] text-black rounded-lg hover:bg-[#00D9E6] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      {/* Header */}
      <header className="p-6 border-b border-[#00F5FF]/20">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#161B22] rounded-xl border border-[#00F5FF]/30">
              <Crown className="text-[#00F5FF]" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">Yuan&apos;s Sanctum</h1>
              <p className="text-sm text-[#8a8a95]">Your personal command center</p>
            </div>
          </div>
          
          {/* Second Brain Button */}
          <Link
            href="/brain"
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#0066ff]/20 to-[#00ffff]/20 border border-[#0066ff]/40 rounded-xl hover:border-[#00ffff]/60 hover:from-[#0066ff]/30 hover:to-[#00ffff]/30 transition-all group"
          >
            <Brain size={18} className="text-[#00ffff]" />
            <span className="font-medium text-[#00ffff]">Second Brain</span>
            <ArrowRight size={14} className="text-[#00ffff] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </header>

      <main className="p-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Calendar (2/3 width) */}
          <div className="xl:col-span-2 space-y-6">
            {/* Enhanced Calendar */}
            <div className="bg-[#161B22] border border-[#00F5FF]/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <CalendarIcon className="text-[#00F5FF]" size={24} />
                  <h2 className="text-xl font-bold">Yuan&apos;s Calendar</h2>
                </div>
                
                {/* View Switcher */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigateDate('prev')}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <div className="flex bg-[#0D1117] rounded-lg p-1">
                    {(['day', 'week', 'month'] as const).map((view) => (
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
              {calendarView === 'day' && <DayView date={currentDate} events={events} />}
              {calendarView === 'week' && <WeekView date={currentDate} events={events} />}
              {calendarView === 'month' && <MonthView date={currentDate} events={events} />}
            </div>

            {/* Learning Tracking Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Today's Goal Progress */}
              <div className="bg-[#161B22] border border-[#00F5FF]/20 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="text-[#00F5FF]" size={20} />
                  <h3 className="font-bold">Today&apos;s Goal</h3>
                </div>
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <CircularProgress progress={todayProgress.percent} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold">{todayProgress.percent}%</span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-[#8a8a95]">
                      <CheckCircle2 size={16} className="text-emerald-400" />
                      <span>{todayProgress.items} tasks completed</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#8a8a95]">
                      <Clock size={16} className="text-[#00F5FF]" />
                      <span>{(todayProgress.minutes / 60).toFixed(1)} hours studied</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Streak */}
              <div className="bg-[#161B22] border border-[#00F5FF]/20 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Flame className="text-orange-500" size={20} />
                  <h3 className="font-bold">Study Streak</h3>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-6xl font-black text-orange-500">{streak?.current_streak || 0}</div>
                  <div className="space-y-1">
                    <p className="text-lg font-semibold">Day Streak</p>
                    <p className="text-sm text-[#8a8a95]">Longest: {streak?.longest_streak || 0}</p>
                    <div className="flex gap-1 mt-2">
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                        <div
                          key={day + i}
                          className={`w-6 h-6 rounded flex items-center justify-center text-[10px] ${
                            i < (streak?.current_streak || 0) % 7 ? 'bg-orange-500/20 text-orange-400' : 'bg-[#0D1117] text-[#8a8a95]'
                          }`}
                        >
                          ✓
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Weekly Stats */}
              <div className="bg-[#161B22] border border-[#00F5FF]/20 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="text-[#00F5FF]" size={20} />
                  <h3 className="font-bold">This Week</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-[#0D1117] rounded-xl">
                    <p className="text-2xl font-bold text-[#00F5FF]">{weeklyHours}h</p>
                    <p className="text-xs text-[#8a8a95]">Study Hours</p>
                  </div>
                  <div className="text-center p-3 bg-[#0D1117] rounded-xl">
                    <p className="text-2xl font-bold text-emerald-400">{weeklyTasks}</p>
                    <p className="text-xs text-[#8a8a95]">Tasks Done</p>
                  </div>
                </div>
              </div>

              {/* Recently Completed */}
              <div className="bg-[#161B22] border border-[#00F5FF]/20 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <ListTodo className="text-[#00F5FF]" size={20} />
                  <h3 className="font-bold">Recently Completed</h3>
                </div>
                <div className="space-y-2 max-h-[120px] overflow-y-auto">
                  {completedTasks.length === 0 ? (
                    <p className="text-sm text-[#8a8a95] text-center">No completed tasks yet</p>
                  ) : (
                    completedTasks.slice(0, 4).map((task) => (
                      <div key={task.id} className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="flex-1 truncate">{task.title}</span>
                        <span className="text-xs text-[#8a8a95]">{task.category}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Quote Section */}
            <div className="bg-gradient-to-r from-[#00F5FF]/10 to-[#0066ff]/10 border border-[#00F5FF]/20 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#00F5FF]/20 rounded-full">
                  <Star className="text-[#00F5FF]" size={24} />
                </div>
                <div>
                  <p className="text-lg italic text-[#FFF8E7] mb-2">&ldquo;{dailyQuote.text}&rdquo;</p>
                  <p className="text-sm text-[#8a8a95]">— {dailyQuote.author}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Goals & Skills (1/3 width) */}
          <div className="space-y-6">
            {/* Quarterly Goals */}
            <div className="bg-[#161B22] border border-[#00F5FF]/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Target className="text-[#00F5FF]" size={20} />
                  <h2 className="text-lg font-bold">Quarterly Goals</h2>
                </div>
                <button
                  onClick={() => setIsGoalModalOpen(true)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Plus size={18} className="text-[#00F5FF]" />
                </button>
              </div>

              <div className="space-y-4">
                {goals.length === 0 ? (
                  <p className="text-[#8a8a95] text-center py-4">No goals yet. Create your first one!</p>
                ) : (
                  goals.map((goal) => (
                    <div key={goal.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{goal.title}</span>
                        <span className="text-sm text-[#00F5FF]">{goal.progress}%</span>
                      </div>
                      <div className="h-2 bg-[#0D1117] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#00F5FF] to-[#0066ff] rounded-full transition-all duration-500"
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={goal.progress}
                        onChange={(e) => handleProgressUpdate(goal.id, parseInt(e.target.value))}
                        className="w-full h-1 bg-[#0D1117] rounded-lg appearance-none cursor-pointer mt-2 accent-[#00F5FF]"
                      />
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Skills Radar */}
            <div className="bg-[#161B22] border border-[#00F5FF]/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="text-[#00F5FF]" size={20} />
                  <h2 className="text-lg font-bold">Skills Radar</h2>
                </div>
                <button
                  onClick={() => setIsSkillModalOpen(true)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Plus size={18} className="text-[#00F5FF]" />
                </button>
              </div>

              <SkillsRadar skills={skills} />
            </div>

            {/* Quick Actions */}
            <div className="bg-[#161B22] border border-[#00F5FF]/20 rounded-2xl p-6">
              <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/calendar"
                  className="flex flex-col items-center gap-2 p-4 bg-[#0D1117] rounded-xl hover:bg-[#00F5FF]/10 transition-colors border border-transparent hover:border-[#00F5FF]/30"
                >
                  <CalendarIcon size={24} className="text-[#00F5FF]" />
                  <span className="text-sm font-medium">Calendar</span>
                </Link>
                <Link
                  href="/brain"
                  className="flex flex-col items-center gap-2 p-4 bg-[#0D1117] rounded-xl hover:bg-[#00F5FF]/10 transition-colors border border-transparent hover:border-[#00F5FF]/30"
                >
                  <Brain size={24} className="text-[#00F5FF]" />
                  <span className="text-sm font-medium">Second Brain</span>
                </Link>
                <Link
                  href="/tasks"
                  className="flex flex-col items-center gap-2 p-4 bg-[#0D1117] rounded-xl hover:bg-[#00F5FF]/10 transition-colors border border-transparent hover:border-[#00F5FF]/30"
                >
                  <Target size={24} className="text-[#00F5FF]" />
                  <span className="text-sm font-medium">Tasks</span>
                </Link>
                <Link
                  href="/projects"
                  className="flex flex-col items-center gap-2 p-4 bg-[#0D1117] rounded-xl hover:bg-[#00F5FF]/10 transition-colors border border-transparent hover:border-[#00F5FF]/30"
                >
                  <Zap size={24} className="text-[#00F5FF]" />
                  <span className="text-sm font-medium">Projects</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Goal Modal */}
      {isGoalModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#161B22] border border-[#00F5FF]/20 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">New Goal</h2>
              <button onClick={() => setIsGoalModalOpen(false)} className="text-[#8a8a95] hover:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div>
                <label className="block text-sm text-[#8a8a95] mb-1">Goal Title</label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0D1117] border border-[#00F5FF]/20 rounded-lg text-white focus:border-[#00F5FF] focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-[#8a8a95] mb-1">Category</label>
                <select
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0D1117] border border-[#00F5FF]/20 rounded-lg text-white focus:border-[#00F5FF] focus:outline-none"
                  required
                >
                  <option value="">Select category</option>
                  <option value="Product">Product</option>
                  <option value="Development">Development</option>
                  <option value="Productivity">Productivity</option>
                  <option value="Research">Research</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsGoalModalOpen(false)}
                  className="px-4 py-2 text-[#8a8a95] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00F5FF] text-black rounded-lg font-semibold hover:bg-[#00D9E6] transition-colors"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Skill Modal */}
      {isSkillModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#161B22] border border-[#00F5FF]/20 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">New Skill</h2>
              <button onClick={() => setIsSkillModalOpen(false)} className="text-[#8a8a95] hover:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateSkill} className="space-y-4">
              <div>
                <label className="block text-sm text-[#8a8a95] mb-1">Skill Name</label>
                <input
                  type="text"
                  value={newSkill.skill_name}
                  onChange={(e) => setNewSkill({ ...newSkill, skill_name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0D1117] border border-[#00F5FF]/20 rounded-lg text-white focus:border-[#00F5FF] focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-[#8a8a95] mb-1">Initial Level</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newSkill.level}
                  onChange={(e) => setNewSkill({ ...newSkill, level: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 bg-[#0D1117] border border-[#00F5FF]/20 rounded-lg text-white focus:border-[#00F5FF] focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsSkillModalOpen(false)}
                  className="px-4 py-2 text-[#8a8a95] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00F5FF] text-black rounded-lg font-semibold hover:bg-[#00D9E6] transition-colors"
                >
                  Add Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
