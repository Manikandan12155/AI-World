import React from 'react';
import { X, ExternalLink, Activity, Cpu, Sparkles, TrendingUp, Compass } from 'lucide-react';
import type { TechnologyNode } from '../data/technologyData';

interface CategoryDetailModalProps {
  node: TechnologyNode | null;
  onClose: () => void;
}

export const CategoryDetailModal: React.FC<CategoryDetailModalProps> = ({ node, onClose }) => {
  if (!node) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-lg bg-[#070e1c]/95 backdrop-blur-2xl border-l border-cyan-500/30 shadow-[0_0_60px_rgba(0,0,0,0.9)] flex flex-col animate-in slide-in-from-right duration-300 pointer-events-auto">
      {/* Header */}
      <div className="p-6 border-b border-slate-800 flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full shadow-[0_0_10px_currentColor]"
              style={{ color: node.glowColor, backgroundColor: node.glowColor }}
            />
            <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-widest">
              {node.category}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white font-['Space_Grotesk']">
            {node.name}
          </h2>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Headline Banner */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <h3 className="text-sm font-semibold text-cyan-200 mb-2">
            {node.headline}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {node.description}
          </p>
        </div>

        {/* Real-time Metric Badges */}
        <div>
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>Telemetry & Live Metrics</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {node.stats.map((s, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 text-center"
              >
                <div className="text-base font-bold text-white font-['Space_Grotesk']">
                  {s.value}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Topics */}
        <div>
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
            <span>Trending Sub-Vectors</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {node.trendingTopics.map((topic, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-xs bg-purple-950/40 text-purple-300 border border-purple-800/50 flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-purple-400" />
                {topic}
              </span>
            ))}
          </div>
        </div>

        {/* Key Frameworks & Ecosystem Tools */}
        <div>
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-blue-400" />
            <span>Key Platforms & Standard Tools</span>
          </div>
          <div className="space-y-2">
            {node.keyTools.map((tool, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                <span className="text-xs font-medium text-slate-200">{tool}</span>
                <span className="text-[10px] text-cyan-400 flex items-center gap-1">
                  Verified <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-slate-800 bg-slate-950/80 flex items-center gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs tracking-wide shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all flex items-center justify-center gap-2"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Launch Full Category Universe</span>
        </button>
      </div>
    </div>
  );
};
