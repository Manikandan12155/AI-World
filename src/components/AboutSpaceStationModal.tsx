import React, { useState, useEffect } from 'react';
import { X, Cpu, Zap, Radio, Activity, Award, Rocket, Terminal, User, Layers, Globe, Gauge, Lock, Signal, Calendar, Satellite, Share2, Compass, ArrowUpRight, Box, Code } from 'lucide-react';
import { getAssetUrl } from '../utils/assetPath';

// ============================================================================
// NEXORIA UNIVERSE ORBITAL COMMAND - CREW & SYSTEM DATA TEMPLATE
// ============================================================================
export interface NexoriaCrewCredential {
  id: string;
  name: string;
  shortName: string;
  agencyCode: string;
  rankTitle: string;
  missionPatch: string;
  clearanceCode: string;
  flightStatus: 'ACTIVE FLIGHT MANIFEST' | 'ON ORBIT' | 'STANDBY';
  avatarUrl: string;
  officialBio: string;
  quote: string;
  crewDetails: {
    crewId: string;
    clearance: string;
    role: string;
    division: string;
    location: string;
    status: string;
  };
  telemetryMetrics: {
    label: string;
    value: string;
    status: 'OPTIMAL' | 'NORMAL' | 'SECURE';
    color: 'emerald' | 'cyan' | 'rose';
    iconType: 'dsn' | 'time' | 'speed';
  }[];
  flightSpecializations: {
    title: string;
    description: string;
    icon: 'satellite' | 'cube' | 'atom' | 'dish';
  }[];
  officialLinks: {
    label: string;
    subtitle: string;
    url: string;
    type: 'github' | 'key' | 'dsn';
  }[];
}

export interface NexoriaFlightModule {
  id: string;
  moduleName: string;
  nexoriaCode: string;
  status: string;
  operatorAgency: string;
  description: string;
  systemSpecs: string[];
}

export const NEXORIA_CREW_DATA: NexoriaCrewCredential = {
  id: 'nexoria-crew-01',
  name: 'MANIKANDAN A.',
  shortName: 'MANIKANDAN',
  agencyCode: 'NEXORIA UNIVERSE // ORBITAL COMMAND',
  rankTitle: 'Chief Flight Director & Lead Universe Systems Architect',
  missionPatch: 'NEXORIA ALPHA // UNIVERSE OVERSEER',
  clearanceCode: 'NEXORIA-TS-L5-OVERRIDE',
  flightStatus: 'ACTIVE FLIGHT MANIFEST',
  avatarUrl: getAssetUrl('/author/ChatGPT Image Sep 22, 2026, 12_16_22 PM.png'),
  officialBio: 'Lead Flight Controller and Systems Architect building NEXORIA Universe. Engineering photorealistic 3D orbital canvas systems, deep-space telemetry rendering, real-time AI intelligence, and interactive tech portals.',
  quote: 'Turning complex challenges into real-world impact.',
  crewDetails: {
    crewId: 'NX-0842-MK',
    clearance: 'LEVEL-5',
    role: 'Flight Director',
    division: 'Universe Systems & AI Telemetry',
    location: 'NEXORIA HQ - Orbital Station',
    status: 'ON DUTY'
  },
  telemetryMetrics: [
    { label: 'NEXORIA SIGNAL', value: '99.98% Lock', status: 'OPTIMAL', color: 'emerald', iconType: 'dsn' },
    { label: 'FLIGHT TIME', value: '1,420 Days', status: 'NORMAL', color: 'cyan', iconType: 'time' },
    { label: 'ORBITAL SPEED', value: '27,580 km/h', status: 'SECURE', color: 'rose', iconType: 'speed' }
  ],
  flightSpecializations: [
    {
      title: 'Spaceflight Telemetry Systems',
      description: 'Real-time data acquisition & visualization',
      icon: 'satellite'
    },
    {
      title: 'Orbital Dynamics & 3D Shaders',
      description: 'Physics-based simulation & rendering',
      icon: 'cube'
    },
    {
      title: 'React & WebGL Real-time Engines',
      description: 'Interactive space visualization platforms',
      icon: 'atom'
    },
    {
      title: 'NEXORIA AI Data Integration',
      description: 'Deep Space Network telemetry & command systems',
      icon: 'dish'
    }
  ],
  officialLinks: [
    {
      label: 'NEXORIA GitHub',
      subtitle: 'Access Repositories',
      url: 'https://github.com',
      type: 'github'
    },
    {
      label: 'Flight Controller Credentials',
      subtitle: 'Secure Access',
      url: '#',
      type: 'key'
    },
    {
      label: 'NEXORIA Telemetry Link',
      subtitle: 'Live Mission Data',
      url: '#',
      type: 'dsn'
    }
  ]
};

