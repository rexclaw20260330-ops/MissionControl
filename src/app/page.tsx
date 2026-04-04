import { DashboardStats } from "@/components/DashboardStats";
import { RecentActivity } from "@/components/RecentActivity";
import { QuickActions } from "@/components/QuickActions";

export default function Home() {
  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-black text-white mb-2 tracking-tighter">Dashboard</h1>
        <p className="text-[#8a8a95] font-medium">Welcome back, Master. Here's your mission overview.</p>
      </header>

      <DashboardStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
