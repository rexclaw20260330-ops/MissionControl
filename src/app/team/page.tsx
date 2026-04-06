import { Users, Bot, User, Laptop, Target, BookOpen, Calendar, Code, Crown, ChevronRight, Rocket, Star, Sparkles } from "lucide-react";

// Hierarchy structure:
// Level 1: Master (Yuan) 👑
// Level 2: Rex (Main Agent) 🦖
// Level 3: Other Agents - Bronto, Mosa, Pteroda, Tricera

const hierarchy = {
  master: {
    id: "master",
    name: "Yuan",
    role: "Master",
    type: "master",
    status: "online",
    device: "Mac Studio",
    description: "The architect. Builder of the AI agent organization.",
    emoji: "👑",
    gradient: "from-amber-400 to-yellow-600",
    icon: Crown,
  },
  rex: {
    id: "rex",
    name: "Rex",
    role: "CEO / Planner",
    type: "main",
    status: "online",
    device: "Cloud",
    description: "The only mission definer and final decision maker. Coordinates the entire squad.",
    emoji: "🦖",
    gradient: "from-[#0066ff] to-[#00ffff]",
    icon: Bot,
  },
  agents: [
    { id: "tricera", name: "Tricera", role: "UI/UX Designer", type: "sub", status: "online", device: "Mac Studio", description: "Creates designs that flow directly to Mosa for implementation.", emoji: "🦕", gradient: "from-purple-500 to-pink-500", icon: User },
    { id: "pteroda", name: "Pteroda", role: "Investment Researcher", type: "sub", status: "online", device: "Cloud", description: "Data-driven analysis only—no advice, just facts. Responds to research assignments from Rex.", emoji: "🦅", gradient: "from-amber-500 to-orange-500", icon: BookOpen },
    { id: "bronto", name: "Bronto", role: "QA Engineer", type: "sub", status: "online", device: "Cloud", description: "Validates code, features, and UX. Scores: requirements (0-10), UX (0-10), logic (0-10). Output: PASS/FAIL.", emoji: "🦒", gradient: "from-emerald-500 to-teal-500", icon: Calendar },
    { id: "mosa", name: "Mosa", role: "Software Engineer", type: "sub", status: "online", device: "MacBook Pro", description: "Implements Tricera's designs directly. Builds features and maintains infrastructure.", emoji: "🐊", gradient: "from-rose-500 to-red-500", icon: Code },
  ],
};

const mission = "Rex (CEO) defines missions → Tricera (UI/UX) designs → Mosa (Engineer) builds → Pteroda (Research) analyzes → Bronto (QA) validates. End-to-end execution.";

