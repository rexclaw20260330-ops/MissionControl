"use client";

import { useState, useEffect } from "react";
import { Target, Users, ChevronRight, X, Rocket, Code, Palette, Search, Brain, Plus } from "lucide-react";
import { getMissions, createMission, updateMissionProgress, Mission, MissionInsert } from "@/lib/db-actions";

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

export default function MissionsPage() {
  const [projects, setProjects] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Mission | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState<Partial<MissionInsert>>({
    name: "",
    description: "",
    responsible_agent: "rex",
    participating_agents: [],
    status: "planning",
    priority: "medium",
    progress: 0,
  });

  useEffect(() => {
    loadMissions();
  }, []);

  const loadMissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMissions();
      setProjects(data);
    } catch (err) {
      setError("Failed to load missions from database");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name || !newProject.responsible_agent) return;
    
    try {
      await createMission(newProject as MissionInsert);
      setIsModalOpen(false);
      setNewProject({
        name: "",
        description: "",
        responsible_agent: "rex",
        participating_agents: [],
        status: "planning",
        priority: "medium",
        progress: 0,
      });
      await loadMissions();
    } catch (err) {
      console.error("Failed to create mission:", err);
      alert("Failed to create mission");
    }
  };

  const handleProgressUpdate = async (id: string, progress: number) => {
    try {
      await updateMissionProgress(id, progress);
      await loadMissions();
    } catch (err) {
      console.error("Failed to update progress:", err);
    }
  };

  const openDrawer = (project: Mission) => {
    setSelectedProject(project);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedProject(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-emerald-400";
      case "completed":
        return "text-blue-400";
      case "planning":
        return "text-amber-400";
      case "on-hold":
        return "text-rose-400";
      default:
        return "text-gray-400";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-rose-500/20 text-rose-400 border-rose-500/50";
      case "high":
        return "bg-amber-500/20 text-amber-400 border-amber-500/50";
      case "medium":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No deadline";
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D1117] text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-[#00F5FF] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-[#8a8a95]">Loading missions from database...</p>
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
            onClick={loadMissions}
            className="px-4 py-2 bg-[#0066ff] rounded-lg hover:bg-[#0055cc] transition-colors"
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
      <header className="p-6 border-b border-[#0066ff]/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#161B22] rounded-xl border border-white/10">
              <Target className="text-[#00F5FF]" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">Missionboard</h1>
              <p className="text-sm text-[#8a8a95]">{projects.length} active missions</p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0066ff] to-[#00ffff] rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            <Plus size={18} />
            New Mission
          </button>
        </div>
      </header>

      {/* Mission List */}
      <main className="p-6">
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#8a8a95] mb-4">No missions yet. Create your first mission!</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-[#0066ff] rounded-lg hover:bg-[#0055cc] transition-colors"
            >
              Create Mission
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {projects.map((project) => {
              const responsible = agents[project.responsible_agent as AgentId];
              return (
                <div
                  key={project.id}
                  onClick={() => openDrawer(project)}
                  className="group bg-[#161B22] border border-white/5 rounded-xl p-5 cursor-pointer hover:border-[#00F5FF]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#0066ff]/10"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-white group-hover:text-[#00F5FF] transition-colors">
                          {project.name}
                        </h3>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getPriorityColor(project.priority)}`}>
                          {project.priority}
                        </span>
                      </div>
                      <p className="text-sm text-[#8a8a95] mb-4">{project.description}</p>
                      
                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-[#8a8a95]">Progress</span>
                          <span className="text-white font-medium">{project.progress}%</span>
                        </div>
                        <div className="h-2 bg-[#0D1117] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#0066ff] to-[#00ffff] rounded-full transition-all duration-500"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Agents */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#8a8a95]">Lead:</span>
                          {responsible && (
                            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gradient-to-r ${responsible.gradient} ${responsible.borderColor} border`}>
                              {responsible.icon}
                              <span className="text-xs font-medium text-white">{responsible.name}</span>
                            </div>
                          )}
                        </div>
                        {project.participating_agents?.length > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-[#8a8a95]">Team:</span>
                            <div className="flex -space-x-1">
                              {project.participating_agents.map((agentId) => {
                                const agent = agents[agentId as AgentId];
                                if (!agent) return null;
                                return (
                                  <div
                                    key={agentId}
                                    className={`w-6 h-6 rounded-full bg-gradient-to-br ${agent.gradient} flex items-center justify-center text-xs border-2 border-[#161B22]`}
                                    title={agent.name}
                                  >
                                    {agent.emoji}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="text-[#8a8a95] group-hover:text-white transition-colors" size={20} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Create Mission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#161B22] border border-white/10 rounded-2xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">New Mission</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-[#8a8a95] hover:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateMission} className="space-y-4">
              <div>
                <label className="block text-sm text-[#8a8a95] mb-1">Mission Name</label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0D1117] border border-white/10 rounded-lg text-white focus:border-[#00F5FF] focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-[#8a8a95] mb-1">Description</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0D1117] border border-white/10 rounded-lg text-white focus:border-[#00F5FF] focus:outline-none"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#8a8a95] mb-1">Responsible Agent</label>
                  <select
                    value={newProject.responsible_agent}
                    onChange={(e) => setNewProject({ ...newProject, responsible_agent: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0D1117] border border-white/10 rounded-lg text-white focus:border-[#00F5FF] focus:outline-none"
                  >
                    {Object.values(agents).map((agent) => (
                      <option key={agent.id} value={agent.id}>{agent.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-[#8a8a95] mb-1">Priority</label>
                  <select
                    value={newProject.priority}
                    onChange={(e) => setNewProject({ ...newProject, priority: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0D1117] border border-white/10 rounded-lg text-white focus:border-[#00F5FF] focus:outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-[#8a8a95] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-[#0066ff] to-[#00ffff] rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  Create Mission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Drawer */}
      {isDrawerOpen && selectedProject && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeDrawer} />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-[#161B22] border-l border-[#0066ff]/20 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Mission Details</h2>
              <button onClick={closeDrawer} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold mb-2">{selectedProject.name}</h3>
                <p className="text-[#8a8a95]">{selectedProject.description}</p>
              </div>

              <div>
                <label className="block text-sm text-[#8a8a95] mb-2">Progress</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={selectedProject.progress}
                    onChange={(e) => handleProgressUpdate(selectedProject.id, parseInt(e.target.value))}
                    className="flex-1 h-2 bg-[#0D1117] rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-white font-medium w-12">{selectedProject.progress}%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#8a8a95] mb-2">Status</label>
                <p className={`font-medium ${getStatusColor(selectedProject.status)}`}>
                  {selectedProject.status.charAt(0).toUpperCase() + selectedProject.status.slice(1)}
                </p>
              </div>

              <div>
                <label className="block text-sm text-[#8a8a95] mb-2">Priority</label>
                <span className={`inline-block px-2 py-1 text-sm font-medium rounded-full border ${getPriorityColor(selectedProject.priority)}`}>
                  {selectedProject.priority}
                </span>
              </div>

              <div>
                <label className="block text-sm text-[#8a8a95] mb-2">Responsible Agent</label>
                {agents[selectedProject.responsible_agent as AgentId] && (
                  <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r ${agents[selectedProject.responsible_agent as AgentId].gradient} ${agents[selectedProject.responsible_agent as AgentId].borderColor} border`}>
                    {agents[selectedProject.responsible_agent as AgentId].icon}
                    <span className="font-medium">{agents[selectedProject.responsible_agent as AgentId].name}</span>
                  </div>
                )}
              </div>

              {selectedProject.deadline && (
                <div>
                  <label className="block text-sm text-[#8a8a95] mb-2">Deadline</label>
                  <p className="text-white">{formatDate(selectedProject.deadline)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