export const NEXORIA_FLIGHT_MODULES: NexoriaFlightModule[] = [
  {
    id: 'nx-mod-01',
    moduleName: 'NEXORIA 3D Universe Canvas Module',
    nexoriaCode: 'NX-MOD-UNIVERSE-3D',
    status: 'NOMINAL // 100% OPERATIONAL',
    operatorAgency: 'NEXORIA ORBITAL COMMAND',
    description: 'Primary 3D space visualizer module. Hosts photorealistic Earth day/night shaders, solar corona flares, planetary trajectory lines, and trans-Neptunian belts.',
    systemSpecs: ['Three.js Canvas Engine', 'GLSL Custom Shaders', 'WebGL 2.0 Telemetry']
  },
  {
    id: 'nx-mod-02',
    moduleName: 'NEXORIA Satellite Telemetry Node',
    nexoriaCode: 'NX-MOD-[#02]-NODE',
    status: 'ACTIVE // TELEMETRY OK',
    operatorAgency: 'NEXORIA INTELLIGENCE',
    description: 'Central tracking network linking orbital satellite overlays, technology category filters, and interactive HUD data tags.',
    systemSpecs: ['React 18 Architecture', 'TypeScript Static Types', 'Tailwind CSS Engine']
  },
  {
    id: 'nx-mod-03',
    moduleName: 'NEXORIA AI Synapse Core',
    nexoriaCode: 'NX-MOD-AI-SYNAPSE',
    status: 'ACTIVE // LISTENING',
    operatorAgency: 'NEXORIA AI',
    description: 'Interactive neural intelligence assistant answering user queries regarding space technologies, AI frameworks, and orbital mechanics.',
    systemSpecs: ['LLM Neural API Engine', 'Client-side State Controller', 'Glassmorphism HUD']
  }
];

