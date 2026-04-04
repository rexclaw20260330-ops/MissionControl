"use client";

import { useState } from "react";
import { Plus, MoreHorizontal, User, Bot } from "lucide-react";

type TaskStatus = "backlog" | "in_progress" | "review" | "done";

interface Task {
  id: string;
  title: string;
  assignee: "user" | "agent";
  status: TaskStatus;
  description?: string;
}

const initialTasks: Task[] = [
  { id: "1", title: "Review PR #142", assignee: "user", status: "review", description: "Check the new feature implementation" },
  { id: "2", title: "Deploy to production", assignee: "agent", status: "in_progress", description: "Deploy latest changes" },
  { id: "3", title: "Update documentation", assignee: "agent", status: "backlog" },
  { id: "4", title: "Fix login bug", assignee: "agent", status: "done" },
  { id: "5", title: "Design new landing page", assignee: "user", status: "backlog" },
];

const columns: { id: TaskStatus; name: string; color: string }[] = [
  { id: "backlog", name: "Backlog", color: "border-gray-600" },
  { id: "in_progress", name: "In Progress", color: "border-blue-500" },
  { id: "review", name: "Review", color: "border-yellow-500" },
  { id: "done", name: "Done", color: "border-green-500" },
];

export default function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      assignee: "agent",
      status: "backlog",
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
  };

  const moveTask = (taskId: string, newStatus: TaskStatus) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  return (
    <div className="p-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Task Board</h1>
          <p className="text-gray-400">Track what you and Rex are working on.</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="New task..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={addTask}
            className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus size={18} />
            Add Task
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((column) => (
          <div key={column.id} className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4">
            <div className={`flex items-center justify-between mb-4 pb-3 border-b-2 ${column.color}`}>
              <h3 className="font-semibold text-white">{column.name}</h3>
              <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-full">
                {tasks.filter((t) => t.status === column.id).length}
              </span>
            </div>

            <div className="space-y-3">
              {tasks
                .filter((task) => task.status === column.id)
                .map((task) => (
                  <div
                    key={task.id}
                    className="bg-[#252525] border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-medium text-white">{task.title}</p>
                      <button className="text-gray-500 hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                    
                    {task.description && (
                      <p className="text-xs text-gray-500 mb-3">{task.description}</p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          task.assignee === "user" ? "bg-green-500/20 text-green-400" : "bg-indigo-500/20 text-indigo-400"
                        }`}>
                          {task.assignee === "user" ? <User size={12} /> : <Bot size={12} />}
                        </div>
                        <span className="text-xs text-gray-500">
                          {task.assignee === "user" ? "You" : "Rex"}
                        </span>
                      </div>

                      <div className="flex gap-1">
                        {column.id !== "backlog" && (
                          <button
                            onClick={() => moveTask(task.id, columns[columns.findIndex((c) => c.id === column.id) - 1].id)}
                            className="text-xs text-gray-500 hover:text-white px-2 py-1 rounded hover:bg-gray-700"
                          >
                            ←
                          </button>
                        )}
                        {column.id !== "done" && (
                          <button
                            onClick={() => moveTask(task.id, columns[columns.findIndex((c) => c.id === column.id) + 1].id)}
                            className="text-xs text-gray-500 hover:text-white px-2 py-1 rounded hover:bg-gray-700"
                          >
                            →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
