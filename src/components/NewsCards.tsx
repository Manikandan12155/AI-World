import React from 'react';
import { ArrowRight } from 'lucide-react';
import { MOCK_NEWS_CARDS } from '../data/technologyData';
import type { NewsCardData } from '../data/technologyData';

interface NewsCardsProps {
  onSelectArticle: (article: NewsCardData) => void;
}

export const NewsCards: React.FC<NewsCardsProps> = ({ onSelectArticle }) => {
  return (
    <section className="relative z-30 w-full px-3 sm:px-6 md:px-10 lg:px-12 pb-6 sm:pb-8 pt-1">
      {/* 5 Bottom Glass News Cards matching the exact layout in the reference image */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {MOCK_NEWS_CARDS.map((card) => (
          <div
            key={card.id}
            onClick={() => onSelectArticle(card)}
            className="group relative h-[140px] sm:h-[154px] rounded-lg bg-[#07111f]/72 backdrop-blur-md border border-blue-200/20 hover:border-cyan-300/50 p-3.5 sm:p-4 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-[0_14px_34px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] hover:shadow-[0_18px_38px_rgba(14,165,233,0.2)] overflow-hidden"
          >
            <img
              src={card.imageUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-48 group-hover:opacity-62 group-hover:scale-105 transition-all duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#06101d]/95 via-[#07111f]/72 to-[#06101d]/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#040915]/88 via-transparent to-transparent" />

            {/* Top Row: Category Pill */}
            <div className="relative z-10 flex items-center justify-between mb-2">
              <span
                className={`text-[9px] sm:text-[10px] font-bold tracking-wider px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border ${card.badgeColor}`}
              >
                {card.category}
              </span>
            </div>

            {/* Headline */}
            <h3 className="relative z-10 text-[13px] sm:text-[15px] font-semibold text-slate-50 group-hover:text-cyan-100 line-clamp-2 leading-tight transition-colors max-w-[88%] mt-auto">
              {card.title}
            </h3>

            {/* Card Footer: Timestamp & Interactive Arrow Icon */}
            <div className="relative z-10 flex items-center justify-between text-[11px] sm:text-[12px] text-slate-300/85 mt-2 sm:mt-4">
              <span>{card.time}</span>
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-900/60 group-hover:bg-cyan-500/20 group-hover:text-cyan-100 flex items-center justify-center transition-colors border border-cyan-100/10">
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Divider Header ("LATEST FROM AROUND THE TECH WORLD" with "View All News ->") */}
      <div className="relative mt-6 sm:mt-8 flex items-center justify-center">
        <div className="flex items-center gap-2 sm:gap-4 px-2">
          <div className="h-px bg-gradient-to-r from-transparent via-cyan-300 to-blue-500/40 w-12 sm:w-24 md:w-40" />
          <span className="text-[9px] sm:text-[11px] font-semibold tracking-[0.2em] sm:tracking-[0.34em] text-slate-200/90 uppercase text-center">
            LATEST FROM AROUND THE TECH WORLD
          </span>
          <div className="h-px bg-gradient-to-r from-blue-500/40 via-cyan-300 to-transparent w-12 sm:w-24 md:w-40" />
        </div>

        {/* View All News Button */}
        <button className="absolute right-0 hidden md:flex items-center gap-2 text-sm font-medium text-slate-200 hover:text-white px-5 py-2.5 rounded-full bg-slate-950/45 hover:bg-slate-900/80 border border-blue-200/25 transition-all group">
          <span>View All News</span>
          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:translate-x-0.5 group-hover:text-cyan-300 transition-all" />
        </button>
      </div>
    </section>
  );
};
