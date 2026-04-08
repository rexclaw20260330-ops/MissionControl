"use client";

import { useState, useEffect, useCallback } from "react";
import { Target, Users, ChevronRight, X, Rocket, Code, Palette, Search, Brain, Plus, Loader2, AlertCircle, Trash2, Pencil } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getMissions, createMission, updateMission, updateMissionProgress, deleteMission, Mission, MissionInsert, MissionUpdate } from "@/lib/db-actions";

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

// Map database Mission to UI Project
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

// Default agent assignments - can be configured
const getDefaultAgent = (): AgentId => "rex";
const getDefaultTeam = (): AgentId[] => [];

// Convert database Mission to UI Project
const missionToProject = (mission: Mission): Project => {
  return {
    id: mission.id,
    name: mission.name,
    description: mission.description || "",
    responsibleAgent: (mission.responsible_agent as AgentId) || getDefaultAgent(),
    participatingAgents: (mission.participating_agents as AgentId[]) || getDefaultTeam(),
    status: mission.status,
    progress: mission.progress,
    priority: mission.priority,
    createdAt: mission.created_at ? new Date(mission.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    deadline: mission.deadline ? new Date(mission.deadline).toISOString().split('T')[0] : undefined,
  };
};

// Convert UI Project to database MissionInsert
const projectToMissionInsert = (project: Omit<Project, "id" | "createdAt">): MissionInsert => {
  return {
    name: project.name,
    description: project.description || undefined,
    responsible_agent: project.responsibleAgent,
    participating_agents: project.participatingAgents,
    status: project.status,
    progress: project.progress,
    priority: project.priority,
    deadline: project.deadline || undefined,
  };
};

const statusConfig = {
  planning: { label: "Planning", color: "text-gray-400", bg: "bg-gray-500/20", border: "border-gray-500/30" },
  active: { label: "Active", color: "text-[#00ffff]", bg: "bg-[#00ffff]/20", border: "border-[#00ffff]/30" },
  completed: { label: "Completed", color: "text-emerald-400", bg: "bg-emerald-500/20", border: "border-emerald-500/30" },
  "on-hold": { label: "On Hold", color: "text-amber-400", bg: "bg-amber-500/20", border: "border-amber-500/30" },
};

const priorityConfig = {
  low: { color: "text-gray-400", dot: "bg-gray-400" },
  medium: { color: "text-[#00ffff]", dot: "bg-[#00ffff]" },
  high: { color: "text-[#FFB800]", dot: "bg-[#FFB800]" },
  critical: { color: "text-rose-400", dot: "bg-rose-400" },
};

// Create Mission Modal
interface CreateMissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (mission: Omit<Project, "id" | "createdAt">) => void;
}

