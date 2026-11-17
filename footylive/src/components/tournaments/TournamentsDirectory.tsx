'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Search,
  Globe2,
  Filter,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { Tournament } from '../../types/football';

interface TournamentsDirectoryProps {
  tournaments: Tournament[];
  onSelectTournament: (tournament: Tournament) => void;
}

export const TournamentsDirectory: React.FC<TournamentsDirectoryProps> = ({
  tournaments,
  onSelectTournament,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConfed, setSelectedConfed] = useState('ALL');
  const [selectedTier, setSelectedTier] = useState<'ALL' | 'Club' | 'International'>('ALL');

  const confederations = [
    { id: 'ALL', label: 'All Continents', flag: '🌍' },
    { id: 'UEFA', label: 'UEFA (Europe)', flag: '🇪🇺' },
    { id: 'CONMEBOL', label: 'CONMEBOL (S. America)', flag: '🌎' },
    { id: 'FIFA', label: 'FIFA / International', flag: '🌐' },
    { id: 'CONCACAF', label: 'CONCACAF (N. America)', flag: '🇺🇸' },
    { id: 'AFC', label: 'AFC (Asia & Middle East)', flag: '🌏' },
    { id: 'CAF', label: 'CAF (Africa)', flag: '🌍' },
  ];

  const filteredTournaments = tournaments.filter((t) => {
    // Confederation filter
    if (selectedConfed !== 'ALL' && t.confederation !== selectedConfed) return false;
    // Tier filter
    if (selectedTier !== 'ALL' && t.tier !== selectedTier) return false;
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = t.name.toLowerCase().includes(q);
      const matchCountry = t.country.toLowerCase().includes(q);
      const matchRegion = t.region.toLowerCase().includes(q);
      const matchChamp = t.defendingChampion.toLowerCase().includes(q);
      if (!matchName && !matchCountry && !matchRegion && !matchChamp) return false;
    }
    return true;
  });

  return (
    <section className="space-y-6">
      {/* Directory Title Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-2xl border border-[#23293c] bg-gradient-to-r from-[#111522] via-[#141a29] to-[#0e121a] p-5 sm:p-7 shadow-xl"
      >
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#00ff88]/15 border border-[#00ff88]/30 px-3 py-1 text-xs font-black text-[#00ff88] uppercase">
            <Globe2 className="h-3.5 w-3.5" />
            Global Football Coverage
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            WORLDWIDE FOOTBALL TOURNAMENTS
          </h2>
          <p className="text-xs sm:text-sm text-[#8b94a5] leading-relaxed">
            Browse through national leagues, continental knockout cups, and global tournaments across all 6 FIFA confederations. Access live streams, fixtures, and verified standings tables.
          </p>
        </div>

        {/* Search & Quick Controls */}
        <div className="relative z-10 mt-5 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[260px] max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8b94a5]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by league, country (England, Brazil, Saudi), champion..."
              className="w-full rounded-xl border border-[#252c3e] bg-[#0c0e14]/90 pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#5d687c] outline-none focus:border-[#00ff88] focus:shadow-[0_0_12px_rgba(0,255,136,0.15)] transition-all"
            />
          </div>

          {/* Tier Selector Pills with Framer Motion Sliding Pill */}
          <div className="flex items-center gap-1 rounded-xl border border-[#252c3e] bg-[#0c0e14] p-1">
            {(['ALL', 'Club', 'International'] as const).map((tier) => {
              const isSelected = selectedTier === tier;
              return (
                <motion.button
                  key={tier}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedTier(tier)}
                  className="relative rounded-lg px-3 py-1.5 text-xs font-bold transition-colors"
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeTierPill"
                      className="absolute inset-0 rounded-lg bg-[#00ff88] shadow-[0_0_10px_rgba(0,255,136,0.3)]"
                      transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                    />
                  )}
                  <span className={`relative z-10 ${isSelected ? 'text-black font-black' : 'text-[#8b94a5] hover:text-white'}`}>
                    {tier === 'ALL' ? 'All Formats' : tier}
                  </span>
                </motion.button>
              );
            })}
          </div>

          <span className="text-xs font-mono text-[#8b94a5] hidden md:inline">
            Showing <strong className="text-[#00ff88]">{filteredTournaments.length}</strong> tournaments
          </span>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-[#00ff88]/5 blur-3xl pointer-events-none" />
      </motion.div>

      {/* Confederation Filter Pills with Framer Motion */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {confederations.map((confed) => {
          const isActive = selectedConfed === confed.id;
          return (
            <motion.button
              key={confed.id}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setSelectedConfed(confed.id)}
              className="relative flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold transition-all"
            >
              {isActive && (
                <motion.div
                  layoutId="activeConfedPill"
                  className="absolute inset-0 rounded-xl bg-[#00ff88] shadow-[0_0_15px_rgba(0,255,136,0.25)]"
                  transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                />
              )}
              <span className="relative z-10">{confed.flag}</span>
              <span className={`relative z-10 ${isActive ? 'text-black font-black' : 'text-[#8b94a5] hover:text-white'}`}>
                {confed.label}
              </span>
              {!isActive && (
                <div className="absolute inset-0 rounded-xl border border-[#222838] bg-[#131622] -z-10 hover:border-[#39425a]" />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Tournaments Grid with Framer Motion Layout & Staggered Transitions */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <AnimatePresence mode="popLayout">
          {filteredTournaments.map((tournament, idx) => (
            <motion.div
              key={tournament.id}
              layout
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{
                duration: 0.35,
                delay: Math.min(idx * 0.03, 0.3),
                ease: 'easeOut',
              }}
              whileHover={{
                y: -6,
                scale: 1.02,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectTournament(tournament)}
              className="group relative flex flex-col justify-between rounded-2xl border border-[#222838] bg-[#121520] p-4 sm:p-5 cursor-pointer hover:border-[#00ff88]/50 hover:bg-[#161a27] shadow-lg hover:shadow-[0_10px_25px_-5px_rgba(0,255,136,0.12)] transition-colors"
            >
              <div>
                {/* Card Header: Flag & Confederation Badge */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1a2030] text-2xl border border-[#273046] group-hover:border-[#00ff88]/40 transition-colors">
                      {tournament.flag}
                    </span>
                    <div>
                      <span className="rounded bg-[#1a2030] px-2 py-0.5 text-[10px] font-mono font-bold text-[#00ff88]">
                        {tournament.confederation}
                      </span>
                      <h3 className="text-base font-black text-white group-hover:text-[#00ff88] transition-colors leading-tight mt-1">
                        {tournament.name}
                      </h3>
                    </div>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    className="rounded-lg border border-white/10 bg-[#161a26] p-1.5 text-[#8b94a5] group-hover:text-[#00ff88] group-hover:border-[#00ff88]/30 transition-colors"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </motion.div>
                </div>

                {/* Tournament Meta Info */}
                <div className="rounded-xl bg-[#0c0e14] border border-[#1b202d] p-3 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#8b94a5]">Region:</span>
                    <span className="text-white font-medium">{tournament.region}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8b94a5]">Defending Champion:</span>
                    <span className="text-[#00ff88] font-bold">🏆 {tournament.defendingChampion}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8b94a5]">Current Status:</span>
                    <span className="text-white font-medium">{tournament.currentPhase}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8b94a5]">Clubs / Nations:</span>
                    <span className="text-white font-mono font-bold">{tournament.teamsCount} Teams</span>
                  </div>
                </div>

                <p className="mt-3 text-xs text-[#8b94a5] line-clamp-2 leading-relaxed">
                  {tournament.description}
                </p>
              </div>

              {/* Card Action Footer */}
              <div className="mt-4 pt-3 border-t border-[#1a1f2c] flex items-center justify-between">
                <span className="text-[11px] text-[#00ff88] font-semibold flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Live 4K Broadcast
                </span>

                <span className="text-xs font-bold text-white group-hover:text-[#00ff88] flex items-center gap-1 transition-colors">
                  View Standings & Fixtures <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};
