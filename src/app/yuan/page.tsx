"use client";

import { useState, useEffect } from "react";
import { Calendar, Target, Zap, Trophy, Crown, Activity, TrendingUp, Star, Plus, X } from "lucide-react";
import { getUserGoals, createGoal, updateGoalProgress, UserGoal, getUserSkills, createSkill, updateSkillLevel, UserSkill } from "@/lib/db-actions";

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
        fill="rgba(255, 215, 0, 0.2)"
        stroke="#FFD700"
        strokeWidth="2"
      />
      {skills.map((skill, i) => {
        const point = skillPoints[i];
        return (
          <g key={skill.id}>
            <circle cx={point.x} cy={point.y} r="4" fill="#FFD700" />
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

export default function YuanPage() {
  const [goals, setGoals] = useState<UserGoal[]>([]);
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: "", category: "", progress: 0 });
  const [newSkill, setNewSkill] = useState({ skill_name: "", level: 0 });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [goalsData, skillsData] = await Promise.all([
        getUserGoals(),
        getUserSkills(),
      ]);
      setGoals(goalsData);
      setSkills(skillsData);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050508] text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-[#FFD700] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-[#8a8a95]">Loading your data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#050508] text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-rose-400 mb-2">Error: {error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-[#FFD700] text-black rounded-lg hover:bg-[#E6C200] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050508] text-white">
      {/* Header */}
      <header className="p-6 border-b border-[#FFD700]/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#121218] rounded-xl border border-[#FFD700]/30">
              <Crown className="text-[#FFD700]" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">Yuan&apos;s Sanctum</h1>
              <p className="text-sm text-[#8a8a95]">Your personal command center</p>
            </div>
          </div>
        </div>
      </header>

      <main className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Yuan's Calendar */}
            <div className="bg-[#121218] border border-[#FFD700]/20 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="text-[#FFD700]" size={20} />
                <h2 className="text-lg font-bold">Yuan&apos;s Calendar</h2>
              </div>
              
              <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
                  <div key={day} className="text-[#8a8a95] py-2">{day}</div>
                ))}
                {generateCalendarDays().map((date) => (
                  <div
                    key={date.day}
                    className={`py-2 rounded-lg cursor-pointer transition-colors ${
                      date.isToday
                        ? "bg-[#FFD700] text-black font-bold"
                        : date.hasEvent
                        ? "bg-[#FFD700]/20 text-[#FFD700]"
                        : "hover:bg-white/5"
                    }`}
                  >
                    {date.day}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="bg-[#121218] border border-[#FFD700]/20 rounded-2xl p-4 hover:border-[#FFD700]/40 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Icon className="text-[#FFD700]" size={20} />
                      <span className="text-xs text-emerald-400">{stat.change}</span>
                    </div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-[#8a8a95]">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column - Life Tracker */}
          <div className="space-y-6">
            {/* Quarterly Goals */}
            <div className="bg-[#121218] border border-[#FFD700]/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Target className="text-[#FFD700]" size={20} />
                  <h2 className="text-lg font-bold">Quarterly Goals</h2>
                </div>
                <button
                  onClick={() => setIsGoalModalOpen(true)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Plus size={18} className="text-[#FFD700]" />
                </button>
              </div>

              <div className="space-y-4">
                {goals.length === 0 ? (
                  <p className="text-[#8a8a95] text-center py-4">No goals yet. Create your first one!</p>
                ) : (
                  goals.map((goal) => (
                    <div key={goal.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{goal.title}</span>
                        <span className="text-sm text-[#FFD700]">{goal.progress}%</span>
                      </div>
                      <div className="h-2 bg-[#0D1117] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-full transition-all duration-500"
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={goal.progress}
                        onChange={(e) => handleProgressUpdate(goal.id, parseInt(e.target.value))}
                        className="w-full h-1 bg-[#0D1117] rounded-lg appearance-none cursor-pointer mt-2"
                      />
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Skills Radar */}
            <div className="bg-[#121218] border border-[#FFD700]/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="text-[#FFD700]" size={20} />
                  <h2 className="text-lg font-bold">Skills Radar</h2>
                </div>
                <button
                  onClick={() => setIsSkillModalOpen(true)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Plus size={18} className="text-[#FFD700]" />
                </button>
              </div>

              <SkillsRadar skills={skills} />
            </div>
          </div>
        </div>
      </main>

      {/* Goal Modal */}
      {isGoalModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#121218] border border-[#FFD700]/20 rounded-2xl p-6 w-full max-w-md">
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
                  className="w-full px-3 py-2 bg-[#0D1117] border border-[#FFD700]/20 rounded-lg text-white focus:border-[#FFD700] focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-[#8a8a95] mb-1">Category</label>
                <select
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0D1117] border border-[#FFD700]/20 rounded-lg text-white focus:border-[#FFD700] focus:outline-none"
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
                  className="px-4 py-2 bg-[#FFD700] text-black rounded-lg font-semibold hover:bg-[#E6C200] transition-colors"
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
          <div className="bg-[#121218] border border-[#FFD700]/20 rounded-2xl p-6 w-full max-w-md">
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
                  className="w-full px-3 py-2 bg-[#0D1117] border border-[#FFD700]/20 rounded-lg text-white focus:border-[#FFD700] focus:outline-none"
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
                  className="w-full px-3 py-2 bg-[#0D1117] border border-[#FFD700]/20 rounded-lg text-white focus:border-[#FFD700] focus:outline-none"
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
                  className="px-4 py-2 bg-[#FFD700] text-black rounded-lg font-semibold hover:bg-[#E6C200] transition-colors"
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
