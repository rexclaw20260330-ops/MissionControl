import { FolderKanban, CheckCircle2, Clock, ArrowRight, Plus } from "lucide-react";

const projects: { id: string; name: string; description: string; status: "planning" | "in_progress" | "review" | "done"; progress: number; tasks: { total: number; completed: number }; lastUpdated: string }[] = [];

const statusColors: Record<string, string> = {
  planning: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  in_progress: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  review: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  done: "bg-green-500/20 text-green-400 border-green-500/30",
};

export default function Projects() {
  return (
    <div className="p-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
          <p className="text-gray-400">Track all your major projects and their progress.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          <Plus size={18} />
          New Project
        </button>
      </header>

      {projects.length === 0 ? (
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-12 text-center">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <FolderKanban size={32} className="text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No projects yet</h3>
          <p className="text-gray-500 mb-6">Create your first project to start tracking progress.</p>
          <button className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            <Plus size={18} />
            Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-800 rounded-lg">
                    <FolderKanban size={20} className="text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{project.name}</h3>
                    <p className="text-sm text-gray-500">{project.description}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full border ${statusColors[project.status]}`}>
                  {project.status.replace("_", " ")}
                </span>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-white font-medium">{project.progress}%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-gray-500">
                    <CheckCircle2 size={14} />
                    <span>{project.tasks.completed}/{project.tasks.total} tasks</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Clock size={14} />
                    <span>{project.lastUpdated}</span>
                  </div>
                </div>
                <button className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors">
                  View
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
