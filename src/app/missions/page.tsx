"use client";

import { useState, useEffect } from "react";
import { Target, Users, ChevronRight, X, Rocket, Code, Palette, Search, Brain } from "lucide-react";
import { getMissions, createMission, Mission } from "@/lib/db-actions";

type AgentId = "rex" | "mosa" | "bronto" | "tricera" | "pteroda";

interface Agent {
  id: AgentId;
  name: string;
  role: string;
  emoji: string;
  gradient: string;
  borderColor: string;
  glowColor: string;
  icon: React.ReactNode;
}

interface Project {
  id: string;
  name: string;
  description: string;
  responsibleAgent: AgentId;
  participatingAgents: AgentId[];
  status: "planning" | "active" | "completed" | "on-hold";
  progress: number;
  priority: "low" | "medium" | "high" | "critical";
  createdAt: string;
  deadline?: string;
}

const agents: Record<AgentId, Agent> = {
  rex: {
    id: "rex",
    name: "Rex",
    role: "Commander",
    emoji: "🦖",
    gradient: "from-[#0066ff] to-[#00ffff]",
    borderColor: "border-[#00ffff]/50",
    glowColor: "shadow-[#00ffff]/30",
    icon: <Rocket size={14} />,
  },
  mosa: {
    id: "mosa",
    name: "Mosa",
    role: "Developer",
    emoji: "🐊",
    gradient: "from-rose-500 to-red-500",
    borderColor: "border-rose-500/50",
    glowColor: "shadow-rose-500/30",
    icon: <Code size={14} />,
  },
  bronto: {
    id: "bronto",
    name: "Bronto",
    role: "Strategist",
    emoji: "🦒",
    gradient: "from-emerald-500 to-teal-500",
    borderColor: "border-emerald-500/50",
    glowColor: "shadow-emerald-500/30",
    icon: <Brain size={14} />,
  },
  tricera: {
    id: "tricera",
    name: "Tricera",
    role: "Art Director",
    emoji: "🦕",
    gradient: "from-purple-500 to-pink-500",
    borderColor: "border-purple-500/50",
    glowColor: "shadow-purple-500/30",
    icon: <Palette size={14} />,
  },
  pteroda: {
    id: "pteroda",
    name: "Pteroda",
    role: "Researcher",
    emoji: "🦅",
    gradient: "from-amber-500 to-orange-500",
    borderColor: "border-amber-500/50",
    glowColor: "shadow-amber-500/30",
    icon: <Search size={14} />,
  },
};

const initialProjects: Project[] = [
  {
    id: "1",
    name: "Mission Control Platform",
    description: "Central command interface for AI agent coordination and task management. Real-time monitoring of all agent activities.",
    responsibleAgent: "rex",
    participatingAgents: ["mosa", "tricera"],
    status: "active",
    progress: 78,
    priority: "critical",
    createdAt: "2026-03-15",
    deadline: "2026-04-15",
  },
  {
    id: "2",
    name: "Jurassic Office Calendar",
    description: "Team scheduling system with agent-specific views and automated conflict resolution.",
    responsibleAgent: "tricera",
    participatingAgents: ["rex", "mosa"],
    status: "active",
    progress: 65,
    priority: "high",
    createdAt: "2026-03-20",
    deadline: "2026-04-10",
  },
  {
    id: "3",
    name: "Agent Communication Protocol",
    description: "Standardized messaging system for inter-agent communication with priority routing.",
    responsibleAgent: "mosa",
    participatingAgents: ["bronto", "pteroda"],
    status: "planning",
    progress: 25,
    priority: "medium",
    createdAt: "2026-04-01",
  },
  {
    id: "4",
    name: "Autonomous Research Pipeline",
    description: "Automated data gathering and analysis system for Pteroda's research tasks.",
    responsibleAgent: "pteroda",
    participatingAgents: ["bronto"],
    status: "active",
    progress: 45,
    priority: "medium",
    createdAt: "2026-03-25",
    deadline: "2026-04-20",
  },
  {
    id: "5",
    name: "Strategic Planning Framework",
    description: "Long-term goal decomposition and milestone tracking system.",
    responsibleAgent: "bronto",
    participatingAgents: ["rex"],
    status: "planning",
    progress: 15,
    priority: "high",
    createdAt: "2026-04-02",
  },
];

