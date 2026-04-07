'use client';

import { useState, useEffect } from 'react';
import { FolderKanban, Plus, X, Pencil, Trash2, Calendar, Target } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'in_progress' | 'review' | 'done';
  progress: number;
  deadline: string | null;
  created_at: string;
}

const statusColors = {
  planning: { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30', label: 'Planning' },
  in_progress: { bg: 'bg-[#00F5FF]/20', text: 'text-[#00F5FF]', border: 'border-[#00F5FF]/30', label: 'In Progress' },
  review: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30', label: 'Review' },
  done: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30', label: 'Done' },
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'planning' as 'planning' | 'in_progress' | 'review' | 'done',
    progress: 0,
    deadline: '',
  });

  // Fetch projects
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/projects');
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setIsModalOpen(false);
        setFormData({ name: '', description: '', status: 'planning', progress: 0, deadline: '' });
        fetchProjects();
      }
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    
    try {
      const response = await fetch(`/api/projects/${editingProject.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setIsModalOpen(false);
        setEditingProject(null);
        setFormData({ name: '', description: '', status: 'planning', progress: 0, deadline: '' });
        fetchProjects();
      }
    } catch (error) {
      console.error('Failed to update project:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        fetchProjects();
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const openCreateModal = () => {
    setEditingProject(null);
    setFormData({ name: '', description: '', status: 'planning', progress: 0, deadline: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description,
      status: project.status as 'planning' | 'in_progress' | 'review' | 'done',
      progress: project.progress,
      deadline: project.deadline ? project.deadline.slice(0, 10) : '',
    });
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D1117] text-white p-8 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#00F5FF] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1117] text-white p-8">
      {/* Header */}
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
          <p className="text-[#8a8a95]">Track all your major projects and their progress.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-[#00F5FF] text-black rounded-lg font-medium hover:bg-[#00D9E6] transition-colors"
        >
          <Plus size={18} />
          New Project
        </button>
      </header>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="bg-[#161B22] border border-[#00F5FF]/20 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-[#00F5FF]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FolderKanban size={32} className="text-[#00F5FF]" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No projects yet</h3>
          <p className="text-[#8a8a95] mb-6">Create your first project to start tracking progress.</p>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-[#00F5FF] text-black rounded-lg font-medium hover:bg-[#00D9E6] transition-colors"
          >
            Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const statusStyle = statusColors[project.status];
            return (
              <div
                key={project.id}
                className="bg-[#161B22] border border-[#00F5FF]/20 rounded-2xl p-6 hover:border-[#00F5FF]/40 transition-colors"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#00F5FF]/20 rounded-lg">
                      <FolderKanban size={20} className="text-[#00F5FF]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{project.name}</h3>
                      {project.deadline && (
                        <p className="text-xs text-[#8a8a95] flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(project.deadline).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                    {statusStyle.label}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-[#8a8a95] mb-4 line-clamp-2">{project.description}</p>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-[#8a8a95]">Progress</span>
                    <span className="text-white font-medium">{project.progress}%</span>
                  </div>
                  <div className="h-2 bg-[#0D1117] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#00F5FF] to-[#0066ff] rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => openEditModal(project)}
                    className="p-2 text-[#8a8a95] hover:text-[#00F5FF] transition-colors"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-2 text-[#8a8a95] hover:text-rose-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#161B22] border border-[#00F5FF]/20 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                {editingProject ? 'Edit Project' : 'New Project'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#8a8a95] hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={editingProject ? handleUpdate : handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm text-[#8a8a95] mb-1">Project Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0D1117] border border-[#00F5FF]/20 rounded-lg text-white focus:border-[#00F5FF] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-[#8a8a95] mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0D1117] border border-[#00F5FF]/20 rounded-lg text-white focus:border-[#00F5FF] focus:outline-none resize-none"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#8a8a95] mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#0D1117] border border-[#00F5FF]/20 rounded-lg text-white focus:border-[#00F5FF] focus:outline-none"
                  >
                    <option value="planning">Planning</option>
                    <option value="in_progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="done">Done</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-[#8a8a95] mb-1">Deadline</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0D1117] border border-[#00F5FF]/20 rounded-lg text-white focus:border-[#00F5FF] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#8a8a95] mb-1">Progress: {formData.progress}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })}
                  className="w-full accent-[#00F5FF]"
                />
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
                  className="px-4 py-2 bg-[#00F5FF] text-black rounded-lg font-semibold hover:bg-[#00D9E6] transition-colors"
                >
                  {editingProject ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
