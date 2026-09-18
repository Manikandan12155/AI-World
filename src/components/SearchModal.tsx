import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { TECHNOLOGY_NODES, MOCK_NEWS_CARDS } from '../data/technologyData';
import type { TechnologyNode, NewsCardData } from '../data/technologyData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNode: (node: TechnologyNode) => void;
  onSelectArticle: (article: NewsCardData) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectNode,
  onSelectArticle
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredNodes = TECHNOLOGY_NODES.filter((n) =>
    n.name.toLowerCase().includes(query.toLowerCase()) ||
    n.category.toLowerCase().includes(query.toLowerCase()) ||
    n.trendingTopics.some((t) => t.toLowerCase().includes(query.toLowerCase()))
  );

  const filteredNews = MOCK_NEWS_CARDS.filter((art) =>
    art.title.toLowerCase().includes(query.toLowerCase()) ||
    art.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#081223] border border-slate-700/80 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800">
          <Search className="w-5 h-5 text-cyan-400 mr-3 shrink-0" />
          <input
            type="text"
            placeholder="Search technologies, AI models, tools, papers, jobs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {/* Tech Universe Nodes */}
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
              Technology Nodes ({filteredNodes.length})
            </div>
            <div className="space-y-1">
              {filteredNodes.map((node) => (
                <div
                  key={node.id}
                  onClick={() => {
                    onSelectNode(node);
                    onClose();
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/60 cursor-pointer group transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: node.glowColor }} />
                    <div>
                      <div className="text-sm font-semibold text-white group-hover:text-cyan-300">
                        {node.name}
                      </div>
                      <div className="text-xs text-slate-400">{node.category}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              ))}
            </div>
          </div>

          {/* News & Intelligence */}
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
              Latest Intelligence ({filteredNews.length})
            </div>
            <div className="space-y-1">
              {filteredNews.map((news) => (
                <div
                  key={news.id}
                  onClick={() => {
                    onSelectArticle(news);
                    onClose();
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/60 cursor-pointer group transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                      {news.category}
                    </span>
                    <span className="text-sm text-slate-200 group-hover:text-white line-clamp-1">
                      {news.title}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">{news.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span>Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-300 font-mono">ESC</kbd> to exit</span>
          </div>
          <span>NEXORIA Command Search</span>
        </div>
      </div>
    </div>
  );
};