// Star particles for background
const StarParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(50)].map((_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 3}s`,
          opacity: Math.random() * 0.8 + 0.2,
          transform: `scale(${Math.random() * 1.5 + 0.5})`,
        }}
      />
    ))}
  </div>
);

// Nebula glow effect
const NebulaGlow = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]" />
    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-[80px]" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px]" />
  </div>
);

// Agent Card Component
function AgentCard({ agent, size = "normal", isMaster: isMasterProp = false }: { agent: typeof hierarchy.rex; size?: "large" | "normal" | "small"; isMaster?: boolean }) {
  const Icon = agent.icon;
  const isMaster = agent.type === "master";
  const isMain = agent.type === "main";

  const sizeClasses = {
    large: isMaster ? "w-32 h-32 text-5xl" : "w-24 h-24 text-4xl",
    normal: "w-16 h-16 text-2xl",
    small: "w-12 h-12 text-xl",
  };

  const cardClasses = {
    large: isMaster ? "p-8 scale-110" : "p-6",
    normal: "p-4",
    small: "p-3",
  };

  return (
    <div
      className={`group relative bg-[#15151a] border rounded-2xl ${cardClasses[size]} transition-all duration-300 hover:border-[#0066ff]/50 hover:glow-cyan overflow-hidden z-10 ${
        isMaster
          ? "border-amber-400/60 shadow-[0_0_40px_rgba(251,191,36,0.3),0_0_80px_rgba(251,191,36,0.1)] animate-golden-pulse"
          : isMain
          ? "border-[#0066ff]/50"
          : "border-[#0066ff]/20"
      }`}
    >
      {/* Golden halo ring for Master */}
      {isMaster && (
        <>
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 rounded-2xl opacity-30 blur-md animate-halo-pulse" />
          <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 rounded-2xl opacity-50" />
        </>
      )}
      {/* Gradient overlay on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${agent.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

      <div className="relative flex flex-col items-center text-center">
        {/* Avatar with footprint decoration for dinos */}
        <div className="relative">
          <div
            className={`${sizeClasses[size]} rounded-2xl flex items-center justify-center bg-gradient-to-br ${agent.gradient} shadow-lg mb-3 relative z-10`}
          >
            <span className="drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">{agent.emoji}</span>
          </div>
          {/* Dinosaur footprint claw marks */}
          {agent.emoji.includes('🦖') || agent.emoji.includes('🦕') ? (
            <div className="absolute -bottom-1 -right-2 text-2xl opacity-60 rotate-12">🐾</div>
          ) : null}
        </div>

        {/* Name & Badge */}
        <div className="flex items-center gap-2 mb-1">
          <h3 className={`font-black text-white tracking-tight ${size === "large" ? "text-xl" : size === "normal" ? "text-lg" : "text-base"}`}>
            {agent.name}
          </h3>
          {isMaster && (
            <span className="text-[10px] px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-full font-mono uppercase tracking-wider border border-amber-500/30">
              Master
            </span>
          )}
          {isMain && (
            <span className="text-[10px] px-2 py-0.5 bg-[#0066ff]/20 text-[#00ffff] rounded-full font-mono uppercase tracking-wider">
              Main
            </span>
          )}
        </div>

        {/* Role */}
        <p className={`text-[#8a8a95] font-medium mb-2 ${size === "small" ? "text-xs" : "text-sm"}`}>
          {agent.role}
        </p>

        {/* Description - only for large/normal */}
        {size !== "small" && (
          <p className={`text-[#f0f0f5] mb-3 leading-relaxed ${size === "large" ? "text-sm" : "text-xs"}`}>
            {agent.description}
          </p>
        )}

        {/* Status & Device */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div
              className={`w-2 h-2 rounded-full ${
                agent.status === "online"
                  ? "bg-[#00ffff] animate-pulse shadow-lg shadow-[#00ffff]/50"
                  : "bg-gray-500"
              }`}
            />
            <span className={`text-[#8a8a95] font-mono uppercase ${size === "small" ? "text-[10px]" : "text-xs"}`}>
              {agent.status}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[#8a8a95]">
            <Laptop size={size === "small" ? 10 : 12} />
            <span className={`font-mono ${size === "small" ? "text-[10px]" : "text-xs"}`}>{agent.device}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Energy Pulse Connector Component - Jarvis style
function Connector({ direction = "vertical" }: { direction?: "vertical" | "horizontal" | "branch" }) {
  if (direction === "vertical") {
    return (
      <div className="flex flex-col items-center relative">
        {/* Energy beam with pulse */}
        <div className="w-1 h-8 bg-gradient-to-b from-cyan-400/30 via-cyan-400/60 to-cyan-400/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-300 to-transparent animate-energy-pulse" />
        </div>
        {/* Glowing node */}
        <div className="w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.8),0_0_40px_rgba(34,211,238,0.4)] animate-pulse-glow relative z-10">
          <div className="absolute inset-1 rounded-full bg-white/80" />
        </div>
        <div className="w-1 h-8 bg-gradient-to-b from-cyan-400/60 via-cyan-400/30 to-transparent relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-300 to-transparent animate-energy-pulse-reverse" />
        </div>
      </div>
    );
  }

  if (direction === "horizontal") {
    return (
      <div className="flex items-center justify-center">
        <div className="w-8 h-1 bg-gradient-to-r from-cyan-400/30 via-cyan-400/60 to-cyan-400/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-300 to-transparent animate-energy-pulse" />
        </div>
        <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.6)] animate-pulse" />
        <div className="w-8 h-1 bg-gradient-to-r from-cyan-400/60 via-cyan-400/30 to-cyan-400/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 to-transparent animate-energy-pulse-reverse" />
        </div>
      </div>
    );
  }

  // Branch connector for multiple agents - Energy circuit style
  return (
    <div className="flex flex-col items-center w-full relative">
      <div className="w-1 h-6 bg-gradient-to-b from-cyan-400/50 to-cyan-400/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-300 to-transparent animate-energy-pulse" />
      </div>
      <div className="relative w-full max-w-3xl flex justify-center">
        {/* Central power node */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-cyan-400 shadow-[0_0_25px_rgba(34,211,238,1),0_0_50px_rgba(34,211,238,0.5)] animate-pulse-glow z-20">
          <div className="absolute inset-1 rounded-full bg-white" />
        </div>
        <svg className="w-full h-10" viewBox="0 0 800 40" preserveAspectRatio="none">
          <defs>
            <linearGradient id="energyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.3" />
            </linearGradient>
            <filter id="energyGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          {/* Center vertical - thicker energy line */}
          <line x1="400" y1="0" x2="400" y2="20" stroke="url(#energyGradient)" strokeWidth="3" filter="url(#energyGlow)" />
          {/* Horizontal energy circuit */}
          <line x1="100" y1="20" x2="700" y2="20" stroke="url(#energyGradient)" strokeWidth="2" filter="url(#energyGlow)" />
          {/* Vertical drops with energy flow */}
          <line x1="100" y1="20" x2="100" y2="40" stroke="#22d3ee" strokeWidth="2" opacity="0.7" filter="url(#energyGlow)">
            <animate attributeName="stroke-opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
          </line>
          <line x1="300" y1="20" x2="300" y2="40" stroke="#22d3ee" strokeWidth="2" opacity="0.7" filter="url(#energyGlow)">
            <animate attributeName="stroke-opacity" values="0.4;1;0.4" dur="2s" begin="0.5s" repeatCount="indefinite" />
          </line>
          <line x1="500" y1="20" x2="500" y2="40" stroke="#22d3ee" strokeWidth="2" opacity="0.7" filter="url(#energyGlow)">
            <animate attributeName="stroke-opacity" values="0.4;1;0.4" dur="2s" begin="1s" repeatCount="indefinite" />
          </line>
          <line x1="700" y1="20" x2="700" y2="40" stroke="#22d3ee" strokeWidth="2" opacity="0.7" filter="url(#energyGlow)">
            <animate attributeName="stroke-opacity" values="0.4;1;0.4" dur="2s" begin="1.5s" repeatCount="indefinite" />
          </line>
          {/* Energy nodes */}
          <circle cx="100" cy="20" r="4" fill="#22d3ee" filter="url(#energyGlow)">
            <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="300" cy="20" r="4" fill="#22d3ee" filter="url(#energyGlow)">
            <animate attributeName="r" values="3;5;3" dur="2s" begin="0.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="500" cy="20" r="4" fill="#22d3ee" filter="url(#energyGlow)">
            <animate attributeName="r" values="3;5;3" dur="2s" begin="1s" repeatCount="indefinite" />
          </circle>
          <circle cx="700" cy="20" r="4" fill="#22d3ee" filter="url(#energyGlow)">
            <animate attributeName="r" values="3;5;3" dur="2s" begin="1.5s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>
    </div>
  );
}

export default function Team() {
  return (
    <div className="p-8 min-h-screen relative">
      {/* Deep space background */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0d1117] to-[#0a0a12] -z-10" />
      
      {/* Star particles background */}
      <StarParticles />
      
      {/* Nebula glow effects */}
      <NebulaGlow />
      <header className="mb-8">
        <h1 className="text-4xl font-black text-white mb-2 tracking-tighter">Team</h1>
        <p className="text-[#8a8a95]">DinoSquad - Five specialized AI agents working together to execute missions.</p>
      </header>

      {/* Mission Statement - Space Command Style */}
      <div className="bg-gradient-to-r from-slate-900/80 via-blue-900/20 to-slate-900/80 border border-cyan-500/30 rounded-2xl p-8 mb-12 relative overflow-hidden backdrop-blur-sm">
        {/* Scan line effect */}
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(6,182,212,0.03)_50%)] bg-[length:100%_4px] pointer-events-none" />
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-cyan-400/50 rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-cyan-400/50 rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-cyan-400/50 rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-cyan-400/50 rounded-br-lg" />
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-cyan-500/20 rounded-lg border border-cyan-400/30">
              <Rocket size={24} className="text-cyan-400" />
            </div>
            <div>
              <h2 className="text-sm font-mono text-cyan-400 uppercase tracking-widest">Mission Directive</h2>
              <h3 className="text-lg font-bold text-white">Operation: Autonomous Organization</h3>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Star size={16} className="text-amber-400 animate-pulse" />
              <span className="text-xs font-mono text-amber-400">PRIORITY: ALPHA</span>
            </div>
          </div>
          
          <div className="border-l-2 border-cyan-400/50 pl-6 py-2">
            <p className="text-2xl text-white font-light leading-relaxed tracking-wide">
              <span className="text-cyan-400 font-mono">&gt;</span> {mission}
            </p>
          </div>
          
          <div className="mt-4 flex items-center gap-4 text-xs font-mono text-cyan-400/60">
            <span className="flex items-center gap-1">
              <Sparkles size={12} />
              STATUS: ACTIVE
            </span>
            <span>|</span>
            <span>CYCLE: 24/7</span>
            <span>|</span>
            <span>AGENTS: ONLINE</span>
          </div>
        </div>
      </div>

      {/* Hierarchy Visualization */}
      <div className="max-w-5xl mx-auto">
        {/* Level 1: Master - Enhanced golden crown */}
        <div className="flex justify-center mb-2">
          <div className="relative">
            {/* Crown icon above master */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-3xl animate-float">
              👑
            </div>
            <AgentCard agent={hierarchy.master} size="large" isMaster={true} />
          </div>
        </div>

        {/* Connector: Master -> Rex */}
        <Connector direction="vertical" />

        {/* Level 2: Rex (Main Agent) */}
        <div className="flex justify-center mb-2">
          <div className="relative">
            {/* Dino footprints leading to Rex */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex gap-2 opacity-40">
              <span className="text-lg">🐾</span>
            </div>
            <AgentCard agent={hierarchy.rex} size="large" />
          </div>
        </div>

        {/* Connector: Rex -> Agents - Energy Circuit Style */}
        <div className="mb-4">
          <Connector direction="branch" />
        </div>

        {/* Level 3: Other Agents */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {hierarchy.agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} size="normal" />
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-12 max-w-3xl mx-auto">
        <div className="bg-[#15151a] border border-[#0066ff]/20 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Users size={18} className="text-[#00ffff]" />
            Hierarchy Legend
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600" />
              <div>
                <p className="text-white font-medium text-sm">Master</p>
                <p className="text-[#8a8a95] text-xs">The architect & owner</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#0066ff] to-[#00ffff]" />
              <div>
                <p className="text-white font-medium text-sm">Main Agent</p>
                <p className="text-[#8a8a95] text-xs">Coordinator & manager</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
              <div>
                <p className="text-white font-medium text-sm">Sub Agents</p>
                <p className="text-[#8a8a95] text-xs">Specialized workers</p>
              </div>
            </div>
          </div>
          
          {/* API Limit Note */}
          <div className="mt-4 pt-4 border-t border-[#0066ff]/10">
            <p className="text-[#8a8a95] text-xs flex items-center gap-2">
              <span className="text-[#FFB800]">⚠️</span>
              Note: Max 3 agents can be called simultaneously via API.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
