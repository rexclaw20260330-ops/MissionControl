"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Clock, Calendar, FileText, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface Stat {
  name: string;
  value: number;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: typeof CheckCircle2;
  gradient: string;
  glowColor: string;
}

const stats: Stat[] = [
  { 
    name: "Tasks Completed", 
    value: 12, 
    change: "+3 today", 
    trend: "up",
    icon: CheckCircle2, 
    gradient: "from-emerald-500 to-emerald-400",
    glowColor: "rgba(16, 185, 129, 0.3)"
  },
  { 
    name: "In Progress", 
    value: 5, 
    change: "2 active", 
    trend: "neutral",
    icon: Clock, 
    gradient: "from-[#0066ff] to-[#00ffff]",
    glowColor: "rgba(0, 102, 255, 0.3)"
  },
  { 
    name: "Scheduled", 
    value: 8, 
    change: "+2 this week", 
    trend: "up",
    icon: Calendar, 
    gradient: "from-violet-500 to-violet-400",
    glowColor: "rgba(139, 92, 246, 0.3)"
  },
  { 
    name: "Documents", 
    value: 24, 
    change: "+5 created", 
    trend: "up",
    icon: FileText, 
    gradient: "from-amber-500 to-amber-400",
    glowColor: "rgba(245, 158, 11, 0.3)"
  },
];

// Animated counter hook
function useCountUp(end: number, duration: number = 1500) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);
  
  return count;
}

function StatCard({ stat }: { stat: Stat }) {
  const Icon = stat.icon;
  const animatedValue = useCountUp(stat.value);
  
  const TrendIcon = stat.trend === "up" ? TrendingUp : stat.trend === "down" ? TrendingDown : Minus;
  const trendColor = stat.trend === "up" ? "text-emerald-400" : stat.trend === "down" ? "text-rose-400" : "text-[#8a8a95]";
  
  return (
    <div
      className="group bg-[#15151a] border border-[#0066ff]/20 rounded-2xl p-5 
        hover:border-[#00ffff]/40 
        transition-all duration-500 
        hover:-translate-y-1 
        hover:shadow-[0_8px_30px_rgba(0,102,255,0.15)]
        relative overflow-hidden"
    >
      {/* Breathing gradient border effect */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, ${stat.glowColor} 0%, transparent 50%)`,
        }}
      />
      
      {/* Gradient overlay on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
      
      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <p className="text-[#8a8a95] text-xs font-medium tracking-wide uppercase">{stat.name}</p>
          </div>
          
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-4xl font-black text-white tracking-tighter tabular-nums">
              {animatedValue}
            </p>
            <TrendIcon size={16} className={`${trendColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
          </div>
          
          <p className="text-[11px] mt-2 text-[#8a8a95] group-hover:text-white/70 transition-colors font-mono flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${stat.trend === "up" ? "bg-emerald-400" : stat.trend === "down" ? "bg-rose-400" : "bg-[#8a8a95]"}`} />
            {stat.change}
          </p>
        </div>
        
        {/* Icon with float animation on hover */}
        <div className={`p-3 bg-gradient-to-br ${stat.gradient} rounded-xl shadow-lg group-hover:shadow-xl group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300`}>
          <Icon size={22} className="text-white group-hover:animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.name} stat={stat} />
      ))}
    </div>
  );
}
