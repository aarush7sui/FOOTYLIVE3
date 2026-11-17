'use client';

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TeamLogo } from '../common/TeamLogo';
import {
  Radio,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Volume2,
  VolumeX,
  Flame,
  ArrowRight,
  TrendingUp,
  Activity,
} from 'lucide-react';
import { Match } from '../../types/football';

interface LiveScoreTickerProps {
  matches: Match[];
  activeMatchId: string;
  onSelectMatch: (match: Match) => void;
  isLiveConnected?: boolean;
}

export const LiveScoreTicker: React.FC<LiveScoreTickerProps> = ({
  matches,
  activeMatchId,
  onSelectMatch,
  isLiveConnected = true,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  const filterOptions = [
    { id: 'ALL', label: 'All Scores' },
    { id: 'LIVE', label: '🔴 Live Now' },
    { id: 'UEFA Champions League', label: 'UCL' },
    { id: 'Premier League', label: 'EPL' },
    { id: 'La Liga EA Sports', label: 'La Liga' },
    { id: 'Serie A Made in Italy', label: 'Serie A' },
    { id: 'Bundesliga', label: 'Bundesliga' },
  ];

  const filteredMatches = matches.filter((m) => {
    if (selectedFilter === 'ALL') return true;
    if (selectedFilter === 'LIVE') return m.status === 'LIVE';
    return m.tournament === selectedFilter;
  });

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="w-full border-b border-[#1b202e] bg-[#0b0c10] select-none">
      <div className="flex items-center h-12 px-3 sm:px-4">
        {/* Ticker Lead Badge with Live Google Satellite indicator */}
        <div className="flex items-center gap-2 pr-3 border-r border-[#1f2434] flex-shrink-0">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-1.5 rounded-md bg-[#18202d] px-2 py-1 border border-[#00ff88]/30 shadow-[0_0_10px_rgba(0,255,136,0.15)]"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff3355] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff3355]"></span>
            </span>
            <span className="text-[10px] font-black tracking-wider text-[#00ff88] uppercase font-mono">
              LIVE TICKER
            </span>
          </motion.div>

          {/* Filter Pills with Framer Motion */}
          <div className="hidden lg:flex items-center gap-1">
            {filterOptions.slice(0, 4).map((f) => {
              const isSelected = selectedFilter === f.id;
              return (
                <motion.button
                  key={f.id}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setSelectedFilter(f.id)}
                  className={`rounded px-2 py-0.5 text-[10px] font-bold transition-colors ${
                    isSelected
                      ? 'bg-[#00ff88] text-black shadow-[0_0_8px_rgba(0,255,136,0.3)]'
                      : 'text-[#8b94a5] hover:text-white hover:bg-[#161a25]'
                  }`}
                >
                  {f.label}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Scroll Buttons - Left */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => scroll('left')}
          className="flex h-7 w-7 items-center justify-center rounded text-[#8b94a5] hover:bg-[#161a25] hover:text-[#00ff88] ml-1 flex-shrink-0 transition-colors"
          title="Scroll Left"
        >
          <ChevronLeft className="h-4 w-4" />
        </motion.button>

        {/* Horizontal Ticker Matches Container */}
        <div
          ref={scrollContainerRef}
          className="flex flex-1 items-center gap-3 overflow-x-auto no-scrollbar px-2 py-1 scroll-smooth"
        >
          {filteredMatches.map((match) => {
            const isActiveStream = match.id === activeMatchId;
            const isLive = match.status === 'LIVE';

            return (
              <motion.div
                key={match.id}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onSelectMatch(match)}
                className={`group flex items-center gap-3.5 rounded-lg border px-3 py-1.5 cursor-pointer flex-shrink-0 transition-all ${
                  isActiveStream
                    ? 'border-[#00ff88] bg-[#141d26] shadow-[0_0_15px_rgba(0,255,136,0.25)]'
                    : 'border-[#1e2333] bg-[#10131c] hover:border-[#00ff88]/50 hover:bg-[#141824]'
                }`}
              >
                {/* Status / Minute */}
                <div className="flex flex-col items-center justify-center min-w-[50px] border-r border-[#1f2434] pr-2.5">
                  {isLive ? (
                    <>
                      <motion.span
                        key={match.minute}
                        initial={{ opacity: 0.7, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-1 text-[11px] font-black text-[#00ff88] font-mono"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-[#ff3355] animate-ping" />
                        {match.minute}
                      </motion.span>
                      <span className="text-[9px] font-bold text-[#ff3355] uppercase tracking-widest font-mono">
                        LIVE
                      </span>
                    </>
                  ) : match.status === 'FINISHED' ? (
                    <span className="text-[10px] font-bold text-[#8b94a5] font-mono">FT</span>
                  ) : (
                    <div className="text-center font-mono">
                      <span className="text-[9px] font-medium text-[#8b94a5] block leading-tight">
                        {match.kickoffDate}
                      </span>
                      <span className="text-[10px] font-bold text-white block leading-tight">
                        {match.kickoffTime.split(' ')[0]}
                      </span>
                    </div>
                  )}
                </div>

                {/* Teams & Scores */}
                <div className="flex flex-col gap-1 min-w-[130px]">
                  {/* Home Team */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-semibold text-[#f3f4f6]">
                      <TeamLogo logo={match.homeTeam.logo} name={match.homeTeam.name} className="h-4 w-4" />
                      <span className="truncate max-w-[85px]">{match.homeTeam.shortName}</span>
                    </span>
                    <motion.span
                      key={`h-${match.score.home}`}
                      initial={{ scale: 1.25, color: '#00ff88' }}
                      animate={{ scale: 1, color: match.score.home > match.score.away && isLive ? '#00ff88' : '#ffffff' }}
                      className="font-mono font-bold"
                    >
                      {match.status === 'UPCOMING' ? '-' : match.score.home}
                    </motion.span>
                  </div>

                  {/* Away Team */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-semibold text-[#f3f4f6]">
                      <TeamLogo logo={match.awayTeam.logo} name={match.awayTeam.name} className="h-4 w-4" />
                      <span className="truncate max-w-[85px]">{match.awayTeam.shortName}</span>
                    </span>
                    <motion.span
                      key={`a-${match.score.away}`}
                      initial={{ scale: 1.25, color: '#00ff88' }}
                      animate={{ scale: 1, color: match.score.away > match.score.home && isLive ? '#00ff88' : '#ffffff' }}
                      className="font-mono font-bold"
                    >
                      {match.status === 'UPCOMING' ? '-' : match.score.away}
                    </motion.span>
                  </div>
                </div>

                {/* Stream / Watch Action */}
                <div className="pl-1 border-l border-[#1f2434] flex flex-col items-center">
                  {isActiveStream ? (
                    <span className="rounded bg-[#00ff88]/20 px-1.5 py-0.5 text-[9px] font-black text-[#00ff88] uppercase font-mono">
                      ON AIR
                    </span>
                  ) : (
                    <span className="text-[10px] text-[#8b94a5] group-hover:text-[#00ff88] font-bold transition-colors">
                      {isLive ? 'WATCH' : 'PREVIEW'}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Scroll Buttons - Right */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => scroll('right')}
          className="flex h-7 w-7 items-center justify-center rounded text-[#8b94a5] hover:bg-[#161a25] hover:text-[#00ff88] flex-shrink-0 transition-colors"
          title="Scroll Right"
        >
          <ChevronRight className="h-4 w-4" />
        </motion.button>

        {/* Audio Alert Toggle */}
        <div className="pl-2 border-l border-[#1f2434] hidden sm:flex items-center flex-shrink-0">
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            className="flex h-7 w-7 items-center justify-center rounded text-[#8b94a5] hover:text-[#f3f4f6] hover:bg-[#161a25] transition-colors"
            title={isAudioMuted ? 'Unmute Goal Chimes' : 'Mute Goal Chimes'}
          >
            {isAudioMuted ? (
              <VolumeX className="h-3.5 w-3.5 text-[#ff3355]" />
            ) : (
              <Volume2 className="h-3.5 w-3.5 text-[#00ff88]" />
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};
