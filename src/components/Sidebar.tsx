"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Target,
  Crown,
  FolderKanban,
  Users,
  Building2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { RestartButton } from "@/components/RestartButton";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Missions", href: "/missions", icon: Target },
  { name: "Team", href: "/team", icon: Users },
  { name: "Office", href: "/office", icon: Building2 },
  { name: "Yuan", href: "/yuan", icon: Crown },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside 
      className={`bg-[#0f0f14]/90 backdrop-blur-xl border-r border-[#00F5FF]/20 flex flex-col transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Header with toggle button */}
      <div className={`p-6 border-b border-[#00F5FF]/20 ${isCollapsed ? 'px-4' : ''}`}>
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00F5FF] to-[#0066ff] rounded-xl flex items-center justify-center shadow-lg shadow-[#00F5FF]/30">
                <span className="text-black font-black text-lg tracking-tighter">DS</span>
              </div>
              <div>
                <h1 className="text-lg font-black text-white tracking-tighter">DinoSquad</h1>
                <p className="text-[10px] text-[#00F5FF]/70 font-mono tracking-widest uppercase">HQ</p>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="w-8 h-8 bg-gradient-to-br from-[#00F5FF] to-[#0066ff] rounded-lg flex items-center justify-center shadow-lg shadow-[#00F5FF]/30 mx-auto">
              <span className="text-black font-black text-xs">DS</span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-1.5 rounded-lg text-[#8a8a95] hover:text-white hover:bg-white/10 transition-all duration-200 ${
              isCollapsed ? 'mx-auto mt-4' : ''
            }`}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </div>

      {/* Navigation */}
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
                      ? "bg-gradient-to-r from-[#00F5FF]/20 to-transparent text-[#00F5FF] border-l-2 border-[#00F5FF]"
                      : "text-[#8a8a95] hover:text-white hover:bg-white/5"
                  } ${isCollapsed ? 'justify-center px-2' : ''}`}
                  title={isCollapsed ? item.name : undefined}
                >
                  <Icon size={18} className={isActive ? "text-[#00F5FF]" : ""} />
                  {!isCollapsed && item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-[#00F5FF]/20 space-y-4">
          {/* Server Restart Control */}
          <RestartButton />
          
          {/* AI Agent Status */}
          <div className="bg-gradient-to-br from-[#00F5FF]/10 to-[#0066ff]/10 rounded-xl p-4 border border-[#00F5FF]/30">
            <p className="text-xs text-[#8a8a95] mb-2">AI Agent Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#00F5FF] rounded-full animate-pulse shadow-lg shadow-[#00F5FF]/50"></div>
              <span className="text-sm text-white font-medium">Rex Online</span>
            </div>
            <div className="mt-3 h-1 bg-[#1e1e24] rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-gradient-to-r from-[#00F5FF] to-[#0066ff]"></div>
            </div>
          </div>
        </div>
      )}
      
      {isCollapsed && (
        <div className="p-4 border-t border-[#00F5FF]/20">
          <div className="flex justify-center">
            <div className="w-2 h-2 bg-[#00F5FF] rounded-full animate-pulse shadow-lg shadow-[#00F5FF]/50"></div>
          </div>
        </div>
      )}
    </aside>
  );
}
