import React from 'react';
import { Search, Moon } from 'lucide-react';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenSignIn: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch, onOpenSignIn }) => {
  const navItems = [
    { label: 'Home', active: true },
    { label: 'Tech News', active: false },
    { label: 'Trends', active: false },
    { label: 'Tools', active: false },
    { label: 'Jobs', active: false },
    { label: 'Research', active: false },
    { label: 'About', active: false }
  ];

  return (
    <header className="relative z-40 w-full px-4 sm:px-8 lg:px-12 pt-4 sm:pt-6 flex items-center justify-between pointer-events-auto">
      {/* Brand Logo & Subtitle */}
      <div className="flex items-center gap-3 select-none cursor-pointer shrink-0">
        {/* Futuristic Stylized Cyan Logo Mark */}
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-[14px] bg-gradient-to-br from-cyan-300 via-blue-500 to-indigo-600 flex items-center justify-center p-0.5 shadow-[0_0_26px_rgba(56,189,248,0.62)] rotate-[-8deg]">
          <div className="w-full h-full bg-[#07101f] rounded-[12px] flex items-center justify-center">
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 20L12 4L20 20" />
              <path d="M7 14h10" />
            </svg>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold tracking-[0.27em] text-[20px] sm:text-[26px] text-white font-['Space_Grotesk'] leading-none">
            NEXORIA
          </span>
          <span className="text-[10px] sm:text-[12px] tracking-[0.02em] text-white/90 mt-1 truncate max-w-[170px] sm:max-w-none">
            Mani Tech Tomorrow. Today.
          </span>
        </div>
      </div>

      {/* Navigation Pills (Desktop) */}
      <nav className="hidden lg:flex items-center gap-6 xl:gap-9 pt-2 ml-6 xl:ml-10">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`relative text-[14px] xl:text-[15px] font-medium transition-all duration-200 cursor-pointer ${item.active
                ? 'text-white font-semibold after:absolute after:left-0 after:right-0 after:-bottom-3 after:h-[3px] after:rounded-full after:bg-blue-300 after:shadow-[0_0_16px_rgba(96,165,250,0.95)]'
                : 'text-white/88 hover:text-white'
              }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Right Controls: Search bar + Theme toggle + Sign In */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* Mobile Search Icon Trigger */}
        <button
          onClick={onOpenSearch}
          className="flex xl:hidden p-2 rounded-full bg-slate-900/60 border border-cyan-200/10 text-slate-100 hover:text-cyan-300 transition-colors"
          title="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Search Input Bar (Desktop) */}
        <div
          onClick={onOpenSearch}
          className="hidden xl:flex items-center gap-3 px-5 py-3 rounded-full bg-[#06101d]/58 backdrop-blur-md border border-cyan-200/16 hover:border-cyan-300/40 cursor-pointer text-slate-300/75 text-xs transition-colors group w-[300px] xl:w-[355px] shadow-[inset_0_0_24px_rgba(2,8,23,0.8)]"
        >
          <span className="truncate group-hover:text-slate-300">
            Search technologies, tools, news...
          </span>
          <div className="ml-auto flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
          </div>
        </div>

        {/* Theme Toggle Icon (Moon) */}
        <button
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-900/60 border border-cyan-200/10 flex items-center justify-center text-slate-100 hover:text-white hover:border-cyan-300/40 shadow-[0_0_22px_rgba(125,211,252,0.12)] transition-colors"
          title="Toggle Theme"
        >
          <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Sign In Button */}
        <button
          onClick={onOpenSignIn}
          className="px-4 sm:px-7 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium text-white bg-[#0a1933]/78 hover:bg-[#12346a] border border-blue-400/60 shadow-[0_0_22px_rgba(59,130,246,0.45),inset_0_0_18px_rgba(96,165,250,0.16)] transition-all hover:scale-105 cursor-pointer"
        >
          Sign In
        </button>
      </div>
    </header>
  );
};
