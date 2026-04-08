import { DashboardStats } from "@/components/DashboardStats";
import Link from "next/link";
import { Target, Calendar, Users, Building2 } from "lucide-react";

export default function Home() {
  const quickLinks = [
    { 
      title: "Projects", 
      href: "/projects", 
      icon: Target,
      desc: "Track your project progress"
    },
    { 
      title: "Office", 
      href: "/office", 
      icon: Building2,
      desc: "Jurassic Office - Agent workspace"
    },
    { 
      title: "Calendar", 
      href: "/yuan", 
      icon: Calendar,
      desc: "View your schedule"
    },
    { 
      title: "Team", 
      href: "/team", 
      icon: Users,
      desc: "DinoSquad members"
    },
  ];

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-black text-white mb-2 tracking-tighter">Dashboard</h1>
        <p className="text-[#8a8a95] font-medium">Welcome back, Master. Here&apos;s your mission overview.</p>
      </header>

      <DashboardStats />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="bg-[#161B22] border border-white/10 rounded-xl p-6 hover:border-[#00F5FF]/50 hover:shadow-lg hover:shadow-[#00F5FF]/10 transition-all group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-[#00F5FF]/20 rounded-lg">
                <link.icon className="text-[#00F5FF]" size={20} />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-[#00F5FF] transition-colors">{link.title}</h3>
            </div>
            <p className="text-sm text-[#8a8a95]">{link.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
