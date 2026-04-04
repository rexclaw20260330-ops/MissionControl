import { Users, Bot, User, Laptop, Target, BookOpen, Calendar, Code } from "lucide-react";

const team = {
  mission: "Build an autonomous organization of AI agents that do work and produce value 24/7.",
  agents: [
    { id: "1", name: "Rex", role: "Main OpenClaw Agent", type: "main", status: "online", device: "Cloud", description: "Your primary AI assistant. Manages all tasks and coordinates with sub-agents.", icon: Bot },
    { id: "2", name: "Tricera", role: "Art Director", type: "sub", status: "online", device: "Mac Studio", description: "Creative lead for all visual design, UI/UX, and pixel art projects.", icon: User },
    { id: "3", name: "Pteroda", role: "Researcher", type: "sub", status: "online", device: "Cloud", description: "Gathers information, analyzes data, and provides insights for decision making.", icon: BookOpen },
    { id: "4", name: "Bronto", role: "Planner", type: "sub", status: "online", device: "Cloud", description: "Strategic thinker who breaks down complex projects into actionable steps.", icon: Calendar },
    { id: "5", name: "Mosa", role: "Developer", type: "sub", status: "online", device: "MacBook Pro", description: "Code expert who builds features, fixes bugs, and maintains technical infrastructure.", icon: Code },
  ],
};

const roleColors: Record<string, string> = {
  "Main OpenClaw Agent": "from-[#0066ff] to-[#00ffff]",
  "Art Director": "from-purple-500 to-pink-500",
  "Researcher": "from-amber-500 to-orange-500",
  "Planner": "from-emerald-500 to-teal-500",
  "Developer": "from-rose-500 to-red-500",
};

const roleIcons: Record<string, string> = {
  "Main OpenClaw Agent": "🦖",
  "Art Director": "🦕",
  "Researcher": "🦅",
  "Planner": "🦒",
  "Developer": "🐊",
};

export default function Team() {
  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-black text-white mb-2 tracking-tighter">Team</h1>
        <p className="text-[#8a8a95]">Your AI dinosaur organization structure and mission statement.</p>
      </header>

      {/* Mission Statement */}
      <div className="bg-gradient-to-r from-[#0066ff]/20 to-[#00ffff]/20 border border-[#0066ff]/30 rounded-2xl p-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#0066ff]/10 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <Target size={20} className="text-[#00ffff]" />
            <h2 className="text-lg font-semibold text-white">Mission Statement</h2>
          </div>
          <p className="text-xl text-white font-medium leading-relaxed italic">
            "{team.mission}"
          </p>
        </div>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.agents.map((agent) => {
          const Icon = agent.icon;
          const gradient = roleColors[agent.role] || "from-gray-500 to-gray-400";
          const emoji = roleIcons[agent.role] || "🦖";
          
          return (
            <div
              key={agent.id}
              className={`group bg-[#15151a] border rounded-2xl p-6 transition-all duration-300 hover:border-[#0066ff]/50 hover:glow-cyan relative overflow-hidden ${
                agent.type === "main"
                  ? "border-[#0066ff]/50"
                  : "border-[#0066ff]/20"
              }`}
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl bg-gradient-to-br ${gradient} shadow-lg`}>
                      {emoji}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-white text-lg tracking-tight">{agent.name}</h3>
                        {agent.type === "main" && (
                          <span className="text-[10px] px-2 py-0.5 bg-[#0066ff]/20 text-[#00ffff] rounded-full font-mono uppercase tracking-wider">
                            Main
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[#8a8a95] font-medium">{agent.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      agent.status === "online" ? "bg-[#00ffff] animate-pulse shadow-lg shadow-[#00ffff]/50" : "bg-gray-500"
                    }`} />
                    <span className="text-xs text-[#8a8a95] font-mono uppercase">{agent.status}</span>
                  </div>
                </div>

                <p className="text-sm text-[#f0f0f5] mb-4 leading-relaxed">{agent.description}</p>

                <div className="flex items-center gap-2 text-xs text-[#8a8a95] font-mono">
                  <Laptop size={14} />
                  <span>{agent.device}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
