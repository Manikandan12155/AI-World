import { useState, useEffect } from 'react';
import { Search, Moon, Bot, X, Send, Activity, TrendingUp, Cpu, Compass, Settings } from 'lucide-react';
import { TECH_NODES_OVERLAY } from './data/overlayData';
import type { TechNodeOverlay } from './data/overlayData';
import { Master3DUniverseCanvas } from './three/Master3DUniverseCanvas';
import { AboutSpaceStationModal } from './components/AboutSpaceStationModal';
import { getAssetUrl } from './utils/assetPath';

export interface UniverseSettings {
  showEarth?: boolean;
  showSun?: boolean;
  showPlanets: boolean;
  showMoons: boolean;
  showDwarfPlanets: boolean;
  showComets: boolean;
  showSatellites: boolean;
  showAsteroids: boolean;
  showOrbits: boolean;
  showNames: boolean;
}

const CustomToggle = ({ checked, onChange }: { checked: boolean; onChange: (val: boolean) => void }) => {
  return (
    <div
      onClick={() => onChange(!checked)}
      className="relative w-14 h-7 rounded-full cursor-pointer bg-[#e8ecf1] shadow-[inset_0_3px_6px_rgba(0,0,0,0.15),inset_0_-3px_6px_rgba(255,255,255,1)] flex items-center shrink-0 border border-slate-300/50"
    >
      <div className="absolute w-full px-2 flex justify-between items-center text-[11px] font-extrabold tracking-wide pointer-events-none">
        <span className={checked ? 'text-slate-400' : 'text-transparent'}>ON</span>
        <span className={!checked ? 'text-slate-400' : 'text-transparent'}>OFF</span>
      </div>
      <div
        className={`absolute w-6 h-6 rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_-2px_4px_rgba(0,0,0,0.2),inset_0_2px_4px_rgba(255,255,255,0.9)] transition-all duration-300 ease-out ${
          checked 
            ? 'translate-x-[30px] bg-gradient-to-br from-[#22c55e] to-[#15803d]' 
            : 'translate-x-[2px] bg-gradient-to-br from-[#f8fafc] to-[#94a3b8]'
        }`}
      >
        <div className={`absolute top-0.5 left-1.5 w-3 h-1.5 rounded-full blur-[1px] opacity-70 ${checked ? 'bg-white' : 'bg-white'}`} />
      </div>
    </div>
  );
};

