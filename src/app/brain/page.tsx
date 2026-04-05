'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ArrowLeft, Brain, Sparkles, Lightbulb, BookOpen, 
  Link2, Search, Plus, Trash2, Edit3, Save, X,
  ChevronRight, Hash, Clock, Star,
  Network, FileText, Zap, Command, Filter
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// Types for Second Brain
interface BrainNode {
  id: string;
  type: 'note' | 'idea' | 'resource' | 'project' | 'goal';
  title: string;
  content: string;
  tags: string[];
  connections: string[];
  createdAt: string;
  updatedAt: string;
  isPinned?: boolean;
}

// Mock data
const mockNodes: BrainNode[] = [
  {
    id: '1',
    type: 'goal',
    title: '2026 Master Plan',
    content: 'Build autonomous AI organization that produces value 24/7',
    tags: ['vision', '2026'],
    connections: ['2', '3'],
    createdAt: '2026-04-05',
    updatedAt: '2026-04-05',
    isPinned: true,
  },
  {
    id: '2',
    type: 'project',
    title: 'Mission Control',
    content: 'Central dashboard for managing AI agents and missions',
    tags: ['active', 'v1.0'],
    connections: ['1', '4'],
    createdAt: '2026-04-04',
    updatedAt: '2026-04-05',
  },
  {
    id: '3',
    type: 'idea',
    title: 'Agent Swarm Architecture',
    content: 'Multiple specialized agents working together like a neural network',
    tags: ['architecture', 'future'],
    connections: ['1', '5'],
    createdAt: '2026-04-03',
    updatedAt: '2026-04-05',
    isPinned: true,
  },
  {
    id: '4',
    type: 'note',
    title: 'Supabase Integration',
    content: 'Database setup complete with real-time sync for all dashboard data',
    tags: ['tech', 'done'],
    connections: ['2'],
    createdAt: '2026-04-05',
    updatedAt: '2026-04-05',
  },
  {
    id: '5',
    type: 'resource',
    title: 'PKM Best Practices',
    content: 'Tiago Forte\'s PARA method: Projects, Areas, Resources, Archives',
    tags: ['learning', 'pkm'],
    connections: ['3'],
    createdAt: '2026-04-02',
    updatedAt: '2026-04-05',
  },
];

// GOLD/AMBER Theme Colors
const typeColors: Record<BrainNode['type'], { bg: string; border: string; icon: any; glow: string }> = {
  note: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', icon: FileText, glow: '#f59e0b' },
  idea: { bg: 'bg-yellow-400/10', border: 'border-yellow-400/30', icon: Lightbulb, glow: '#facc15' },
  resource: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', icon: BookOpen, glow: '#f97316' },
  project: { bg: 'bg-amber-600/10', border: 'border-amber-600/30', icon: Sparkles, glow: '#d97706' },
  goal: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', icon: Star, glow: '#eab308' },
};

