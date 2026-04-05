"use client";

import { useState, useEffect } from "react";
import { Calendar, Target, Zap, Trophy, Crown, Activity, TrendingUp, Star } from "lucide-react";

interface Goal {
  id: string;
  title: string;
  progress: number;
  category: string;
}

interface Skill {
  name: string;
  level: number;
}

interface Event {
  id: string;
  title: string;
  time: string;
  type: "work" | "personal" | "meeting";
}

const quarterlyGoals: Goal[] = [
  { id: "1", title: "Launch Mission Control v1.0", progress: 78, category: "Product" },
  { id: "2", title: "Complete AI Agent Framework", progress: 65, category: "Development" },
  { id: "3", title: "Establish Daily Workflow", progress: 90, category: "Productivity" },
  { id: "4", title: "Expand Agent Capabilities", progress: 45, category: "Research" },
];

const skills: Skill[] = [
  { name: "Coding", level: 92 },
  { name: "Strategy", level: 85 },
  { name: "Design", level: 70 },
  { name: "AI Systems", level: 88 },
  { name: "Management", level: 75 },
  { name: "Research", level: 80 },
];

const todayEvents: Event[] = [
  { id: "1", title: "Morning Standup", time: "09:00", type: "meeting" },
  { id: "2", title: "Deep Work Block", time: "10:00", type: "work" },
  { id: "3", title: "Agent Sync", time: "14:00", type: "meeting" },
  { id: "4", title: "Review & Plan", time: "17:00", type: "personal" },
];

const stats = [
  { label: "Tasks Completed", value: "247", change: "+12", icon: Zap },
  { label: "Projects Active", value: "5", change: "+1", icon: Target },
  { label: "Agent Hours", value: "1.2K", change: "+89", icon: Activity },
  { label: "Win Rate", value: "94%", change: "+3%", icon: Trophy },
];

// Generate days for mini calendar
const generateCalendarDays = () => {
  const today = new Date().getDate();
  const days = [];
  for (let i = 1; i <= 30; i++) {
    days.push({
      day: i,
      isToday: i === today,
      hasEvent: [5, 12, 15, 18, 22, 25, 28].includes(i),
    });
  }
  return days;
};

// Hexagonal radar chart component
const SkillsRadar = ({ skills }: { skills: Skill[] }) => {
  const size = 200;
  const center = size / 2;
  const radius = 70;
  const angleStep = (2 * Math.PI) / skills.length;

  const getPoint = (index: number, level: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (level / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Generate grid polygons
  const gridLevels = [20, 40, 60, 80, 100];
  
  // Generate skill polygon points
  const skillPoints = skills.map((skill, i) => getPoint(i, skill.level));
  const polygonPoints = skillPoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg width={size} height={size} className="mx-auto">
      {/* Background grid */}
      {gridLevels.map((level) => {
        const points = skills.map((_, i) => getPoint(i, level));
        const pointStr = points.map((p) => `${p.x},${p.y}`).join(" ");
        return (
          <polygon
            key={level}
            points={pointStr}
            fill="none"
            stroke="rgba(255, 215, 0, 0.1)"
            strokeWidth="1"
          />
        );
      })}

      {/* Axis lines */}
      {skills.map((_, i) => {
        const end = getPoint(i, 100);
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={end.x}
            y2={end.y}
            stroke="rgba(255, 215, 0, 0.15)"
            strokeWidth="1"
          />
        );
      })}

      {/* Skill area */}
      <polygon
        points={polygonPoints}
        fill="url(#goldGradient)"
        fillOpacity="0.4"
        stroke="#FFD700"
        strokeWidth="2"
      />

      {/* Gradient definition */}
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FFB800" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* Skill dots */}
      {skillPoints.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" fill="#FFD700" />
          <circle cx={p.x} cy={p.y} r="6" fill="none" stroke="#FFD700" strokeOpacity="0.5" />
        </g>
      ))}

      {/* Labels */}
      {skills.map((skill, i) => {
        const pos = getPoint(i, 115);
        return (
          <text
            key={i}
            x={pos.x}
            y={pos.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#8a8a95"
            fontSize="10"
            fontWeight="500"
          >
            {skill.name}
          </text>
        );
      })}
    </svg>
  );
};