export function App() {
  const [selectedNode, setSelectedNode] = useState<TechNodeOverlay | null>(null);
  const [activeNav, setActiveNav] = useState('Home');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [universeSettings, setUniverseSettings] = useState<UniverseSettings>({
    showEarth: true,
    showSun: true,
    showPlanets: false,
    showMoons: true,
    showDwarfPlanets: false,
    showComets: false,
    showSatellites: true,
    showAsteroids: false,
    showOrbits: false,
    showNames: true,
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNodePanelOpen, setIsNodePanelOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Close the panel by default when a new node is selected
  useEffect(() => {
    if (selectedNode) {
      setIsNodePanelOpen(false);
    }
  }, [selectedNode]);

  // Keyboard shortcut '/'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !isSearchOpen) {
        if (
          document.activeElement?.tagName !== 'INPUT' &&
          document.activeElement?.tagName !== 'TEXTAREA'
        ) {
          e.preventDefault();
          setIsSearchOpen(true);
        }
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setSelectedNode(null);
        setIsAIAssistantOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    const handleToggleAI = () => setIsAIAssistantOpen((prev) => !prev);
    window.addEventListener('toggle-ai-assistant', handleToggleAI);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('toggle-ai-assistant', handleToggleAI);
    };
  }, [isSearchOpen]);

  const navItems = ['Home', 'Tech News', 'Trends', 'Tools', 'Jobs', 'Research', 'About'];

  // AI Assistant Messages State
  const [aiMessages, setAiMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    {
      sender: 'ai',
      text: 'Greetings! I am NEXORIA Intelligence. What area of the technology universe would you like to Mani Tech today?'
    }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const handleAiSend = (queryText?: string) => {
    const q = queryText || aiInput;
    if (!q.trim()) return;

    const newMsgs = [...aiMessages, { sender: 'user' as const, text: q }];
    setAiMessages(newMsgs);
    setAiInput('');
    setAiLoading(true);

    setTimeout(() => {
      let reply = 'According to real-time NEXORIA telemetry: ';
      if (q.toLowerCase().includes('fastest') || q.toLowerCase().includes('growth')) {
        reply += 'Autonomous Agent Swarms (+88% star velocity), Quantized Edge Reasoning (SLMs), and WebGPU runtimes lead in enterprise adoption.';
      } else if (q.toLowerCase().includes('compare') || q.toLowerCase().includes('langgraph')) {
        reply += 'LangGraph focuses on stateful cyclic graphs with fine-grained checkpointing, whereas CrewAI prioritizes role-based agent personas.';
      } else {
        reply += `Analysis for "${q}": The frontier is rapidly converging on multi-agent execution loops with native tool calling and sub-200ms inference clusters.`;
      }
      setAiMessages([...newMsgs, { sender: 'ai', text: reply }]);
      setAiLoading(false);
    }, 600);
  };

  const filteredNodes = TECH_NODES_OVERLAY.filter(
    (n) =>
      n.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.trendingTopics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="relative w-full h-screen overflow-hidden text-white select-none font-['Inter'] flex flex-col justify-between bg-[#000206]">
      {/* 1. MASTER REAL 3D UNIVERSE CANVAS (NASA Earth + Sun + Moon + Glowing Beams) */}
      <Master3DUniverseCanvas
        selectedNode={selectedNode}
        onSelectNode={(node) => setSelectedNode(node)}
        universeSettings={universeSettings}
        isAnyModalOpen={isAboutOpen || isSearchOpen || isAIAssistantOpen}
      />



      {/* 2. TOP NAVIGATION BAR */}
      <header className="relative z-30 w-full px-6 py-4 flex items-center justify-between pointer-events-auto">
        {/* Brand Logo & Subtitle */}
        <div
          onClick={() => setSelectedNode(null)}
          className="flex items-center gap-3 select-none cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600 flex items-center justify-center p-0.5 shadow-[0_0_20px_rgba(56,189,248,0.5)] group-hover:shadow-[0_0_25px_rgba(56,189,248,0.8)] transition-all">
            <img
              src={getAssetUrl('/logo/alien_logo.jpg')}
              alt="NEXORIA Alien Emblem"
              className="w-full h-full object-cover rounded-[9px]"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold tracking-[0.2em] text-lg text-white font-['Space_Grotesk'] leading-tight group-hover:text-cyan-200 transition-colors">
              NEXORIA
            </span>
            <span className="text-[10px] tracking-[0.15em] text-slate-400 uppercase">
              Mani Tech Tomorrow. Today.
            </span>
          </div>
        </div>

        {/* Navigation Pills */}
        <nav className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/50 backdrop-blur-md border border-slate-800/80 shadow-lg">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => {
                setActiveNav(item);
                if (item === 'About') {
                  setIsAboutOpen(true);
                }
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${activeNav === item
                  ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.6)] font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
            >
              {item}
            </button>
          ))}
        </nav>

        {/* Right Header Controls */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => setIsSearchOpen(true)}
            className="hidden md:flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-slate-950/60 backdrop-blur-md border border-slate-800 hover:border-slate-700 cursor-pointer text-slate-400 text-xs transition-colors group w-64 shadow-inner"
          >
            <span className="truncate group-hover:text-slate-300">
              Search technologies, tools, news...
            </span>
            <div className="ml-auto flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
              <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700 font-mono">
                /
              </span>
            </div>
          </div>

          <button
            className="w-8 h-8 rounded-full bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
            title="Dark Theme Active"
          >
            <Moon className="w-4 h-4" />
          </button>

          {/* Universe Settings Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer border ${
                isSettingsOpen 
                  ? 'bg-cyan-900/80 text-cyan-300 border-cyan-500/60 shadow-[0_0_12px_rgba(34,211,238,0.4)]' 
                  : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:text-white hover:border-slate-700'
              }`}
              title="Universe Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            {isSettingsOpen && (
              <div className="absolute top-12 right-0 w-64 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-xl shadow-2xl p-4 flex flex-col gap-3 z-50">
                <div className="text-xs font-semibold text-cyan-400 mb-1 px-1 tracking-wider uppercase border-b border-slate-700/50 pb-2">Universe Visibility</div>
                
                <label className="flex items-center justify-between px-2 py-1 rounded-lg hover:bg-slate-800/60 transition-colors">
                  <span className="text-sm font-medium text-slate-200">Earth</span>
                  <CustomToggle checked={universeSettings.showEarth ?? true} onChange={(val) => setUniverseSettings(s => ({ ...s, showEarth: val }))} />
                </label>

                <label className="flex items-center justify-between px-2 py-1 rounded-lg hover:bg-slate-800/60 transition-colors">
                  <span className="text-sm font-medium text-slate-200">Sun</span>
                  <CustomToggle checked={universeSettings.showSun ?? true} onChange={(val) => setUniverseSettings(s => ({ ...s, showSun: val }))} />
                </label>

                <label className="flex items-center justify-between px-2 py-1 rounded-lg hover:bg-slate-800/60 transition-colors">
                  <span className="text-sm font-medium text-slate-200">Planets</span>
                  <CustomToggle checked={universeSettings.showPlanets} onChange={(val) => setUniverseSettings(s => ({ ...s, showPlanets: val }))} />
                </label>
                
                <label className="flex items-center justify-between px-2 py-1 rounded-lg hover:bg-slate-800/60 transition-colors">
                  <span className="text-sm font-medium text-slate-200">Moons</span>
                  <CustomToggle checked={universeSettings.showMoons} onChange={(val) => setUniverseSettings(s => ({ ...s, showMoons: val }))} />
                </label>
                
                <label className="flex items-center justify-between px-2 py-1 rounded-lg hover:bg-slate-800/60 transition-colors">
                  <span className="text-sm font-medium text-slate-200">Dwarf Planets</span>
                  <CustomToggle checked={universeSettings.showDwarfPlanets} onChange={(val) => setUniverseSettings(s => ({ ...s, showDwarfPlanets: val }))} />
                </label>
                
                <label className="flex items-center justify-between px-2 py-1 rounded-lg hover:bg-slate-800/60 transition-colors">
                  <span className="text-sm font-medium text-slate-200">Comets</span>
                  <CustomToggle checked={universeSettings.showComets} onChange={(val) => setUniverseSettings(s => ({ ...s, showComets: val }))} />
                </label>

                <label className="flex items-center justify-between px-2 py-1 rounded-lg hover:bg-slate-800/60 transition-colors">
                  <span className="text-sm font-medium text-slate-200">Satellites</span>
                  <CustomToggle checked={universeSettings.showSatellites} onChange={(val) => setUniverseSettings(s => ({ ...s, showSatellites: val }))} />
                </label>

                <label className="flex items-center justify-between px-2 py-1 rounded-lg hover:bg-slate-800/60 transition-colors">
                  <span className="text-sm font-medium text-slate-200">Asteroids</span>
                  <CustomToggle checked={universeSettings.showAsteroids} onChange={(val) => setUniverseSettings(s => ({ ...s, showAsteroids: val }))} />
                </label>

                <div className="h-px bg-slate-700/50 my-1"></div>

                <label className="flex items-center justify-between px-2 py-1 rounded-lg hover:bg-slate-800/60 transition-colors">
                  <span className="text-sm font-medium text-slate-200">Orbit Lines</span>
                  <CustomToggle checked={universeSettings.showOrbits} onChange={(val) => setUniverseSettings(s => ({ ...s, showOrbits: val }))} />
                </label>

                <label className="flex items-center justify-between px-2 py-1 rounded-lg hover:bg-slate-800/60 transition-colors">
                  <span className="text-sm font-medium text-slate-200 text-cyan-200">3D Labels (Names)</span>
                  <CustomToggle checked={universeSettings.showNames} onChange={(val) => setUniverseSettings(s => ({ ...s, showNames: val }))} />
                </label>
              </div>
            )}
          </div>

          <button
            onClick={() => alert('NEXORIA Enterprise Single Sign-On Portal')}
            className="px-5 py-1.5 rounded-full text-xs font-medium text-white bg-[#0e274e]/80 hover:bg-[#153a75] border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all hover:scale-105 cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </header>

      {/* 
        3. HERO & METRICS SECTION
        (Commented out as requested: "outside la erukka text la command pannidu")
      */}
      {/* 
      <div className="relative z-20 flex-1 px-8 md:px-12 flex flex-col justify-between pointer-events-none select-none pb-2">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mt-2">
          <div className="max-w-xl pointer-events-auto">
            <div className="text-[11px] font-semibold tracking-[0.25em] text-slate-400 uppercase mb-3 flex items-center gap-2">
              <span>GLOBAL TECHNOLOGY INTELLIGENCE</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight text-white leading-[1.08] font-['Space_Grotesk'] mb-4">
              A Smarter Tomorrow <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400">Starts Here</span>
            </h1>
            <p className="text-sm md:text-base text-slate-300/90 font-normal leading-relaxed mb-6 max-w-md">
              Real-time insights on AI, cloud, cybersecurity, developer tools, research and more — all in one intelligent platform.
            </p>
            <button className="group flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0d223f]/90 text-white text-xs font-semibold tracking-wide">
              <span>Mani Tech the World</span>
            </button>
          </div>
        </div>
        <div className="flex items-center gap-8 md:gap-12 mt-4 pointer-events-auto">
          <div><span className="text-2xl font-bold">100K+</span><span className="text-[11px] text-slate-400">Tech Updates</span></div>
          <div><span className="text-2xl font-bold">10K+</span><span className="text-[11px] text-slate-400">Tools & Resources</span></div>
          <div><span className="text-2xl font-bold">50K+</span><span className="text-[11px] text-slate-400">Global Developers</span></div>
        </div>
      </div>
      */}

      {/* 
        4. BOTTOM NEWS CARDS SECTION
        (Removed as requested: "these list also remove pannidu")
      */}
      {/* 
      <footer className="relative z-30 w-full px-6 md:px-10 pb-8 pt-1 pointer-events-auto">
        ... bottom cards list ...
      </footer>
      */}

      {/* Spacer to push content */}
      <div className="flex-1 pointer-events-none" />

      {/* 5. FLOATING "ASK INTELLIGENCE" AI BUTTON (Hidden on mobile as it's cleanly integrated into bottom celestial bar) */}
      <button
        onClick={() => setIsAIAssistantOpen(!isAIAssistantOpen)}
        className="hidden sm:flex fixed bottom-6 right-6 z-40 items-center gap-2 px-4 py-2 rounded-full bg-[#0a1b33]/90 hover:bg-[#102a52] border border-cyan-400/50 hover:border-cyan-400 text-white text-xs font-semibold shadow-[0_0_25px_rgba(56,189,248,0.4)] hover:scale-105 transition-all cursor-pointer pointer-events-auto"
      >
        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <Bot className="w-4 h-4 text-cyan-400" />
        <span>Ask Intelligence</span>
      </button>

      {/* 6. CATEGORY DETAIL DRAWER */}
      {selectedNode && !isNodePanelOpen && (
        <button
          onClick={() => setIsNodePanelOpen(true)}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-[#070e1c]/95 border-y border-l border-cyan-500/50 text-cyan-300 font-semibold px-2 py-4 rounded-l-xl shadow-[0_0_20px_rgba(56,189,248,0.4)] hover:bg-[#0f1f3d] transition-all cursor-pointer flex flex-col items-center gap-2 pointer-events-auto group"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span style={{ writingMode: 'vertical-rl' }} className="tracking-widest text-xs">
            DATA LINK
          </span>
          <span className="text-xs group-hover:-translate-x-1 transition-transform">◀</span>
        </button>
      )}

      {selectedNode && isNodePanelOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-lg bg-[#070e1c]/95 backdrop-blur-2xl border-l border-cyan-500/30 shadow-[0_0_60px_rgba(0,0,0,0.9)] flex flex-col animate-in slide-in-from-right duration-300 pointer-events-auto">
          <div className="p-6 border-b border-slate-800 flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shadow-[0_0_10px_currentColor]"
                  style={{ color: selectedNode.glowColor, backgroundColor: selectedNode.glowColor }}
                />
                <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-widest">
                  {selectedNode.category}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white font-['Space_Grotesk']">
                {selectedNode.name}
              </h2>
            </div>

            <button
              onClick={() => setIsNodePanelOpen(false)}
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <h3 className="text-sm font-semibold text-cyan-200 mb-2">
                {selectedNode.headline}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedNode.description}
              </p>
            </div>

            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>Telemetry & Live Metrics</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {selectedNode.stats.map((s, idx) => (
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

            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
                <span>Trending Sub-Vectors</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedNode.trendingTopics.map((topic, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full text-xs bg-purple-950/40 text-purple-300 border border-purple-800/50"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-blue-400" />
                <span>Key Platforms & Standard Tools</span>
              </div>
              <div className="space-y-2">
                {selectedNode.keyTools.map((tool, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 transition-colors"
                  >
                    <span className="text-xs font-medium text-slate-200">{tool}</span>
                    <span className="text-[10px] text-cyan-400">Telemetry Active</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-slate-800 bg-slate-950/80 flex items-center gap-3">
            <button
              onClick={() => setSelectedNode(null)}
              className="flex-1 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs tracking-wide shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Mani Tech Category Constellation</span>
            </button>
          </div>
        </div>
      )}

      {/* 7. COMMAND PALETTE SEARCH MODAL (`/`) */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-2xl bg-[#081223] border border-slate-700/80 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden">
            <div className="flex items-center px-4 py-3.5 border-b border-slate-800">
              <Search className="w-5 h-5 text-cyan-400 mr-3 shrink-0" />
              <input
                type="text"
                placeholder="Search technologies, AI models, tools, papers, jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
              <div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
                  Technology Nodes ({filteredNodes.length})
                </div>
                <div className="space-y-1">
                  {filteredNodes.map((node) => (
                    <div
                      key={node.id}
                      onClick={() => {
                        setSelectedNode(node);
                        setIsSearchOpen(false);
                      }}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/60 cursor-pointer group transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: node.glowColor }}
                        />
                        <div>
                          <div className="text-sm font-semibold text-white group-hover:text-cyan-300">
                            {node.name}
                          </div>
                          <div className="text-xs text-slate-400">{node.category}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-4 py-2.5 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-300 font-mono">ESC</kbd> to exit</span>
              <span>NEXORIA Command Search</span>
            </div>
          </div>
        </div>
      )}

      {/* 8. AI ASSISTANT CHAT DRAWER */}
      {isAIAssistantOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] rounded-2xl bg-[#081223]/95 backdrop-blur-2xl border border-cyan-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col h-[520px] animate-in fade-in slide-in-from-bottom-5 duration-200 pointer-events-auto">
          <div className="px-4 py-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                <Bot className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Ask Intelligence</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-[10px] text-slate-400">Autonomous Technology LLM</div>
              </div>
            </div>

            <button
              onClick={() => setIsAIAssistantOpen(false)}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {aiMessages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${m.sender === 'user'
                      ? 'bg-cyan-600 text-white rounded-br-none shadow-[0_4px_12px_rgba(8,145,178,0.3)]'
                      : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-bl-none shadow-md'
                    }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {aiLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-400 italic py-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>Querying intelligence index...</span>
              </div>
            )}
          </div>

          <div className="px-3 py-2 bg-slate-950/60 border-t border-slate-900 flex gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
            {['What are fastest growing AI tools?', 'Compare LangGraph & CrewAI', 'Next-Gen GPUs'].map(
              (qp, i) => (
                <button
                  key={i}
                  onClick={() => handleAiSend(qp)}
                  className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors shrink-0 cursor-pointer"
                >
                  {qp}
                </button>
              )
            )}
          </div>

          <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask about AI, models, frameworks, hardware..."
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAiSend()}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60"
            />
            <button
              onClick={() => handleAiSend()}
              disabled={!aiInput.trim()}
              className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Futuristic Space Station About Modal */}
      <AboutSpaceStationModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
    </div>
  );
}

export default App;