// Canvas Graph Visualization
const GraphCanvas = ({ nodes, onSelectNode }: { nodes: BrainNode[]; onSelectNode: (node: BrainNode) => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const nodePositions = useRef<Map<string, { x: number; y: number }>>(new Map());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) * 0.35;

    nodes.forEach((node, index) => {
      const angle = (index / nodes.length) * Math.PI * 2;
      const x = centerX + Math.cos(angle) * radius + (Math.random() - 0.5) * 100;
      const y = centerY + Math.sin(angle) * radius + (Math.random() - 0.5) * 100;
      nodePositions.current.set(node.id, { x, y });
    });

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.15)';
      ctx.lineWidth = 1;
      nodes.forEach((node) => {
        const pos = nodePositions.current.get(node.id);
        if (!pos) return;

        node.connections.forEach((targetId) => {
          const targetPos = nodePositions.current.get(targetId);
          if (targetPos) {
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
            ctx.lineTo(targetPos.x, targetPos.y);
            ctx.stroke();
          }
        });
      });

      // Draw nodes
      nodes.forEach((node) => {
        const pos = nodePositions.current.get(node.id);
        if (!pos) return;

        const isHovered = hoveredNode === node.id;
        const isPinned = node.isPinned;
        const color = typeColors[node.type].glow;
        
        const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, isHovered ? 40 : 30);
        gradient.addColorStop(0, `${color}60`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, isHovered ? 40 : 30, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = isHovered ? `${color}90` : `${color}50`;
        ctx.strokeStyle = isHovered ? color : `${color}90`;
        ctx.lineWidth = isHovered ? 3 : 2;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, isPinned ? 25 : 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        if (isPinned) {
          ctx.fillStyle = '#FFD700';
          ctx.beginPath();
          ctx.arc(pos.x - 15, pos.y - 15, 4, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = '#ffffff';
        ctx.font = isHovered ? 'bold 13px sans-serif' : '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const maxWidth = 120;
        const words = node.title.split(' ');
        let line = '';
        let y = pos.y + 40;
        
        for (let i = 0; i < words.length; i++) {
          const testLine = line + words[i] + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && i > 0) {
            ctx.fillText(line, pos.x, y);
            line = words[i] + ' ';
            y += 16;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, pos.x, y);
      });
    };

    draw();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      let found = false;
      nodes.forEach((node) => {
        const pos = nodePositions.current.get(node.id);
        if (pos) {
          const dist = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
          if (dist < 30) {
            setHoveredNode(node.id);
            found = true;
            canvas.style.cursor = 'pointer';
          }
        }
      });

      if (!found) {
        setHoveredNode(null);
        canvas.style.cursor = 'default';
      }
    };

    const handleClick = () => {
      if (hoveredNode) {
        const node = nodes.find((n) => n.id === hoveredNode);
        if (node) onSelectNode(node);
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
    };
  }, [nodes, hoveredNode, onSelectNode]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full cursor-grab active:cursor-grabbing"
      style={{ imageRendering: 'crisp-edges' }}
    />
  );
};

