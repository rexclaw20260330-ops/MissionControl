"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  KanbanSquare,
  Calendar,
  FolderKanban,
  Users,
  Building2,
} from "lucide-react";
import { RestartButton } from "@/components/RestartButton";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Task Board", href: "/tasks", icon: KanbanSquare },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Team", href: "/team", icon: Users },
  { name: "Office", href: "/office", icon: Building2 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#0f0f14]/90 backdrop-blur-xl border-r border-[#0066ff]/20 flex flex-col">
      <div className="p-6 border-b border-[#0066ff]/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#0066ff] to-[#00ffff] rounded-xl flex items-center justify-center shadow-lg shadow-[#0066ff]/30">
            <span className="text-white font-black text-lg tracking-tighter">MC</span>
          </div>
          <div>
            <h1 className="text-lg font-black text-white tracking-tighter">Mission Control</h1>
            <p className="text-[10px] text-[#00ffff]/70 font-mono tracking-widest uppercase">AI-Powered</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold tracking-tight transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-[#0066ff]/20 to-transparent text-[#00ffff] border-l-2 border-[#00ffff] glow-cyan"
                      : "text-[#8a8a95] hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon size={18} className={isActive ? "text-[#00ffff]" : ""} />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-[#0066ff]/20 space-y-4">
        {/* Server Restart Control */}
        <RestartButton />
        
        {/* AI Agent Status */}
        <div className="bg-gradient-to-br from-[#0066ff]/10 to-[#00ffff]/10 rounded-xl p-4 border border-[#0066ff]/30">
          <p className="text-xs text-[#8a8a95] mb-2">AI Agent Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#00ffff] rounded-full animate-pulse shadow-lg shadow-[#00ffff]/50"></div>
            <span className="text-sm text-white font-medium">Rex & Tricera Online</span>
          </div>
          <div className="mt-3 h-1 bg-[#1e1e24] rounded-full overflow-hidden">
            <div className="h-full w-3/4 bg-gradient-to-r from-[#0066ff] to-[#00ffff] animate-pulse"></div>
          </div>
        </div>
      </div>
    </aside>
  );
}