export default function YuanPage() {
  const [calendarDays] = useState(generateCalendarDays());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentDate = new Date();
  const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const todayName = currentDate.toLocaleDateString("en-US", { weekday: "long", day: "numeric" });

  return (
    <div className="min-h-screen bg-[#050508] text-white p-6">
      {/* Subtle grid background */}
      <div 
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,215,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,215,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Header */}
      <header className="mb-8 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#FFB800] flex items-center justify-center shadow-lg shadow-[#FFD700]/20">
              <Crown className="text-[#050508]" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-[#FFD700] to-[#FFB800] bg-clip-text text-transparent">
                  Yuan
                </span>
              </h1>
              <p className="text-sm text-[#8a8a95]">Master of the Jurassic Squad</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#0D1117] border border-[#FFD700]/20">
            <Star className="text-[#FFD700]" size={18} />
            <span className="text-sm font-medium">Q2 2026</span>
          </div>
        </div>
      </header>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        {/* Left: Calendar Section */}
        <div className="space-y-6">
          {/* Mini Calendar */}
          <div className="bg-[#0D1117] rounded-xl border border-white/10 overflow-hidden">
            <div className="p-5 border-b border-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="text-[#FFD700]" size={20} />
                  <h2 className="text-lg font-bold">{monthName}</h2>
                </div>
                <div className="text-sm text-[#8a8a95]">{todayName}</div>
              </div>
            </div>
            
            <div className="p-5">
              {/* Weekday headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                  <div key={day} className="text-center text-xs text-[#8a8a95] py-1">{day}</div>
                ))}
              </div>
              
              {/* Days grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day) => (
                  <div
                    key={day.day}
                    className={`
                      aspect-square flex items-center justify-center text-sm rounded-lg cursor-pointer
                      transition-all duration-200
                      ${day.isToday 
                        ? "bg-gradient-to-br from-[#FFD700] to-[#FFB800] text-[#050508] font-bold shadow-lg shadow-[#FFD700]/30" 
                        : day.hasEvent 
                          ? "bg-[#FFD700]/10 text-[#FFD700] hover:bg-[#FFD700]/20" 
                          : "text-white hover:bg-white/5"
                      }
                    `}
                  >
                    {day.day}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Today's Events */}
          <div className="bg-[#0D1117] rounded-xl border border-white/10 overflow-hidden">
            <div className="p-5 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#FFD700] animate-pulse" />
                <h2 className="text-lg font-bold">Today&apos;s Schedule</h2>
              </div>
            </div>
            
            <div className="p-5 space-y-3">
              {todayEvents.map((event) => (
                <div 
                  key={event.id}
                  className="flex items-center gap-4 p-3 rounded-lg bg-[#050508] border border-white/5 hover:border-[#FFD700]/30 transition-colors group"
                >
                  <div className={`w-1 h-10 rounded-full ${
                    event.type === "work" ? "bg-[#00F5FF]" : 
                    event.type === "meeting" ? "bg-purple-500" : "bg-emerald-500"
                  }`} />
                  <div className="flex-1">
                    <p className="font-medium text-white group-hover:text-[#FFD700] transition-colors">{event.title}</p>
                    <p className="text-xs text-[#8a8a95]">
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </p>
                  </div>
                  <div className="text-sm font-mono text-[#FFD700]">{event.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Life Tracker */}
        <div className="space-y-6">
          {/* Quarterly Goals */}
          <div className="bg-[#0D1117] rounded-xl border border-white/10 overflow-hidden">
            <div className="p-5 border-b border-white/5">
              <div className="flex items-center gap-3">
                <Target className="text-[#FFD700]" size={20} />
                <h2 className="text-lg font-bold">Quarterly Goals</h2>
              </div>
            </div>
            
            <div className="p-5 space-y-4">
              {quarterlyGoals.map((goal, index) => (
                <div 
                  key={goal.id}
                  className="group"
                  style={{ opacity: mounted ? 1 : 0, transition: `opacity 0.5s ${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">{goal.title}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#8a8a95]">{goal.category}</span>
                      <span className="text-sm font-bold text-[#FFD700]">{goal.progress}%</span>
                    </div>
                  </div>
                  
                  <div className="h-2 bg-[#050508] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFB800] transition-all duration-1000 ease-out relative"
                      style={{ 
                        width: mounted ? `${goal.progress}%` : "0%",
                        boxShadow: "0 0 10px rgba(255, 215, 0, 0.5)",
                      }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Radar */}
          <div className="bg-[#0D1117] rounded-xl border border-white/10 overflow-hidden">
            <div className="p-5 border-b border-white/5">
              <div className="flex items-center gap-3">
                <TrendingUp className="text-[#FFD700]" size={20} />
                <h2 className="text-lg font-bold">Skills Matrix</h2>
              </div>
            </div>
            
            <div className="p-5">
              <SkillsRadar skills={skills} />
              
              {/* Skill levels list */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                {skills.map((skill) => (
                  <div key={skill.name} className="flex items-center justify-between text-sm">
                    <span className="text-[#8a8a95]">{skill.name}</span>
                    <span className="font-mono text-[#FFD700]">{skill.level}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat) => (
              <div 
                key={stat.label}
                className="bg-[#0D1117] rounded-xl border border-white/10 p-4 hover:border-[#FFD700]/30 transition-colors group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="p-2 rounded-lg bg-[#FFD700]/10 group-hover:bg-[#FFD700]/20 transition-colors">
                    <stat.icon className="text-[#FFD700]" size={18} />
                  </div>
                  <span className="text-xs font-medium text-emerald-400">{stat.change}</span>
                </div>
                <p className="text-2xl font-black text-white">{stat.value}</p>
                <p className="text-xs text-[#8a8a95]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gold accent line at bottom */}
      <div className="mt-8 h-px bg-gradient-to-r from-transparent via-[#FFD700]/50 to-transparent" />
    </div>
  );
}
