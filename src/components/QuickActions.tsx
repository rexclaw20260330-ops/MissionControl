"use client";

import { useState } from "react";
import { Plus, MessageSquare, Sparkles, Target, X, Send, Wand2 } from "lucide-react";

interface Task {
  id: number;
  title: string;
  status: "pending" | "in-progress" | "completed";
  createdAt: Date;
}

interface Message {
  id: number;
  sender: "user" | "rex";
  content: string;
  timestamp: Date;
}

export function QuickActions() {
  const [activeModal, setActiveModal] = useState<"task" | "chat" | "prompt" | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");

  const handleNewTask = () => {
    if (inputValue.trim()) {
      const newTask: Task = {
        id: Date.now(),
        title: inputValue.trim(),
        status: "pending",
        createdAt: new Date()
      };
      setTasks(prev => [newTask, ...prev]);
      setInputValue("");
      setActiveModal(null);
    }
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const userMsg: Message = {
        id: Date.now(),
        sender: "user",
        content: inputValue.trim(),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMsg]);
      setInputValue("");

      setTimeout(() => {
        const rexMsg: Message = {
          id: Date.now() + 1,
          sender: "rex",
          content: "Got it! I'm on it. 🦖",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, rexMsg]);
      }, 1000);
    }
  };

  const handleReversePrompt = () => {
    if (inputValue.trim()) {
      const optimized = `Optimized: "${inputValue.trim()}" \n\n[Tone: Professional] [Context: Technical] [Goal: Clear action]`;
      setInputValue(optimized);
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setInputValue("");
  };

  return (
    <>
      <div className="bg-[#15151a] border border-[#0066ff]/20 rounded-2xl p-5 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#0066ff]/10 rounded-full blur-3xl" />
        
        <div className="relative">
          <h2 className="text-lg font-black text-white tracking-tight mb-4">Quick Actions</h2>
          
          <div className="space-y-2.5">
            <button 
              onClick={() => setActiveModal("task")}
              className="group w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-white font-semibold 
                bg-gradient-to-r from-[#0066ff] to-[#00a8ff] 
                hover:from-[#0055dd] hover:to-[#0099ee]
                transition-all duration-300 
                shadow-lg shadow-[#0066ff]/30 hover:shadow-[#0066ff]/50 
                hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
              <span>New Task</span>
              {tasks.length > 0 && (
                <span className="ml-auto text-xs bg-white/20 px-2 py-0.5 rounded-full">{tasks.length}</span>
              )}
            </button>
            
            <button 
              onClick={() => setActiveModal("chat")}
              className="group w-full flex items-center gap-3 px-4 py-3 rounded-xl 
                text-[#f0f0f5] font-medium 
                bg-transparent border border-[#0066ff]/40 
                hover:border-[#00ffff] hover:text-white
                hover:bg-[#0066ff]/10 hover:shadow-[0_0_20px_rgba(0,102,255,0.3)]
                transition-all duration-300"
            >
              <MessageSquare size={18} className="text-[#00ffff] group-hover:scale-110 transition-transform" />
              <span>Ask Rex</span>
              {messages.length > 0 && (
                <span className="ml-auto flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-[#00ffff] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ffff]"></span>
                </span>
              )}
            </button>
            
            <button 
              onClick={() => setActiveModal("prompt")}
              className="group w-full flex items-center gap-3 px-4 py-2.5 rounded-xl 
                text-[#8a8a95] font-medium 
                bg-transparent 
                hover:text-[#f0f0f5] hover:bg-[#1e1e24]
                transition-all duration-300"
            >
              <Sparkles size={16} className="group-hover:text-[#00ffff] transition-colors" />
              <span className="text-sm">Reverse Prompt</span>
            </button>
          </div>

          <div className="mt-5 pt-5 border-t border-[#0066ff]/10">
            <div className="flex items-center gap-2 mb-3">
              <Target size={14} className="text-[#00ffff]" />
              <p className="text-[10px] text-[#8a8a95] uppercase tracking-widest font-semibold">Mission Statement</p>
            </div>
            
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl bg-gradient-to-b from-[#0066ff] to-[#00ffff]" />
              
              <div className="bg-gradient-to-r from-[#0066ff]/10 to-[#00ffff]/10 border border-[#0066ff]/30 border-l-0 rounded-xl rounded-l-none p-4">
                <p className="text-sm text-[#f0f0f5] leading-relaxed italic font-light">
                  &quot;Build an autonomous organization of AI agents that do work and produce value 24/7.&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {activeModal === "task" && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#15151a] border border-[#0066ff]/30 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Create New Task</h3>
              <button onClick={closeModal} className="text-[#8a8a95] hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full bg-[#0a0a0a] border border-[#0066ff]/30 rounded-xl px-4 py-3 text-white placeholder-[#8a8a95] focus:border-[#00ffff] focus:outline-none"
              onKeyDown={(e) => { if (e.key === "Enter") handleNewTask(); }}
            />
            
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={closeModal} className="px-4 py-2 rounded-lg text-[#8a8a95] hover:text-white transition-colors">
                Cancel
              </button>
              <button 
                onClick={handleNewTask}
                disabled={!inputValue.trim()}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#0066ff] to-[#00a8ff] text-white font-medium 
                  disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#0066ff]/30 transition-all"
              >
                Create Task
              </button>
            </div>

            {tasks.length > 0 && (
              <div className="mt-4 pt-4 border-t border-[#0066ff]/20">
                <p className="text-xs text-[#8a8a95] mb-2">Recent tasks:</p>
                <div className="space-y-2">
                  {tasks.slice(0, 3).map(task => (
                    <div key={task.id} className="flex items-center gap-2 text-sm text-[#f0f0f5]">
                      <div className={`w-2 h-2 rounded-full ${
                        task.status === "completed" ? "bg-emerald-400" : 
                        task.status === "in-progress" ? "bg-[#00ffff]" : "bg-[#8a8a95]"
                      }`} />
                      <span>{task.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeModal === "chat" && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#15151a] border border-[#0066ff]/30 rounded-2xl p-6 w-full max-w-md h-[500px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0066ff] to-[#00ffff] flex items-center justify-center">
                  <MessageSquare size={14} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Ask Rex</h3>
                  <p className="text-xs text-[#00ffff]">Online now</p>
                </div>
              </div>
              <button onClick={closeModal} className="text-[#8a8a95] hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
              {messages.length === 0 ? (
                <div className="text-center text-[#8a8a95] py-8">
                  <p>Start a conversation with Rex! 🦖</p>
                </div>
              ) : (
                <>
                  {messages.map((msg) => {
                    const isUser = msg.sender === "user";
                    return (
                      <div key={msg.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                        <div 
                          className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                            isUser 
                              ? "bg-[#0066ff] text-white rounded-br-md" 
                              : "bg-[#1e1e24] text-[#f0f0f5] rounded-bl-md border border-[#0066ff]/20"
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-[#0a0a0a] border border-[#0066ff]/30 rounded-xl px-4 py-2 text-white placeholder-[#8a8a95] focus:border-[#00ffff] focus:outline-none text-sm"
                onKeyDown={(e) => { if (e.key === "Enter") handleSendMessage(); }}
              />
              <button 
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#0066ff] to-[#00a8ff] text-white 
                  disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#0066ff]/30 transition-all"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === "prompt" && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#15151a] border border-[#0066ff]/30 rounded-2xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Wand2 size={24} className="text-[#00ffff]" />
                <h3 className="text-lg font-bold text-white">Reverse Prompt</h3>
              </div>
              <button onClick={closeModal} className="text-[#8a8a95] hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <p className="text-sm text-[#8a8a95] mb-4">
              Enter a rough prompt and we&apos;ll optimize it for better results.
            </p>
            
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Example: &apos;make a website&apos;"
              rows={4}
              className="w-full bg-[#0a0a0a] border border-[#0066ff]/30 rounded-xl px-4 py-3 text-white placeholder-[#8a8a95] focus:border-[#00ffff] focus:outline-none resize-none"
            />
            
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={closeModal} className="px-4 py-2 rounded-lg text-[#8a8a95] hover:text-white transition-colors">
                Cancel
              </button>
              <button 
                onClick={handleReversePrompt}
                disabled={!inputValue.trim()}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-violet-400 text-white font-medium 
                  disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-violet-500/30 transition-all flex items-center gap-2"
              >
                <Sparkles size={16} />
                Optimize
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
