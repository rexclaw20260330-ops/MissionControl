'use client';

import { Lightbulb, Search, TrendingUp, XCircle, CheckCircle2, Clock, ArrowRight, Sparkles, Zap } from "lucide-react";
import { useState, useEffect } from 'react';

interface Idea {
  id: string;
  date: string;
  title: string;
  category: string;
  painPoint: string;
  status: 'testing' | 'success' | 'failed' | 'pending';
  notes?: string;
  cost?: string;
  revenue?: string;
}

const mockIdeas: Idea[] = [
  {
    id: '1',
    date: '2026-04-10',
    title: 'AI SDR 自動化',
    category: 'B2B Sales',
    painPoint: 'SDR 年薪 $50-150K，AI 可省 70-80%',
    status: 'pending',
    cost: '$2K',
    revenue: '$2-5K/月 per seat'
  },
  {
    id: '2',
    date: '2026-04-10',
    title: 'Reddit 痛點掃描器',
    category: 'Market Research',
    painPoint: '創業者需要找到真實痛點',
    status: 'testing',
    cost: '$500',
    revenue: '$10-50/月'
  },
  {
    id: '3',
    date: '2026-04-10',
    title: 'SEO 內容自動化',
    category: 'Content',
    painPoint: '企業沒時間持續產 SEO 內容',
    status: 'pending',
    cost: '$1K',
    revenue: '$29-99/月'
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'success':
      return <CheckCircle2 className="w-4 h-4" />;
    case 'failed':
      return <XCircle className="w-4 h-4" />;
    case 'testing':
      return <Clock className="w-4 h-4" />;
    default:
      return <Sparkles className="w-4 h-4" />;
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'success':
      return '成功';
    case 'failed':
      return '失敗';
    case 'testing':
      return '測試中';
    default:
      return '待評估';
  }
};

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'success':
      return 'bg-green-500/20 text-green-400 border-green-500/40 shadow-[0_0_15px_rgba(34,197,94,0.3)]';
    case 'failed':
      return 'bg-red-500/20 text-red-400 border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.3)]';
    case 'testing':
      return 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-[0_0_15px_rgba(251,191,36,0.3)]';
    default:
      return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]';
  }
};

const FilterButton = ({ label, active, onClick, count }: { label: string; active: boolean; onClick: () => void; count: number }) => (
  <button
    onClick={onClick}
    className={`relative px-4 py-2 rounded-lg capitalize transition-all duration-300 ${
      active 
        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)]' 
        : 'bg-[#161B22] text-[#8a8a95] hover:text-white hover:bg-[#1C2128] border border-white/5 hover:border-white/20'
    }`}
  >
    {active && (
      <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 opacity-20 animate-pulse" />
    )}
    <span className="relative flex items-center gap-2">
      {label}
      <span className={`text-xs px-1.5 py-0.5 rounded ${active ? 'bg-white/20' : 'bg-white/10'}`}>
        {count}
      </span>
    </span>
  </button>
);

const StatCard = ({ label, value, color, trend }: { label: string; value: number; color: string; trend?: string }) => (
  <div className="group bg-[#161B22] border border-white/10 rounded-xl p-4 hover:border-white/20 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all duration-300">
    <div className="flex items-center justify-between mb-2">
      <p className={`${color} text-sm font-medium`}>{label}</p>
      {trend && (
        <span className="flex items-center gap-1 text-xs text-green-400">
          <TrendingUp className="w-3 h-3" />
          {trend}
        </span>
      )}
    </div>
    <p className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent group-hover:from-white group-hover:to-cyan-400 transition-all">
      {value}
    </p>
  </div>
);

