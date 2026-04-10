'use client';

import { Lightbulb, Search, TrendingUp, XCircle, CheckCircle2, Clock, ArrowRight } from "lucide-react";
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
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    case 'failed':
      return <XCircle className="w-5 h-5 text-red-500" />;
    case 'testing':
      return <Clock className="w-5 h-5 text-amber-500" />;
    default:
      return <Lightbulb className="w-5 h-5 text-blue-500" />;
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'success':
      return '成功 ✅';
    case 'failed':
      return '失敗 ❌';
    case 'testing':
      return '測試中 ⏳';
    default:
      return '待評估 💡';
  }
};

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'success':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'failed':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'testing':
      return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    default:
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  }
};

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>(mockIdeas);
  const [filter, setFilter] = useState<string>('all');

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

  return (
    <div className="min-h-screen bg-[#0D1117] text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#0066ff] to-[#00ffff]">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">Token Eater Ideas</h1>
              <p className="text-[#8a8a95]">Daily startup ideas tracking & validation</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#161B22] border border-white/10 rounded-lg hover:bg-white/5">
              <Search className="w-4 h-4" />
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0066ff] to-[#00ffff] rounded-lg font-medium">
              <ArrowRight className="w-4 h-4" />
              Add New Idea
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        <div className="bg-[#161B22] border border-white/10 rounded-xl p-4">
          <p className="text-[#8a8a95] text-sm mb-1">Total Ideas</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-[#161B22] border border-white/10 rounded-xl p-4">
          <p className="text-amber-400 text-sm mb-1">Testing</p>
          <p className="text-2xl font-bold">{stats.testing}</p>
        </div>
        <div className="bg-[#161B22] border border-white/10 rounded-xl p-4">
          <p className="text-green-400 text-sm mb-1">Success</p>
          <p className="text-2xl font-bold">{stats.success}</p>
        </div>
        <div className="bg-[#161B22] border border-white/10 rounded-xl p-4">
          <p className="text-red-400 text-sm mb-1">Failed</p>
          <p className="text-2xl font-bold">{stats.failed}</p>
        </div>
        <div className="bg-[#161B22] border border-white/10 rounded-xl p-4">
          <p className="text-blue-400 text-sm mb-1">Pending</p>
          <p className="text-2xl font-bold">{stats.pending}</p>
        </div>
      </div>

      {/* Daily Schedule */}
      <div className="bg-[#161B22] border border-white/10 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#00F5FF]" />
          Daily Schedule
        </h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 bg-[#0D1117] rounded-lg border border-white/5">
            <p className="text-[#00F5FF] font-semibold">11:00</p>
            <p className="text-sm text-[#8a8a95]">Market Research</p>
            <p className="text-xs text-[#8a8a95] mt-1">Pteroda</p>
          </div>
          <div className="p-4 bg-[#0D1117] rounded-lg border border-white/5">
            <p className="text-[#00F5FF] font-semibold">11:30</p>
            <p className="text-sm text-[#8a8a95]">Generate 10 Ideas</p>
            <p className="text-xs text-[#8a8a95] mt-1">Rex + Squad</p>
          </div>
          <div className="p-4 bg-[#0D1117] rounded-lg border border-white/5">
            <p className="text-[#00F5FF] font-semibold">12:00</p>
            <p className="text-sm text-[#8a8a95]">Competition + Cost</p>
            <p className="text-xs text-[#8a8a95] mt-1">Pteroda + Mosa</p>
          </div>
          <div className="p-4 bg-[#0D1117] rounded-lg border border-white/5">
            <p className="text-[#00F5FF] font-semibold">12:30</p>
            <p className="text-sm text-[#8a8a95]">MVP Testing</p>
            <p className="text-xs text-[#8a8a95] mt-1">Mosa + Tricera</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {['all', 'pending', 'testing', 'success', 'failed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg capitalize transition-colors ${
              filter === f 
                ? 'bg-[#0066ff] text-white' 
                : 'bg-[#161B22] text-[#8a8a95] hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Ideas Table */}
      <div className="bg-[#161B22] border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left p-4 text-[#8a8a95] font-medium">Status</th>
              <th className="text-left p-4 text-[#8a8a95] font-medium">Date</th>
              <th className="text-left p-4 text-[#8a8a95] font-medium">Idea</th>
              <th className="text-left p-4 text-[#8a8a95] font-medium">Category</th>
              <th className="text-left p-4 text-[#8a8a95] font-medium">Pain Point</th>
              <th className="text-left p-4 text-[#8a8a95] font-medium">Cost</th>
              <th className="text-left p-4 text-[#8a8a95] font-medium">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {filteredIdeas.map((idea) => (
              <tr key={idea.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="p-4">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm border ${getStatusStyle(idea.status)}`}>
                    {getStatusIcon(idea.status)}
                    {getStatusLabel(idea.status)}
                  </div>
                </td>
                <td className="p-4 text-[#8a8a95]">{idea.date}</td>
                <td className="p-4 font-medium">{idea.title}</td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-white/10 rounded text-sm">
                    {idea.category}
                  </span>
                </td>
                <td className="p-4 text-[#8a8a95] max-w-md truncate">
                  {idea.painPoint}
                </td>
                <td className="p-4 text-[#00F5FF]">{idea.cost}</td>
                <td className="p-4 text-green-400">{idea.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredIdeas.length === 0 && (
        <div className="text-center py-12 text-[#8a8a95]">
          <Lightbulb className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No ideas found in this category.</p>
        </div>
      )}
    </div>
  );
}
