'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { TeamLogo } from '../common/TeamLogo';
import { TiltCard } from '../worldcup/TiltCard';
import {
  Radio,
  ChevronLeft,
  ChevronRight,
  Eye,
  Play,
  Volume2,
  Tv,
  Sparkles,
  Flame,
} from 'lucide-react';
import { Match } from '../../types/football';

interface LiveMatchesCarouselProps {
  matches: Match[];
  activeMatchId: string;
  onSelectMatch: (match: Match) => void;
}

export const LiveMatchesCarousel: React.FC<LiveMatchesCarouselProps> = ({
  matches,
  activeMatchId,
  onSelectMatch,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedFilter, setSelectedFilter] = useState('ALL');

  const liveMatches = matches.filter((m) => m.status === 'LIVE');

  const filterTabs = [
    { id: 'ALL', label: `All Live (${liveMatches.length})` },
    { id: 'UEFA Champions League', label: 'Champions League' },
    { id: 'Premier League', label: 'Premier League' },
    { id: 'La Liga EA Sports', label: 'La Liga' },
    { id: 'Serie A Made in Italy', label: 'Serie A' },
    { id: 'Bundesliga', label: 'Bundesliga' },
    { id: 'Roshn Saudi League', label: 'Saudi Pro League' },
    { id: 'CONMEBOL Copa Libertadores', label: 'Copa Libertadores' },
  ];

  const filtered = liveMatches.filter((m) => {
    if (selectedFilter === 'ALL') return true;
    return m.tournament === selectedFilter;
  });

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -380 : 380;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section className="space-y-4">
      {/* Header and Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ff3355]/20 border border-[#ff3355]/40 shadow-[0_0_10px_rgba(255,51,85,0.2)]">
            <Radio className="h-4 w-4 text-[#ff3355] animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
              LIVE MATCHES
              <span className="rounded-full bg-[#ff3355] px-2 py-0.5 text-[10px] font-black text-white font-mono">
                {liveMatches.length} ON AIR
              </span>
            </h2>
            <p className="text-xs text-[#8b94a5]">
              Real-time multi-angle live streams with interactive data and 4K broadcast
            </p>
          </div>
        </div>

        {/* Carousel Scroll Controls */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => scroll('left')}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#222838] bg-[#12151e] text-[#8b94a5] hover:border-[#00ff88]/50 hover:text-white transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => scroll('right')}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#222838] bg-[#12151e] text-[#8b94a5] hover:border-[#00ff88]/50 hover:text-white transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </motion.button>
        </div>
      </div>

      {/* Filter Tabs Pills with Framer Motion Sliding Pill */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {filterTabs.map((tab) => {
          const isActive = selectedFilter === tab.id;
          return (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setSelectedFilter(tab.id)}
              className="relative whitespace-nowrap rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all"
            >
              {isActive && (
                <motion.div
                  layoutId="activeLiveFilterPill"
                  className="absolute inset-0 rounded-lg bg-[#00ff88] shadow-[0_0_12px_rgba(0,255,136,0.35)]"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <span className={`relative z-10 ${isActive ? 'text-black' : 'text-[#8b94a5] hover:text-white'}`}>
                {tab.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Horizontal Carousel with Staggered Framer Motion cards */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto no-scrollbar pb-3 scroll-smooth"
      >
        {filtered.length === 0 ? (
          <div className="w-full py-8 text-center text-sm text-[#8b94a5] border border-dashed border-[#222838] rounded-2xl">
            No live matches active in this competition right now. Check upcoming fixtures below!
          </div>
        ) : (
          filtered.map((match) => {
            const isCurrentlyActive = match.id === activeMatchId;

            return (
              <TiltCard
                key={match.id}
                maxTilt={6}
                onClick={() => onSelectMatch(match)}
                className={`group flex w-[320px] sm:w-[360px] flex-shrink-0 flex-col justify-between border p-4 cursor-pointer transition-all ${
                  isCurrentlyActive
                    ? 'border-[#00ff88] bg-[#151c27] shadow-[0_0_20px_rgba(0,255,136,0.25)]'
                    : 'border-[#222736] bg-[#131620] hover:border-[#00ff88]/50 hover:bg-[#181c28]'
                }`}
              >
                {/* Card Top: Tournament & Live Badge */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-[#8b94a5] truncate max-w-[200px]">
                      {match.tournament}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="flex items-center gap-1 rounded bg-[#ff3355]/20 border border-[#ff3355]/40 px-2 py-0.5 text-[10px] font-black text-[#ff3355] animate-pulse font-mono">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#ff3355]" />
                        LIVE {match.minute}
                      </span>
                      <span className="rounded bg-[#1c2233] px-1.5 py-0.5 text-[10px] font-mono text-[#00ff88]">
                        {match.streamQuality}
                      </span>
                    </div>
                  </div>

                  {/* Teams Scoreboard Display */}
                  <div className="rounded-xl bg-[#0c0e14] border border-[#1f2434] p-3.5 space-y-2.5">
                    {/* Home Team */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <TeamLogo logo={match.homeTeam.logo} name={match.homeTeam.name} className="h-6 w-6" />
                        <span className="text-sm font-black text-white truncate max-w-[170px]">{match.homeTeam.name}</span>
                      </div>
                      <motion.span
                        key={`home-${match.score.home}`}
                        initial={{ scale: 1.25 }}
                        animate={{ scale: 1 }}
                        className="text-xl font-mono font-black text-[#00ff88]"
                      >
                        {match.score.home}
                      </motion.span>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-[#1a1f2c]" />

                    {/* Away Team */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <TeamLogo logo={match.awayTeam.logo} name={match.awayTeam.name} className="h-6 w-6" />
                        <span className="text-sm font-black text-white truncate max-w-[170px]">{match.awayTeam.name}</span>
                      </div>
                      <motion.span
                        key={`away-${match.score.away}`}
                        initial={{ scale: 1.25 }}
                        animate={{ scale: 1 }}
                        className="text-xl font-mono font-black text-[#00ff88]"
                      >
                        {match.score.away}
                      </motion.span>
                    </div>
                  </div>

                  {/* Match Venue & Stage */}
                  <div className="mt-3 flex items-center justify-between text-[11px] text-[#8b94a5]">
                    <span className="truncate max-w-[180px]">📍 {match.stadium}</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Eye className="h-3 w-3 text-[#00ff88]" />
                      {match.viewers || '1.2M'}
                    </span>
                  </div>
                </div>

                {/* Card Footer: Watch Button */}
                <div className="mt-4 pt-3 border-t border-[#1c2232] flex items-center justify-between">
                  <span className="text-[11px] text-[#8b94a5] font-mono">
                    {match.cameraAngles?.length || 4} Angles
                  </span>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectMatch(match);
                    }}
                    className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                      isCurrentlyActive
                        ? 'bg-[#00ff88] text-black shadow-[0_0_12px_rgba(0,255,136,0.4)]'
                        : 'bg-[#1b2233] text-white hover:bg-[#00ff88] hover:text-black'
                    }`}
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>{isCurrentlyActive ? 'NOW PLAYING' : 'WATCH STREAM'}</span>
                  </motion.button>
                </div>
              </TiltCard>
            );
          })
        )}
      </div>
    </section>
  );
};
