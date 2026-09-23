import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroOverlayProps {
  onExploreWorld?: () => void;
}

export const HeroOverlay: React.FC<HeroOverlayProps> = ({ onExploreWorld }) => {
  return (
    <div className="relative w-full h-full pointer-events-none select-none flex flex-col justify-between px-4 sm:px-8 md:px-12 pt-6 sm:pt-16 pb-2">
      {/* Upper Content Area: Left Headline & Right Quote */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-6 sm:gap-8 mt-4 sm:mt-[3.3rem]">
        {/* Left Side: Headline & Mission */}
        <div className="max-w-[535px] pointer-events-auto">
          {/* Small Eyebrow */}
          <div className="text-[10px] sm:text-[12px] font-semibold tracking-[0.25em] sm:tracking-[0.36em] text-blue-100/80 uppercase mb-2 sm:mb-4 flex items-center gap-2">
            <span>GLOBAL TECHNOLOGY INTELLIGENCE</span>
          </div>

          {/* Large Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-[62px] font-extrabold tracking-[-0.02em] text-white leading-[1.08] sm:leading-[1.03] font-['Space_Grotesk'] mb-4 sm:mb-6 drop-shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
            A Smarter
            <br />
            Tomorrow{' '}
            <span className="text-gradient-cyan-purple drop-shadow-[0_0_24px_rgba(168,85,247,0.4)]">
              Starts Here
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="text-xs sm:text-base text-slate-200/90 font-normal leading-[1.65] mb-6 sm:mb-8 max-w-[450px]">
            Real-time insights on AI, cloud, cybersecurity, developer tools, research and more —
            all in one intelligent platform.
          </p>

          {/* Primary CTA Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={onExploreWorld}
              className="group flex items-center gap-3 px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-full bg-[#0b2245]/88 hover:bg-[#12315a] border border-cyan-300/72 hover:border-cyan-200 text-white text-xs sm:text-sm font-semibold tracking-wide shadow-[0_0_26px_rgba(59,130,246,0.65),inset_0_0_22px_rgba(96,165,250,0.18)] transition-all duration-300 hover:scale-[1.02] cursor-pointer"
            >
              <span>Explore the World</span>
              <ArrowRight className="w-4 h-4 text-cyan-100 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Right Side: Philosophy Quote & Exploration Pillar */}
        <div className="hidden lg:flex flex-col items-end text-right max-w-xs pointer-events-auto mt-3 mr-1">
          <p className="text-xl text-slate-100 font-light tracking-wide leading-snug drop-shadow-md">
            “Technology moves fast.
            <br />
            We help you stay ahead.”
          </p>
          <div className="w-9 h-px bg-cyan-100/80 mt-5 mb-3 shadow-[0_0_12px_rgba(125,211,252,0.8)]" />
          <div className="flex items-center gap-2.5 text-[10px] tracking-[0.31em] font-medium text-slate-300/70 uppercase">
            <span>Mani Tech</span>
            <span className="text-cyan-400 font-bold">•</span>
            <span>LEARN</span>
            <span className="text-cyan-400 font-bold">•</span>
            <span>GROW</span>
          </div>
        </div>
      </div>

      {/* Mid-Lower Left Stats Bar (100K+ Tech Updates, 10K+ Tools & Resources, 50K+ Global Developers) */}
      <div className="grid grid-cols-3 sm:flex items-center gap-2 sm:gap-0 mt-4 pointer-events-auto mb-4 sm:mb-6">
        <div className="flex flex-col pr-3 sm:pr-7 md:pr-8">
          <span className="text-lg sm:text-2xl font-bold tracking-tight text-blue-100 font-['Space_Grotesk']">
            100K+
          </span>
          <span className="text-[9px] sm:text-[11px] text-slate-400 tracking-wide mt-0.5">Tech Updates</span>
        </div>
        <div className="flex flex-col px-3 sm:px-7 md:px-8 border-l border-blue-200/20">
          <span className="text-lg sm:text-2xl font-bold tracking-tight text-blue-100 font-['Space_Grotesk']">
            10K+
          </span>
          <span className="text-[9px] sm:text-[11px] text-slate-400 tracking-wide mt-0.5">Tools & Resources</span>
        </div>
        <div className="flex flex-col pl-3 sm:pl-7 md:pl-8 border-l border-blue-200/20">
          <span className="text-lg sm:text-2xl font-bold tracking-tight text-blue-100 font-['Space_Grotesk']">
            50K+
          </span>
          <span className="text-[9px] sm:text-[11px] text-slate-400 tracking-wide mt-0.5">Global Developers</span>
        </div>
      </div>

  {/* Far Right Vertical Scroll Indicator matching exact reference ("SCROLL TO Mani Tech") */ }
  <div className="absolute right-10 bottom-[8.7rem] hidden xl:flex flex-col items-center gap-4 pointer-events-none select-none">
    <span className="text-[10px] font-semibold tracking-[0.3em] text-slate-300/80 uppercase text-center leading-[1.35]">
      SCROLL
          TO Mani Tech
        </span>
        <div className="w-px h-24 bg-gradient-to-b from-cyan-100/70 via-slate-500/50 to-transparent relative mt-1">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-100 absolute -left-[2px] bottom-0 shadow-[0_0_10px_rgba(191,219,254,0.95)]" />
        </div>
      </div>
    </div>
  );
};