const ScheduleCard = ({ time, title, assignee, accent }: { time: string; title: string; assignee: string; accent: string }) => (
  <div className="relative overflow-hidden p-4 bg-[#0D1117] rounded-lg border border-white/5 hover:border-white/20 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all duration-300 group">
    <div className={`absolute top-0 left-0 w-1 h-full ${accent}`} />
    <p className={`${accent.replace('bg-', 'text-')} font-bold text-lg`}>{time}</p>
    <p className="text-white font-medium mt-1">{title}</p>
    <p className="text-xs text-[#8a8a95] mt-2 flex items-center gap-1">
      <Zap className="w-3 h-3" />
      {assignee}
    </p>
  </div>
);

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>(mockIdeas);
  const [filter, setFilter] = useState<string>('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredIdeas = filter === 'all' 
    ? ideas 
    : ideas.filter(i => i.status === filter);

  const stats = {
    total: ideas.length,
    testing: ideas.filter(i => i.status === 'testing').length,
    success: ideas.filter(i => i.status === 'success').length,
    failed: ideas.filter(i => i.status === 'failed').length,
    pending: ideas.filter(i => i.status === 'pending').length
  };

  const filterCounts = {
    all: stats.total,
    pending: stats.pending,
    testing: stats.testing,
    success: stats.success,
    failed: stats.failed
  };

  return (
    <div className="min-h-screen bg-[#0D1117] text-white p-6 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none" />

      <div className={`relative transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-[0_0_30px_rgba(6,182,212,0.4)]">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-ping" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    Token Eater Ideas
                  </h1>
                  <span className="px-2 py-0.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded text-xs text-cyan-400">
                    v2.0
                  </span>
                </div>
                <p className="text-[#8a8a95]">Daily startup ideas tracking & validation</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-[#161B22] border border-white/10 rounded-lg hover:bg-[#1C2128] hover:border-cyan-500/30 transition-all group">
                <Search className="w-4 h-4 text-[#8a8a95] group-hover:text-cyan-400 transition-colors" />
                <span className="text-[#8a8a95] group-hover:text-white transition-colors">Filter</span>
              </button>
              <button className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-medium shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all hover:scale-105">
                <ArrowRight className="w-4 h-4" />
                Add New Idea
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          <StatCard label="Total Ideas" value={stats.total} color="text-gray-400" trend="+3 today" />
          <StatCard label="Testing" value={stats.testing} color="text-amber-400" />
          <StatCard label="Success" value={stats.success} color="text-green-400" trend="+1" />
          <StatCard label="Failed" value={stats.failed} color="text-red-400" />
          <StatCard label="Pending" value={stats.pending} color="text-cyan-400" />
        </div>

        {/* Daily Schedule */}
        <div className="bg-[#161B22] border border-white/10 rounded-xl p-6 mb-8 hover:border-white/20 transition-colors">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Daily Schedule</span>
            <span className="ml-auto text-xs text-[#8a8a95]">Today</span>
          </h2>
          <div className="grid grid-cols-4 gap-4">
            <ScheduleCard time="11:00" title="Market Research" assignee="Pteroda" accent="bg-cyan-500" />
            <ScheduleCard time="11:30" title="Generate 10 Ideas" assignee="Rex + Squad" accent="bg-purple-500" />
            <ScheduleCard time="12:00" title="Competition + Cost" assignee="Pteroda + Mosa" accent="bg-amber-500" />
            <ScheduleCard time="12:30" title="MVP Testing" assignee="Mosa + Tricera" accent="bg-green-500" />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {(['all', 'pending', 'testing', 'success', 'failed'] as const).map((f) => (
            <FilterButton
              key={f}
              label={f}
              active={filter === f}
              onClick={() => setFilter(f)}
              count={filterCounts[f]}
            />
          ))}
        </div>

        {/* Ideas Table */}
        <div className="bg-[#161B22] border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent">
                <th className="text-left p-4 text-[#8a8a95] font-medium text-sm">Status</th>
                <th className="text-left p-4 text-[#8a8a95] font-medium text-sm">Date</th>
                <th className="text-left p-4 text-[#8a8a95] font-medium text-sm">Idea</th>
                <th className="text-left p-4 text-[#8a8a95] font-medium text-sm">Category</th>
                <th className="text-left p-4 text-[#8a8a95] font-medium text-sm">Pain Point</th>
                <th className="text-left p-4 text-[#8a8a95] font-medium text-sm">Cost</th>
                <th className="text-left p-4 text-[#8a8a95] font-medium text-sm">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {filteredIdeas.map((idea, idx) => (
                <tr 
                  key={idea.id} 
                  className="border-b border-white/5 hover:bg-gradient-to-r hover:from-cyan-500/5 hover:to-blue-500/5 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] transition-all duration-300 group"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <td className="p-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border ${getStatusStyle(idea.status)}`}>
                      {getStatusIcon(idea.status)}
                      {getStatusLabel(idea.status)}
                    </div>
                  </td>
                  <td className="p-4 text-[#8a8a95] font-mono text-sm">{idea.date}</td>
                  <td className="p-4 font-semibold group-hover:text-cyan-400 transition-colors">{idea.title}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-gradient-to-r from-white/10 to-white/5 rounded-full text-sm border border-white/10 group-hover:border-cyan-500/30 transition-colors">
                      {idea.category}
                    </span>
                  </td>
                  <td className="p-4 text-[#8a8a95] max-w-xs truncate group-hover:text-white transition-colors">
                    {idea.painPoint}
                  </td>
                  <td className="p-4">
                    <span className="text-cyan-400 font-mono">{idea.cost}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-green-400 font-medium">{idea.revenue}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredIdeas.length === 0 && (
          <div className="text-center py-16">
            <div className="relative inline-block">
              <Lightbulb className="w-16 h-16 mx-auto mb-4 text-[#8a8a95] opacity-30" />
              <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full" />
            </div>
            <p className="text-[#8a8a95] text-lg">No ideas found in this category.</p>
            <p className="text-[#8a8a95]/50 text-sm mt-2">Try selecting a different filter</p>
          </div>
        )}
      </div>
    </div>
  );
}