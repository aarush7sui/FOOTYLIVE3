'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { TeamLogo } from '../common/TeamLogo';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Bell,
  BellRing,
  Clock,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { Match } from '../../types/football';

interface UpcomingCarouselProps {
  matches: Match[];
  onSelectMatch: (match: Match) => void;
}

export const UpcomingCarousel: React.FC<UpcomingCarouselProps> = ({
  matches,
  onSelectMatch,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [reminders, setReminders] = useState<Record<string, boolean>>({});

  const upcomingMatches = matches.filter((m) => m.status === 'UPCOMING');

  const filterTabs = [
    { id: 'ALL', label: `All Upcoming (${upcomingMatches.length})` },
    { id: 'Tomorrow', label: 'Tomorrow' },
    { id: 'Sunday', label: 'This Weekend' },
    { id: 'FIFA World Cup 2026', label: 'World Cup 2026' },
    { id: 'UEFA Champions League', label: 'Champions League' },
    { id: 'Premier League', label: 'Premier League' },
    { id: 'La Liga EA Sports', label: 'La Liga' },
  ];

  const filtered = upcomingMatches.filter((m) => {
    if (selectedFilter === 'ALL') return true;
    if (selectedFilter === 'Tomorrow' || selectedFilter === 'Sunday') {
      return m.kickoffDate.includes(selectedFilter);
    }
    return m.tournament === selectedFilter;
  });

  const toggleReminder = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setReminders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -380 : 380;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section className="space-y-4">
      {/* Header and Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00ff88]/20 border border-[#00ff88]/40 shadow-[0_0_10px_rgba(0,255,136,0.2)]">
            <CalendarDays className="h-4 w-4 text-[#00ff88]" />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
              UPCOMING FIXTURES
              <span className="rounded-full bg-[#1c2233] px-2 py-0.5 text-[10px] font-bold text-[#00ff88] font-mono">
                {upcomingMatches.length} SCHEDULED
              </span>
            </h2>
            <p className="text-xs text-[#8b94a5]">
              Anticipated blockbusters, derby matches, and World Cup openers with countdown timers
            </p>
          </div>
        </div>

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

      {/* Filter Tabs with Framer Motion Sliding Pill */}
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
                  layoutId="activeUpcomingPill"
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

      {/* Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto no-scrollbar pb-3 scroll-smooth"
      >
        {filtered.map((match) => {
          const hasReminder = reminders[match.id];

          return (
            <motion.div
              key={match.id}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectMatch(match)}
              className="group relative flex w-[320px] sm:w-[360px] flex-shrink-0 flex-col justify-between rounded-2xl border border-[#222736] bg-[#131620] p-4 cursor-pointer hover:border-[#00ff88]/50 hover:bg-[#181c28] transition-all"
            >
              <div>
                {/* Top Badge: Tournament & Kickoff Date */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold text-[#8b94a5] truncate max-w-[190px]">
                    {match.tournament}
                  </span>
                  <div className="flex items-center gap-1.5 rounded-md bg-[#19202f] px-2 py-0.5 text-[11px] font-mono text-[#00ff88]">
                    <Clock className="h-3 w-3" />
                    <span>{match.kickoffDate} {match.kickoffTime}</span>
                  </div>
                </div>

                {/* Teams Card */}
                <div className="rounded-xl bg-[#0c0e14] border border-[#1f2434] p-3.5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <TeamLogo logo={match.homeTeam.logo} name={match.homeTeam.name} className="h-6 w-6" />
                      <span className="text-sm font-bold text-white truncate max-w-[170px]">{match.homeTeam.name}</span>
                    </div>
                    {match.odds && (
                      <span className="text-xs font-mono font-bold text-[#8b94a5]">
                        {match.odds.home}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-center">
                    <span className="rounded bg-[#1a2030] px-2.5 py-0.5 text-[10px] font-black uppercase text-[#8b94a5] font-mono">
                      VS
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <TeamLogo logo={match.awayTeam.logo} name={match.awayTeam.name} className="h-6 w-6" />
                      <span className="text-sm font-bold text-white truncate max-w-[170px]">{match.awayTeam.name}</span>
                    </div>
                    {match.odds && (
                      <span className="text-xs font-mono font-bold text-[#8b94a5]">
                        {match.odds.away}
                      </span>
                    )}
                  </div>
                </div>

                {/* Stadium Venue */}
                <div className="mt-3 text-[11px] text-[#8b94a5] truncate">
                  📍 {match.stadium}, {match.city}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 pt-3 border-t border-[#1c2232] flex items-center justify-between">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => toggleReminder(match.id, e)}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all ${
                    hasReminder
                      ? 'bg-[#00ff88]/20 border border-[#00ff88]/50 text-[#00ff88]'
                      : 'bg-[#1b2233] text-[#8b94a5] hover:text-white'
                  }`}
                >
                  {hasReminder ? <BellRing className="h-3.5 w-3.5 text-[#00ff88]" /> : <Bell className="h-3.5 w-3.5" />}
                  <span>{hasReminder ? 'Reminder Set' : 'Remind Me'}</span>
                </motion.button>

                <button className="text-xs font-bold text-[#00ff88] hover:underline">
                  Pre-Match Intel →
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