const statusConfig = {
  planning: { label: "Planning", color: "text-gray-400", bg: "bg-gray-500/20", border: "border-gray-500/30" },
  active: { label: "Active", color: "text-[#00ffff]", bg: "bg-[#00ffff]/20", border: "border-[#00ffff]/30" },
  completed: { label: "Completed", color: "text-emerald-400", bg: "bg-emerald-500/20", border: "border-emerald-500/30" },
  "on-hold": { label: "On Hold", labelV1: "On Hold", color: "text-amber-400", bg: "bg-amber-500/20", border: "border-amber-500/30" },
};

const priorityConfig = {
  low: { color: "text-gray-400", dot: "bg-gray-400" },
  medium: { color: "text-[#00ffff]", dot: "bg-[#00ffff]" },
  high: { color: "text-[#FFB800]", dot: "bg-[#FFB800]" },
  critical: { color: "text-rose-400", dot: "bg-rose-400" },
};

export default function Missionboard() {
  const [projects] = useState<Project[]>(initialProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  const getAgent = (id: AgentId) => agents[id];

  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      {/* Header */}
      <header className="px-8 py-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
              <Target className="text-[#00F5FF]" size={32} />
              Missionboard
            </h1>
            <p className="text-[#8a8a95] mt-1">Project coordination across the Jurassic Squad</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {(Object.values(agents) as Agent[]).map((agent) => (
                <div
                  key={agent.id}
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${agent.gradient} flex items-center justify-center border-2 border-[#0D1117] text-lg shadow-lg ${agent.glowColor}`}
                  title={agent.name}
                >
                  {agent.emoji}
                </div>
              ))}
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-right">
              <p className="text-2xl font-bold text-white">{projects.length}</p>
              <p className="text-xs text-[#8a8a95] uppercase tracking-wider">Active Missions</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => {
            const responsible = getAgent(project.responsibleAgent);
            const status = statusConfig[project.status];
            const priority = priorityConfig[project.priority];
            const isHovered = hoveredProject === project.id;

            return (
              <div
                key={project.id}
                className={`group relative bg-[#161B22] rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden
                  ${isHovered ? `${responsible.borderColor} shadow-lg ${responsible.glowColor}` : "border-white/10"}`}
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
                onClick={() => setSelectedProject(project)}
              >
                {/* Hover glow effect */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-br ${responsible.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                />

                {/* Card Header */}
                <div className="p-5 border-b border-white/5">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${status.bg} ${status.color} ${status.border}`}>
                      {status.label}
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <div className={`w-2 h-2 rounded-full ${priority.dot}`} />
                      <span className={priority.color}>{project.priority}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-[#00F5FF] transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-sm text-[#8a8a95] mt-1 line-clamp-2">{project.description}</p>
                </div>

                {/* Progress Bar */}
                <div className="px-5 py-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-[#8a8a95]">Progress</span>
                    <span className="font-bold text-white">{project.progress}%</span>
                  </div>
                  <div className="h-2 bg-[#0D1117] rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full bg-gradient-to-r ${responsible.gradient} transition-all duration-500`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Agent Assignment */}
                <div className="px-5 pb-5">
                  <div className="flex items-center justify-between">
                    {/* Responsible Agent */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#8a8a95]">Lead:</span>
                      <div 
                        className={`flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gradient-to-r ${responsible.gradient} bg-opacity-10 border ${responsible.borderColor}`}
                      >
                        <span>{responsible.emoji}</span>
                        <span className="text-xs font-medium text-white">{responsible.name}</span>
                      </div>
                    </div>

                    {/* Participating Agents */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#8a8a95]">Team:</span>
                      <div className="flex -space-x-1">
                        {project.participatingAgents.map((agentId) => {
                          const agent = getAgent(agentId);
                          return (
                            <div
                              key={agentId}
                              className={`w-6 h-6 rounded-full bg-gradient-to-br ${agent.gradient} flex items-center justify-center text-xs border border-[#161B22]`}
                              title={agent.name}
                            >
                              {agent.emoji}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover indicator */}
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${responsible.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
              </div>
            );
          })}
        </div>
      </main>

      {/* Slide-out Drawer */}
      {selectedProject && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedProject(null)}
          />
          
          {/* Drawer */}
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-[#0D1117] border-l border-white/10 shadow-2xl transform transition-transform animate-in slide-in-from-right">
            <div className="h-full flex flex-col">
              {/* Drawer Header */}
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Mission Details</h2>
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-[#8a8a95] hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {(() => {
                  const responsible = getAgent(selectedProject.responsibleAgent);
                  const status = statusConfig[selectedProject.status];
                  const priority = priorityConfig[selectedProject.priority];

                  return (
                    <>
                      {/* Status Badge */}
                      <div className="flex items-center gap-3 mb-6">
                        <div className={`px-4 py-1.5 rounded-full text-sm font-medium border ${status.bg} ${status.color} ${status.border}`}>
                          {status.label}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className={`w-2 h-2 rounded-full ${priority.dot}`} />
                          <span className={priority.color}>{selectedProject.priority} priority</span>
                        </div>
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-2xl font-bold text-white mb-3">{selectedProject.name}</h3>
                      <p className="text-[#8a8a95] leading-relaxed mb-6">{selectedProject.description}</p>

                      {/* Progress */}
                      <div className="mb-6">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-[#8a8a95]">Mission Progress</span>
                          <span className="font-bold text-white">{selectedProject.progress}%</span>
                        </div>
                        <div className="h-3 bg-[#161B22] rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full bg-gradient-to-r ${responsible.gradient}`}
                            style={{ width: `${selectedProject.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Timeline */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-[#161B22] rounded-lg p-4 border border-white/5">
                          <p className="text-xs text-[#8a8a95] uppercase tracking-wider mb-1">Created</p>
                          <p className="text-white font-medium">{selectedProject.createdAt}</p>
                        </div>
                        {selectedProject.deadline && (
                          <div className="bg-[#161B22] rounded-lg p-4 border border-white/5">
                            <p className="text-xs text-[#8a8a95] uppercase tracking-wider mb-1">Deadline</p>
                            <p className="text-white font-medium">{selectedProject.deadline}</p>
                          </div>
                        )}
                      </div>

                      {/* Responsible Agent */}
                      <div className="mb-6">
                        <p className="text-xs text-[#8a8a95] uppercase tracking-wider mb-3">Mission Commander</p>
                        <div className={`flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r ${responsible.gradient} bg-opacity-5 border ${responsible.borderColor}`}>
                          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${responsible.gradient} flex items-center justify-center text-2xl shadow-lg ${responsible.glowColor}`}>
                            {responsible.emoji}
                          </div>
                          <div>
                            <p className="font-bold text-white text-lg">{responsible.name}</p>
                            <p className="text-sm text-[#8a8a95]">{responsible.role}</p>
                          </div>
                        </div>
                      </div>

                      {/* Participating Agents */}
                      <div>
                        <p className="text-xs text-[#8a8a95] uppercase tracking-wider mb-3">Squad Members</p>
                        <div className="space-y-3">
                          {selectedProject.participatingAgents.map((agentId) => {
                            const agent = getAgent(agentId);
                            return (
                              <div 
                                key={agentId}
                                className="flex items-center gap-3 p-3 rounded-lg bg-[#161B22] border border-white/5 hover:border-white/10 transition-colors"
                              >
                                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${agent.gradient} flex items-center justify-center text-lg`}>
                                  {agent.emoji}
                                </div>
                                <div>
                                  <p className="font-medium text-white">{agent.name}</p>
                                  <p className="text-xs text-[#8a8a95]">{agent.role}</p>
                                </div>
                                <div className="ml-auto text-[#00F5FF]">
                                  {agent.icon}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Drawer Footer */}
              <div className="px-6 py-4 border-t border-white/10">
                <button className="w-full flex items-center justify-center gap-2 bg-[#00F5FF] hover:bg-[#00F5FF]/90 text-[#0D1117] font-bold py-3 rounded-lg transition-colors">
                  View Full Mission
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