export default function SecondBrain() {
  const router = useRouter();
  const [nodes, setNodes] = useState<BrainNode[]>(mockNodes);
  const [selectedNode, setSelectedNode] = useState<BrainNode | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<BrainNode['type'] | 'all'>('all');
  const [isCreating, setIsCreating] = useState(false);
  const [viewMode, setViewMode] = useState<'graph' | 'list'>('graph');

  const filteredNodes = nodes.filter((node) => {
    const matchesSearch = 
      node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = activeFilter === 'all' || node.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const connectedNodes = selectedNode
    ? nodes.filter((n) => selectedNode.connections.includes(n.id))
    : [];

  const stats = {
    total: nodes.length,
    pinned: nodes.filter((n) => n.isPinned).length,
    byType: {
      note: nodes.filter((n) => n.type === 'note').length,
      idea: nodes.filter((n) => n.type === 'idea').length,
      resource: nodes.filter((n) => n.type === 'resource').length,
      project: nodes.filter((n) => n.type === 'project').length,
      goal: nodes.filter((n) => n.type === 'goal').length,
    },
  };

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#f0f0f5] overflow-hidden">
      {/* Top Bar - GOLD Theme */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0D1117]/90 backdrop-blur-xl border-b border-[#FFD700]/20">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Return Button - GOLD */}
          <button
            onClick={() => router.push('/yuan')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#FFD700]/20 to-[#FFA500]/20 border border-[#FFD700]/40 hover:border-[#FFD700]/60 hover:from-[#FFD700]/30 hover:to-[#FFA500]/30 transition-all duration-300 group"
          >
            <ArrowLeft size={18} className="text-[#FFD700] group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium text-[#FFD700]">Return to Yuan&apos;s Sanctum</span>
          </button>

          {/* Title & Stats - GOLD */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-xl flex items-center justify-center shadow-lg shadow-[#FFD700]/30">
                <Brain size={22} className="text-black" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight text-white">
                  Second Brain
                </h1>
                <p className="text-xs text-[#8a8a95] font-mono">
                  {stats.total} nodes · {stats.pinned} pinned
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-[#161B22] border border-[#FFD700]/20">
              {Object.entries(stats.byType).map(([type, count]) => {
                const Icon = typeColors[type as BrainNode['type']].icon;
                return (
                  <div key={type} className="flex items-center gap-1.5 text-xs">
                    <Icon size={12} className="text-[#FFD700]" />
                    <span className="text-[#8a8a95]">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Search - GOLD border */}
          <div className="relative w-80">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FFD700]" />
            <input
              type="text"
              placeholder="Search your thoughts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#161B22] border border-[#FFD700]/20 rounded-xl text-sm text-white placeholder:text-[#8a8a95] focus:border-[#FFD700]/50 focus:outline-none transition-colors"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 h-screen flex">
        {/* Left Panel - GOLD accents */}
        <aside className="w-64 border-r border-[#FFD700]/20 bg-[#0D1117]/50 p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-6 p-1 bg-[#161B22] rounded-xl">
            <button
              onClick={() => setViewMode('graph')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'graph'
                  ? 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black'
                  : 'text-[#8a8a95] hover:text-white'
              }`}
            >
              <Network size={16} />
              Graph
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black'
                  : 'text-[#8a8a95] hover:text-white'
              }`}
            >
              <FileText size={16} />
              List
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-xs font-bold text-[#FFD700] uppercase tracking-wider mb-3 px-2">
              Filter by Type
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => setActiveFilter('all')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all ${
                  activeFilter === 'all'
                    ? 'bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/40'
                    : 'text-[#8a8a95] hover:text-white hover:bg-white/5'
                }`}
              >
                <Command size={16} />
                <span className="flex-1 text-left">All Nodes</span>
                <span className="text-xs text-[#8a8a95]">{stats.total}</span>
              </button>

              {(['goal', 'project', 'idea', 'note', 'resource'] as const).map((type) => {
                const Icon = typeColors[type].icon;
                const count = stats.byType[type];
                return (
                  <button
                    key={type}
                    onClick={() => setActiveFilter(type)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all capitalize ${
                      activeFilter === type
                        ? `${typeColors[type].bg} text-white border ${typeColors[type].border}`
                        : 'text-[#8a8a95] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon size={16} />
                    <span className="flex-1 text-left">{type}s</span>
                    <span className="text-xs text-[#8a8a95]">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-xs font-bold text-[#FFD700] uppercase tracking-wider mb-3 px-2">
              Pinned Thoughts
            </h3>
            <div className="space-y-2">
              {nodes
                .filter((n) => n.isPinned)
                .map((node) => {
                  const Icon = typeColors[node.type].icon;
                  return (
                    <button
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      className="w-full text-left p-3 rounded-xl bg-[#161B22] border border-[#FFD700]/30 hover:border-[#FFD700]/50 transition-all group"
                    >
                      <div className="flex items-start gap-2">
                        <Icon size={14} className="text-[#FFD700] mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate group-hover:text-[#FFD700] transition-colors">
                            {node.title}
                          </p>
                          <p className="text-xs text-[#8a8a95] truncate mt-0.5">
                            {node.content.slice(0, 50)}...
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>

          <button
            onClick={() => setIsCreating(true)}
            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-xl font-semibold text-black hover:brightness-110 transition-all shadow-lg shadow-[#FFD700]/30"
          >
            <Plus size={18} />
            New Thought
          </button>
        </aside>

        {/* Center - Graph/List View */}
        <section className="flex-1 relative">
          {viewMode === 'graph' ? (
            <div className="absolute inset-0">
              <GraphCanvas nodes={filteredNodes} onSelectNode={setSelectedNode} />
              
              <div className="absolute bottom-4 left-4 p-4 rounded-xl bg-[#161B22]/90 backdrop-blur border border-[#FFD700]/20">
                <p className="text-xs font-bold text-[#FFD700] mb-2">Node Types</p>
                <div className="space-y-1">
                  {Object.entries(typeColors).map(([type, { glow }]) => (
                    <div key={type} className="flex items-center gap-2 text-xs">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: glow, boxShadow: `0 0 8px ${glow}` }}
                      />
                      <span className="text-[#8a8a95] capitalize">{type}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 overflow-y-auto h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredNodes.map((node) => {
                  const Icon = typeColors[node.type].icon;
                  const colors = typeColors[node.type];
                  return (
                    <button
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      className={`text-left p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.02] group ${colors.bg} ${colors.border}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className={`p-2 rounded-xl ${colors.bg}`}>
                          <Icon size={18} className="text-white" />
                        </div>
                        {node.isPinned && (
                          <Star size={14} className="text-[#FFD700] fill-[#FFD700]" />
                        )}
                      </div>
                      <h3 className="font-bold text-white mb-2 group-hover:text-[#FFD700] transition-colors">
                        {node.title}
                      </h3>
                      <p className="text-sm text-[#8a8a95] line-clamp-2 mb-3">
                        {node.content}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {node.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-[10px] rounded-full bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#8a8a95]">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {node.updatedAt}
                        </span>
                        <span className="flex items-center gap-1">
                          <Link2 size={12} />
                          {node.connections.length}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* Right Panel - GOLD accents */}
        {selectedNode && (
          <aside className="w-96 border-l border-[#FFD700]/20 bg-[#0D1117]/80 backdrop-blur p-6 overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div className={`p-3 rounded-xl ${typeColors[selectedNode.type].bg}`}>
                {(() => {
                  const Icon = typeColors[selectedNode.type].icon;
                  return <Icon size={24} className="text-white" />;
                })()}
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg hover:bg-white/10 text-[#8a8a95] hover:text-white transition-colors">
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="p-2 rounded-lg hover:bg-white/10 text-[#8a8a95] hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <h2 className="text-xl font-black text-white mb-2">
              {selectedNode.title}
            </h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedNode.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs rounded-full bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="prose prose-invert prose-sm max-w-none mb-6">
              <p className="text-[#8a8a95] leading-relaxed whitespace-pre-wrap">
                {selectedNode.content}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xs font-bold text-[#FFD700] uppercase tracking-wider mb-3 flex items-center gap-2">
                <Link2 size={14} />
                Connected Nodes ({connectedNodes.length})
              </h3>
              <div className="space-y-2">
                {connectedNodes.map((node) => {
                  const Icon = typeColors[node.type].icon;
                  return (
                    <button
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      className="w-full text-left p-3 rounded-xl bg-[#161B22] border border-white/5 hover:border-[#FFD700]/30 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={14} className="text-[#8a8a95]" />
                        <span className="text-sm text-white group-hover:text-[#FFD700] transition-colors">
                          {node.title}
                        </span>
                        <ChevronRight size={14} className="ml-auto text-[#8a8a95]" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-xs text-[#8a8a95]">
                <span>Created: {selectedNode.createdAt}</span>
                <span>Updated: {selectedNode.updatedAt}</span>
              </div>
            </div>
          </aside>
        )}
      </main>

      {/* Create Modal - GOLD */}
      {isCreating && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="w-full max-w-2xl bg-[#161B22] border border-[#FFD700]/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Sparkles size={20} className="text-[#FFD700]" />
                Capture New Thought
              </h2>
              <button
                onClick={() => setIsCreating(false)}
                className="p-2 rounded-lg hover:bg-white/10 text-[#8a8a95] hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-[#8a8a95] mb-6">
              Form coming soon... This is your space to capture ideas, notes, resources, and connect them into a knowledge network.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 rounded-xl text-[#8a8a95] hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsCreating(false)}
                className="px-6 py-2 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-xl font-semibold text-black hover:brightness-110 transition-all"
              >
                Save Thought
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