interface AboutSpaceStationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutSpaceStationModal: React.FC<AboutSpaceStationModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'manifest' | 'modules' | 'directives' | 'telemetry' | 'comms' | 'status'>('manifest');
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
      const dayStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase();
      setCurrentTime(`${dayStr}  ${timeStr} IST`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

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

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-2xl animate-in fade-in duration-200">
      
      {/* Outer Container with Cyberpunk Blue & Red Ambient Glow */}
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-2xl bg-[#040812] border border-[#1b3459] shadow-[0_0_60px_rgba(11,61,145,0.4)] overflow-hidden text-slate-100 font-sans">
        
        {/* Dual Side Glow Accent Bars */}
        <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-red-600 via-rose-500 to-transparent shadow-[0_0_15px_#ef4444]" />
        <div className="absolute top-0 bottom-0 right-0 w-1 bg-gradient-to-b from-blue-600 via-cyan-400 to-transparent shadow-[0_0_15px_#38bdf8]" />

        {/* 1. NEXORIA TOP HEADER SECTION */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-[#152e50] bg-[#050c18] relative">
          <div className="flex items-center gap-4">
            {/* NEXORIA Alien Emblem Badge */}
            <img
              src={getAssetUrl('/logo/alien_logo.jpg')}
              alt="NEXORIA"
              className="w-12 h-12 rounded-full border-2 border-cyan-400 object-cover shadow-[0_0_15px_rgba(56,189,248,0.6)] shrink-0"
            />

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black tracking-widest text-white uppercase font-['Space_Grotesk']">
                  NEXORIA ORBITAL COMMAND
                </h2>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase tracking-wide">
                  NX-HQ COMMAND
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-400 tracking-wider uppercase">
                MANI TECH TOMORROW. TODAY. // DEEP SPACE UNIVERSE NETWORK
              </p>
              <p className="text-[11px] font-mono text-slate-300 flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                <span className="text-cyan-300 font-bold">NEXORIA ORBITAL OPERATIONS</span>
                <span className="text-slate-600">|</span>
                <span>ALT: 418.2 KM</span>
                <span className="text-slate-600">|</span>
                <span>VEL: 27,580 KM/H</span>
                <span className="text-slate-600">|</span>
                <span className="text-emerald-400 font-bold">SIGNAL: 100% LOCK</span>
              </p>
            </div>
          </div>

          {/* Right Header Widget: Clock & Mini Globe Earth Preview */}
          <div className="hidden md:flex items-center gap-4">
            <div className="text-right font-mono">
              <div className="text-[10px] text-slate-400 tracking-widest uppercase">
                {currentTime.split('  ')[0] || 'TUE, SEP 22, 2026'}
              </div>
              <div className="text-sm font-black text-cyan-300 tracking-wider">
                {currentTime.split('  ')[1] || '15:42:17 IST'}
              </div>
            </div>

            {/* Earth Hologram Graphic Container */}
            <div className="w-11 h-11 rounded-full border-2 border-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.6)] overflow-hidden bg-slate-950 relative flex items-center justify-center shrink-0">
              <img
                src={getAssetUrl('/textures/Daytime.png')}
                alt="Photorealistic Earth"
                className="w-full h-full object-cover animate-spin-slow"
              />
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#122744] border border-transparent hover:border-[#1e3c6a] transition-all cursor-pointer"
              title="Close Terminal (ESC)"
            >
              <X className="w-5 h-5 text-slate-300" />
            </button>
          </div>
        </div>

        {/* 2. NAVIGATION TABS BAR */}
        <div className="flex items-center gap-1.5 px-6 py-2 border-b border-[#142a49] bg-[#071120] overflow-x-auto no-scrollbar">
          {[
            { id: 'manifest', label: 'FLIGHT CREW MANIFEST', icon: User },
            { id: 'modules', label: 'NEXORIA MODULES', icon: Layers },
            { id: 'directives', label: 'MISSION DIRECTIVES', icon: Globe },
            { id: 'telemetry', label: 'LIVE TELEMETRY', icon: Radio },
            { id: 'comms', label: 'COMMUNICATIONS', icon: Signal },
            { id: 'status', label: 'SYSTEM STATUS', icon: Activity }
          ].map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-1.5 rounded text-xs font-mono font-bold uppercase transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#0B3D91] text-white border border-cyan-400 shadow-[0_0_15px_rgba(11,61,145,0.8)]'
                    : 'text-slate-300 hover:text-white hover:bg-[#11233f]'
                }`}
              >
                <IconComp className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-300' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 3. MAIN TERMINAL CONTENT */}
        <div className="p-5 sm:p-6 overflow-y-auto max-h-[calc(92vh-150px)] space-y-5 custom-scrollbar bg-[#030712]">
          
          {/* TAB 1: FLIGHT CREW MANIFEST */}
          {activeTab === 'manifest' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* LEFT COLUMN: FULL SIZE CREW PORTRAIT CARD */}
              <div className="lg:col-span-4 flex flex-col justify-between rounded-xl bg-gradient-to-b from-[#08172c] via-[#050f1d] to-[#020710] border-2 border-[#16355e] p-4 shadow-2xl relative overflow-hidden space-y-4">
                
                {/* Full-size Portrait Box */}
                <div className="relative w-full rounded-lg overflow-hidden border-2 border-cyan-500/70 shadow-[0_0_25px_rgba(11,61,145,0.6)] bg-slate-950">
                  
                  {/* Space Earth Background behind Author Cutout */}
                  <img
                    src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop"
                    alt="Space Earth"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen"
                  />

                  {/* Main Full-Size Author Portrait */}
                  <img
                    src={NEXORIA_CREW_DATA.avatarUrl}
                    alt={NEXORIA_CREW_DATA.name}
                    className="relative z-10 w-full h-72 sm:h-80 object-cover object-top transition-transform duration-500 hover:scale-103"
                  />

                  {/* NEXORIA Emblem Overlay Top Right */}
                  <div className="absolute top-3 right-3 z-20 flex flex-col items-end">
                    <img
                      src={getAssetUrl('/logo/alien_logo.jpg')}
                      alt="NEXORIA"
                      className="w-10 h-10 rounded-full border border-cyan-400 object-cover shadow"
                    />
                    <span className="text-[8px] font-mono text-cyan-200 mt-1 max-w-[90px] text-right leading-tight drop-shadow">
                      "BUILDING SYSTEMS FOR A BETTER TOMORROW"
                    </span>
                  </div>

                  {/* Status Badges Overlay at Bottom */}
                  <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded text-[10px] font-mono font-black bg-[#10b981] text-slate-950 shadow-md uppercase tracking-wide">
                      {NEXORIA_CREW_DATA.flightStatus}
                    </span>
                    <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-[#0B3D91] text-cyan-200 border border-cyan-400 shadow uppercase">
                      NEXORIA ISS
                    </span>
                  </div>
                </div>

                {/* Author Name & Metadata Table */}
                <div className="space-y-3 bg-[#040b17] p-4 rounded-lg border border-[#122848]">
                  <div className="flex items-center justify-between border-b border-[#142d52] pb-2">
                    <h3 className="text-xl font-black text-white font-['Space_Grotesk'] tracking-wider">
                      {NEXORIA_CREW_DATA.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                      NX-HQ
                    </span>
                  </div>

                  <p className="text-xs font-mono font-bold text-cyan-300">
                    {NEXORIA_CREW_DATA.rankTitle}
                  </p>

                  {/* Key-Value Metadata Grid */}
                  <div className="space-y-1.5 pt-1 font-mono text-xs text-slate-300">
                    <div className="flex items-center justify-between py-1 border-b border-slate-900">
                      <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                        <User className="w-3 h-3 text-cyan-400" /> CREW ID
                      </span>
                      <span className="font-bold text-slate-100">{NEXORIA_CREW_DATA.crewDetails.crewId}</span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-slate-900">
                      <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                        <Lock className="w-3 h-3 text-cyan-400" /> CLEARANCE
                      </span>
                      <span className="font-extrabold text-emerald-400">{NEXORIA_CREW_DATA.crewDetails.clearance}</span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-slate-900">
                      <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                        <Award className="w-3 h-3 text-cyan-400" /> ROLE
                      </span>
                      <span className="font-medium text-slate-200">{NEXORIA_CREW_DATA.crewDetails.role}</span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-slate-900">
                      <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                        <Layers className="w-3 h-3 text-cyan-400" /> DIVISION
                      </span>
                      <span className="font-medium text-slate-200">{NEXORIA_CREW_DATA.crewDetails.division}</span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-slate-900">
                      <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                        <Compass className="w-3 h-3 text-cyan-400" /> LOCATION
                      </span>
                      <span className="font-medium text-slate-200">{NEXORIA_CREW_DATA.crewDetails.location}</span>
                    </div>

                    <div className="flex items-center justify-between py-1">
                      <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                        <Activity className="w-3 h-3 text-cyan-400" /> STATUS
                      </span>
                      <span className="font-bold text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                        {NEXORIA_CREW_DATA.crewDetails.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quote Callout Box */}
                <div className="p-3.5 rounded-lg bg-[#030914] border border-[#102442] italic text-xs font-serif text-slate-300 text-center">
                  “ {NEXORIA_CREW_DATA.quote} ”
                </div>

              </div>

              {/* RIGHT COLUMN: MISSION OVERVIEW, GAUGES, SPECIALIZATIONS & LINKS */}
              <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
                
                {/* 1. MISSION OVERVIEW CARD WITH SPACE STATION RENDER */}
                <div className="rounded-xl bg-gradient-to-r from-[#07162d] via-[#051124] to-[#040c1a] border border-[#163560] p-4 sm:p-5 shadow-lg relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-2 max-w-lg">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-300 uppercase tracking-widest">
                      <Rocket className="w-4 h-4 text-cyan-400" />
                      <span>NEXORIA UNIVERSE MISSION OVERVIEW</span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed font-sans">
                      {NEXORIA_CREW_DATA.officialBio}
                    </p>
                  </div>

                  {/* Space Station Graphic Banner */}
                  <div className="w-full sm:w-52 h-28 rounded-lg overflow-hidden border border-cyan-500/40 relative shrink-0 shadow">
                    <img
                      src="https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?q=80&w=400&auto=format&fit=crop"
                      alt="NEXORIA Space Station"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#040c1a] via-transparent to-transparent" />
                    <span className="absolute bottom-1 right-2 text-[9px] font-mono text-cyan-300 font-bold">
                      NEXORIA ORBITAL LAB
                    </span>
                  </div>
                </div>

                {/* 2. TELEMETRY GAUGES (3 GAUGES WITH COLOR BARS) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  
                  {/* Gauge 1: DSN Signal */}
                  <div className="p-4 rounded-xl bg-[#061426] border border-[#16335c] space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Radio className="w-4 h-4 text-emerald-400" /> DSN SIGNAL
                      </span>
                    </div>
                    <div className="text-xl font-black text-white font-mono">
                      {NEXORIA_CREW_DATA.telemetryMetrics[0].value}
                    </div>
                    {/* Emerald Progress Bar */}
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full w-[98%] shadow-[0_0_8px_#34d399]" />
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-emerald-400 font-bold uppercase">OPTIMAL</span>
                      <span className="text-slate-500 font-sans">~~~~~</span>
                    </div>
                  </div>

                  {/* Gauge 2: Flight Time */}
                  <div className="p-4 rounded-xl bg-[#061426] border border-[#16335c] space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-cyan-400" /> FLIGHT TIME
                      </span>
                    </div>
                    <div className="text-xl font-black text-white font-mono">
                      {NEXORIA_CREW_DATA.telemetryMetrics[1].value}
                    </div>
                    {/* Cyan Progress Bar */}
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-400 rounded-full w-[85%] shadow-[0_0_8px_#38bdf8]" />
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-cyan-400 font-bold uppercase">NORMAL</span>
                      <span className="text-slate-500 font-sans">|||||||</span>
                    </div>
                  </div>

                  {/* Gauge 3: Orbital Speed */}
                  <div className="p-4 rounded-xl bg-[#061426] border border-[#16335c] space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Gauge className="w-4 h-4 text-rose-400" /> ORBITAL SPEED
                      </span>
                    </div>
                    <div className="text-xl font-black text-white font-mono">
                      {NEXORIA_CREW_DATA.telemetryMetrics[2].value}
                    </div>
                    {/* Rose Progress Bar */}
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full w-[94%] shadow-[0_0_8px_#f43f5e]" />
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-rose-400 font-bold uppercase">SECURE</span>
                      <span className="text-slate-500 font-sans">~~~~~</span>
                    </div>
                  </div>

                </div>

                {/* 3. FLIGHT SPECIALIZATIONS & SYSTEMS CAPABILITIES (2x2 GRID) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-cyan-300 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-cyan-400" />
                      <span>FLIGHT SPECIALIZATIONS & SYSTEMS CAPABILITIES</span>
                    </span>
                    <span className="text-[10px] text-slate-400 hover:text-cyan-300 cursor-pointer">VIEW ALL →</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {NEXORIA_CREW_DATA.flightSpecializations.map((spec, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-[#061426] border border-[#153159] hover:border-cyan-400 transition-all flex items-start gap-3 group"
                      >
                        <div className="p-2.5 rounded-lg bg-[#0a1e3b] border border-[#1b3d6f] text-cyan-400 group-hover:text-white group-hover:bg-[#0B3D91] transition-colors shrink-0">
                          {spec.icon === 'satellite' && <Satellite className="w-5 h-5" />}
                          {spec.icon === 'cube' && <Box className="w-5 h-5" />}
                          {spec.icon === 'atom' && <Code className="w-5 h-5" />}
                          {spec.icon === 'dish' && <Radio className="w-5 h-5" />}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white group-hover:text-cyan-200 transition-colors">
                            {spec.title}
                          </h4>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {spec.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. OFFICIAL NEXORIA ACCESS LINKS */}
                <div className="space-y-2 pt-1">
                  <div className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-widest flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>OFFICIAL NEXORIA ACCESS LINKS</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {NEXORIA_CREW_DATA.officialLinks.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-xl bg-[#07172e] border border-[#173763] hover:border-cyan-400 hover:bg-[#0c2447] transition-all flex items-center justify-between group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-lg bg-[#0b2142] text-cyan-300 group-hover:text-white transition-colors">
                            {link.type === 'github' && <Terminal className="w-4 h-4" />}
                            {link.type === 'key' && <Lock className="w-4 h-4" />}
                            {link.type === 'dsn' && <Signal className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white group-hover:text-cyan-200 transition-colors">
                              {link.label}
                            </div>
                            <div className="text-[10px] font-mono text-slate-400">
                              {link.subtitle}
                            </div>
                          </div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-300 transition-colors shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: NEXORIA FLIGHT MODULES */}
          {activeTab === 'modules' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#0a1e3b] border border-[#1b3d6f] text-xs font-mono text-cyan-200 flex items-center gap-3">
                <Cpu className="w-5 h-5 text-cyan-400 shrink-0" />
                <div>
                  <div className="font-bold text-white text-sm">NEXORIA ORBITAL MODULE ARCHITECTURE</div>
                  <div>Live module telemetry and rendering software specs powering NEXORIA Universe.</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {NEXORIA_FLIGHT_MODULES.map((mod) => (
                  <div
                    key={mod.id}
                    className="p-4 rounded-xl bg-[#061426] border border-[#16335c] hover:border-cyan-400 transition-all space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-cyan-300 bg-[#0B3D91] px-2 py-0.5 rounded border border-cyan-400">
                          {mod.nexoriaCode}
                        </span>
                        <span className="text-[9px] font-mono text-emerald-400 font-bold">
                          {mod.status}
                        </span>
                      </div>

                      <h4 className="text-sm font-black text-white mt-3 font-['Space_Grotesk']">
                        {mod.moduleName}
                      </h4>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {mod.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#142d50]">
                      <div className="text-[10px] font-mono text-slate-400 uppercase mb-1.5">SYSTEM ARCHITECTURE</div>
                      <div className="flex flex-wrap gap-1">
                        {mod.systemSpecs.map((spec, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-[10px] bg-[#0a1f3c] text-slate-200 border border-[#16355e] font-mono"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: MISSION DIRECTIVES */}
          {activeTab === 'directives' && (
            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-[#061426] border border-[#16335c] space-y-4">
                <div className="flex items-center gap-3 border-b border-[#142d50] pb-3">
                  <Globe className="w-6 h-6 text-cyan-400" />
                  <div>
                    <h3 className="text-base font-black text-white font-['Space_Grotesk']">
                      NEXORIA UNIVERSE MISSION DIRECTIVE & VISION STATEMENT
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      NEXORIA Orbital Command & Deep Space Tech Intelligence Initiative.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#040c1a] border border-[#122746] space-y-2">
                    <div className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5">
                      <Terminal className="w-4 h-4 text-cyan-400" />
                      <span>1. Photorealistic 360° Planetary Telemetry</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      Rendering 1:1 photorealistic Earth day/night terminators, solar corona flames, orbital trajectories, comets, asteroids, and trans-Neptunian belts.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#040c1a] border border-[#122746] space-y-2">
                    <div className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-cyan-400" />
                      <span>2. Real-time Tech Intelligence Engine</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      Providing live data overlays for emerging AI architectures, LLM models, satellite node networks, research papers, and technical momentum.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* 4. BOTTOM NEXORIA FOOTER BAR */}
        <div className="px-6 py-3 border-t border-[#142a49] bg-[#040c1a] flex items-center justify-between text-xs text-slate-300 font-mono">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              NEXORIA LINK: ONLINE
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline">ORBITAL COMMAND HQ</span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden md:inline text-cyan-400 font-semibold">ALL SYSTEMS NOMINAL</span>
          </div>

          <div>
            <button
              onClick={onClose}
              className="px-5 py-1.5 rounded font-mono font-black text-xs bg-[#FC3D21] hover:bg-red-600 text-white shadow-[0_0_15px_rgba(252,61,33,0.5)] transition-all cursor-pointer uppercase tracking-wider"
            >
              CLOSE TERMINAL [ESC]
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