function CreateMissionModal({ isOpen, onClose, onSubmit }: CreateMissionModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    responsibleAgent: getDefaultAgent(),
    participatingAgents: [] as AgentId[],
    status: "planning" as "planning" | "active" | "completed" | "on-hold",
    progress: 0,
    priority: "medium" as "low" | "medium" | "high" | "critical",
    deadline: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
    // Reset form
    setFormData({
      name: "",
      description: "",
      responsibleAgent: "rex",
      participatingAgents: ["mosa"],
      status: "planning",
      progress: 0,
      priority: "medium",
      deadline: "",
    });
  };

  const toggleAgent = (agentId: AgentId) => {
    setFormData(prev => ({
      ...prev,
      participatingAgents: prev.participatingAgents.includes(agentId)
        ? prev.participatingAgents.filter(id => id !== agentId)
        : [...prev.participatingAgents, agentId]
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-[#161B22] rounded-xl border border-white/10 shadow-2xl">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Plus size={20} className="text-[#00F5FF]" />
              Create New Mission
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Mission Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#0D1117] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-[#00F5FF] focus:outline-none transition-colors"
              placeholder="Enter mission name..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#0D1117] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-[#00F5FF] focus:outline-none transition-colors resize-none"
              placeholder="Describe the mission..."
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as typeof formData.status })}
                className="w-full bg-[#0D1117] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-[#00F5FF] focus:outline-none transition-colors"
              >
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="on-hold">On Hold</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as typeof formData.priority })}
                className="w-full bg-[#0D1117] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-[#00F5FF] focus:outline-none transition-colors"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Initial Progress: {formData.progress}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.progress}
              onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })}
              className="w-full accent-[#00F5FF]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Deadline</label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full bg-[#0D1117] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-[#00F5FF] focus:outline-none transition-colors"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Team Members</label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(agents) as AgentId[]).map((agentId) => {
                const agent = agents[agentId];
                const isSelected = formData.participatingAgents.includes(agentId);
                return (
                  <button
                    key={agentId}
                    type="button"
                    onClick={() => toggleAgent(agentId)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                      isSelected
                        ? `${agent.borderColor} bg-gradient-to-r ${agent.gradient} bg-opacity-10`
                        : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    <span>{agent.emoji}</span>
                    <span className={`text-sm ${isSelected ? "text-white" : "text-gray-400"}`}>{agent.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-lg bg-[#00F5FF] text-[#0D1117] font-bold hover:bg-[#00F5FF]/90 transition-colors"
            >
              Create Mission
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Update Progress Modal
interface UpdateProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (progress: number) => void;
  currentProgress: number;
  missionName: string;
}

function UpdateProgressModal({ isOpen, onClose, onSubmit, currentProgress, missionName }: UpdateProgressModalProps) {
  const [progress, setProgress] = useState(currentProgress);

  useEffect(() => {
    setProgress(currentProgress);
  }, [currentProgress, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(progress);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#161B22] rounded-xl border border-white/10 shadow-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-2">Update Progress</h2>
        <p className="text-gray-400 mb-6">{missionName}</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Progress</span>
              <span className="text-[#00F5FF] font-bold">{progress}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(parseInt(e.target.value))}
              className="w-full accent-[#00F5FF]"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-lg bg-[#00F5FF] text-[#0D1117] font-bold hover:bg-[#00F5FF]/90 transition-colors"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Edit Mission Modal
interface EditMissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, updates: Partial<Mission>) => void;
  mission: Project | null;
}

function EditMissionModal({ isOpen, onClose, onSubmit, mission }: EditMissionModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    responsibleAgent: "rex" as AgentId,
    participatingAgents: [] as AgentId[],
    status: "planning" as "planning" | "active" | "completed" | "on-hold",
    progress: 0,
    priority: "medium" as "low" | "medium" | "high" | "critical",
    deadline: "",
  });

  useEffect(() => {
    if (mission) {
      console.log('Mission data loaded:', mission);
      setFormData({
        name: mission.name || "",
        description: mission.description || "",
        responsibleAgent: mission.responsibleAgent || "rex",
        participatingAgents: mission.participatingAgents || [],
        status: mission.status || "planning",
        progress: typeof mission.progress === 'number' ? mission.progress : 0,
        priority: mission.priority || "medium",
        deadline: mission.deadline || "",
      });
    }
  }, [mission]);

  if (!isOpen || !mission) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updates = {
      name: formData.name,
      description: formData.description || null,
      responsible_agent: formData.responsibleAgent,
      participating_agents: formData.participatingAgents,
      status: formData.status,
      progress: formData.progress,
      priority: formData.priority,
      deadline: formData.deadline || null,
    };
    
    console.log('Form data before submit:', formData);
    console.log('Submitting updates:', JSON.stringify(updates, null, 2));
    
    onSubmit(mission.id, updates);
    onClose();
  };

  const toggleAgent = (agentId: AgentId) => {
    setFormData(prev => ({
      ...prev,
      participatingAgents: prev.participatingAgents.includes(agentId)
        ? prev.participatingAgents.filter(id => id !== agentId)
        : [...prev.participatingAgents, agentId]
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-[#161B22] rounded-xl border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Pencil size={20} className="text-[#00F5FF]" />
              Edit Mission
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Mission Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#0D1117] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-[#00F5FF] focus:outline-none transition-colors"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#0D1117] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-[#00F5FF] focus:outline-none transition-colors resize-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Responsible Agent</label>
            <select
              value={formData.responsibleAgent}
              onChange={(e) => setFormData({ ...formData, responsibleAgent: e.target.value as AgentId })}
              className="w-full bg-[#0D1117] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-[#00F5FF] focus:outline-none transition-colors"
            >
              {(Object.keys(agents) as AgentId[]).map((agentId) => (
                <option key={agentId} value={agentId}>{agents[agentId].name} {agents[agentId].emoji}</option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as typeof formData.status })}
                className="w-full bg-[#0D1117] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-[#00F5FF] focus:outline-none transition-colors"
              >
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="on-hold">On Hold</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as typeof formData.priority })}
                className="w-full bg-[#0D1117] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-[#00F5FF] focus:outline-none transition-colors"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Progress: {formData.progress}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.progress}
              onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })}
              className="w-full accent-[#00F5FF]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Deadline</label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full bg-[#0D1117] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-[#00F5FF] focus:outline-none transition-colors"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Participating Agents</label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(agents) as AgentId[]).map((agentId) => {
                const agent = agents[agentId];
                const isSelected = formData.participatingAgents.includes(agentId);
                return (
                  <button
                    key={agentId}
                    type="button"
                    onClick={() => toggleAgent(agentId)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                      isSelected
                        ? `${agent.borderColor} bg-gradient-to-r ${agent.gradient} bg-opacity-10`
                        : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    <span>{agent.emoji}</span>
                    <span className={`text-sm ${isSelected ? "text-white" : "text-gray-400"}`}>{agent.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-lg bg-[#00F5FF] text-[#0D1117] font-bold hover:bg-[#00F5FF]/90 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Missionboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fetch missions from Supabase
  const fetchMissions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const missions = await getMissions();
      const mappedProjects = missions.map(missionToProject);
      setProjects(mappedProjects);
    } catch (err: any) {
      setError(err.message || "Failed to load missions. Please try again.");
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load missions on mount
  useEffect(() => {
    fetchMissions();
  }, [fetchMissions]);

  // Create new mission
  const handleCreateMission = async (projectData: Omit<Project, "id" | "createdAt">) => {
    try {
      const missionData = projectToMissionInsert(projectData);
      await createMission(missionData);
      fetchMissions();
    } catch (err: any) {
      setError(err.message || "Failed to create mission. Please try again.");
    }
  };

  // Update mission progress
  const handleUpdateProgress = async (progress: number) => {
    if (!selectedProject) return;
    
    try {
      await updateMissionProgress(selectedProject.id, progress);
      fetchMissions();
    } catch (err: any) {
      setError(err.message || "Failed to update progress. Please try again.");
    }
  };

  // Delete mission
  const handleDeleteMission = async () => {
    if (!selectedProject) return;
    
    try {
      await deleteMission(selectedProject.id);
      setSelectedProject(null);
      fetchMissions();
    } catch (err: any) {
      setError(err.message || "Failed to delete mission. Please try again.");
    }
  };

  // Edit mission
  const handleEditMission = async (id: string, updates: any) => {
    try {
      console.log('Updates received:', updates);
      
      // Ensure status and priority are included if they exist
      const missionUpdate: any = {};
      
      if ('name' in updates) missionUpdate.name = updates.name;
      if ('description' in updates) missionUpdate.description = updates.description;
      if ('responsible_agent' in updates) missionUpdate.responsible_agent = updates.responsible_agent;
      if ('participating_agents' in updates) missionUpdate.participating_agents = updates.participating_agents;
      if ('status' in updates) missionUpdate.status = updates.status;
      if ('progress' in updates) missionUpdate.progress = updates.progress;
      if ('priority' in updates) missionUpdate.priority = updates.priority;
      if ('deadline' in updates) missionUpdate.deadline = updates.deadline;
      
      console.log('Sending to Supabase:', missionUpdate);
      
      const { data, error } = await supabase
        .from('missions')
        .update(missionUpdate)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Update result:', data);
      fetchMissions();
    } catch (err: any) {
      console.error('Update mission error:', err);
      setError(err.message || "Failed to update mission. Please try again.");
    }
  };

  // Cycle priority (low -> medium -> high -> critical -> low)
  const handleCyclePriority = async (project: Project) => {
    const priorityOrder: Array<"low" | "medium" | "high" | "critical"> = ["low", "medium", "high", "critical"];
    const currentIndex = priorityOrder.indexOf(project.priority);
    const nextPriority = priorityOrder[(currentIndex + 1) % priorityOrder.length];
    
    try {
      await updateMission(project.id, { priority: nextPriority });
      fetchMissions();
    } catch (err: any) {
      setError(err.message || "Failed to update priority. Please try again.");
    }
  };

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
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="ml-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00F5FF] text-[#0D1117] font-bold hover:bg-[#00F5FF]/90 transition-colors"
            >
              <Plus size={18} />
              New Mission
            </button>
          </div>
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="mx-8 mt-4 p-4 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center gap-3">
          <AlertCircle className="text-rose-400" size={20} />
          <p className="text-rose-200">{error}</p>
          <button 
            onClick={() => setError(null)}
            className="ml-auto text-rose-400 hover:text-rose-300"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="p-8">
        {isLoading ? (
          <div className="flex h-96 items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-[#00F5FF]" />
              <p className="text-[#8a8a95]">Loading missions...</p>
            </div>
          </div>
        ) : projects.length === 0 ? (
          <div className="flex h-96 flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full bg-[#161B22] flex items-center justify-center mb-4 border border-white/10">
              <Target className="text-[#8a8a95]" size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No missions yet</h3>
            <p className="text-[#8a8a95] mb-6">Create your first mission to get started</p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[#00F5FF] text-[#0D1117] font-bold hover:bg-[#00F5FF]/90 transition-colors"
            >
              <Plus size={18} />
              Create Mission
            </button>
          </div>
        ) : (
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
                      <div className="flex items-center gap-2">
                        {/* Edit Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProject(project);
                            setIsEditModalOpen(true);
                          }}
                          className="p-2 bg-[#1e1e2a] text-[#00F5FF] rounded-lg hover:bg-[#00F5FF]/20 border border-[#00F5FF]/30 transition-colors"
                          title="Edit mission"
                        >
                          <Pencil size={16} />
                        </button>
                        
                        {/* Priority Badge - Clickable */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCyclePriority(project);
                          }}
                          className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#1e1e2a] border border-white/10 hover:border-white/30 transition-colors"
                          title="Click to change priority"
                        >
                          <div className={`w-2 h-2 rounded-full ${priority.dot}`} />
                          <span className={`text-xs font-medium ${priority.color}`}>{project.priority}</span>
                        </button>
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
                    <div 
                      className="h-2 bg-[#0D1117] rounded-full overflow-hidden cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProject(project);
                        setIsProgressModalOpen(true);
                      }}
                    >
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
        )}
      </main>

      {/* Create Mission Modal */}
      <CreateMissionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateMission}
      />

      {/* Update Progress Modal */}
      <UpdateProgressModal
        isOpen={isProgressModalOpen}
        onClose={() => {
          setIsProgressModalOpen(false);
          setSelectedProject(null);
        }}
        onSubmit={handleUpdateProgress}
        currentProgress={selectedProject?.progress || 0}
        missionName={selectedProject?.name || ""}
      />

      {/* Slide-out Drawer */}
      {selectedProject && !isProgressModalOpen && (
        <div className="fixed inset-0 z-40">
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
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleDeleteMission}
                    className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Delete mission"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button 
                    onClick={() => setSelectedProject(null)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-[#8a8a95] hover:text-white"
                  >
                    <X size={20} />
                  </button>
                </div>
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
                        <div 
                          className="h-3 bg-[#161B22] rounded-full overflow-hidden cursor-pointer"
                          onClick={() => setIsProgressModalOpen(true)}
                        >
                          <div 
                            className={`h-full rounded-full bg-gradient-to-r ${responsible.gradient}`}
                            style={{ width: `${selectedProject.progress}%` }}
                          />
                        </div>
                        <button
                          onClick={() => setIsProgressModalOpen(true)}
                          className="mt-2 text-sm text-[#00F5FF] hover:underline"
                        >
                          Update progress
                        </button>
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
                <button 
                  onClick={() => setIsProgressModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 bg-[#00F5FF] hover:bg-[#00F5FF]/90 text-[#0D1117] font-bold py-3 rounded-lg transition-colors"
                >
                  Update Progress
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Mission Modal */}
      <EditMissionModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProject(null);
        }}
        onSubmit={handleEditMission}
        mission={selectedProject}
      />
    </div>
  );
}
