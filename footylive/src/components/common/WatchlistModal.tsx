'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bookmark,
  X,
  Play,
  Bell,
  BellRing,
  Star,
  Trash2,
  Tv,
  CheckCircle2,
  Calendar,
  Radio,
} from 'lucide-react';
import { Match } from '../../types/football';
import { TeamLogo } from './TeamLogo';

interface WatchlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  matches: Match[];
  onSelectMatch: (match: Match) => void;
}

export const WatchlistModal: React.FC<WatchlistModalProps> = ({
  isOpen,
  onClose,
  matches,
  onSelectMatch,
}) => {
  const [pinnedTeamIds, setPinnedTeamIds] = useState<string[]>([
    'Real Madrid',
    'Argentina',
    'Arsenal',
    'Manchester City',
  ]);
  const [alertMatchIds, setAlertMatchIds] = useState<Record<string, boolean>>({});

  const toggleAlert = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAlertMatchIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const removePinnedTeam = (team: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPinnedTeamIds((prev) => prev.filter((t) => t !== team));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-[#262c3e] bg-[#0f121b] shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#1c2233] bg-[#141825] px-5 py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#00ff88]/20 border border-[#00ff88]/40 shadow-[0_0_12px_rgba(0,255,136,0.25)]">
                <Bookmark className="h-4 w-4 text-[#00ff88]" />
              </div>
              <div>
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  MY WATCHLIST & ALERTS
                  <span className="rounded-full bg-[#00ff88]/20 px-2 py-0.5 text-[10px] font-bold text-[#00ff88] font-mono">
                    DAZN PRO
                  </span>
                </h2>
                <p className="text-[11px] text-[#8b94a5]">
                  Track live streams, pinned favorites, and instant kickoff push notifications
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-black/40 p-2 text-[#8b94a5] hover:text-white hover:border-[#00ff88]/50 transition-colors"
            >
              <X className="h-4 w-4" />
            </motion.button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
            {/* Pinned Favorite Clubs */}
            <div>
              <div className="flex items-center justify-between mb-2.5 text-xs">
                <span className="font-bold uppercase tracking-wider text-[#00ff88] font-mono flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 fill-[#00ff88] text-[#00ff88]" /> Pinned Favorites
                </span>
                <span className="text-[11px] text-[#8b94a5] font-mono">
                  {pinnedTeamIds.length} Clubs/Nations
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {pinnedTeamIds.map((team) => (
                  <div
                    key={team}
                    className="flex items-center gap-2 rounded-xl border border-[#232838] bg-[#161a27] px-3 py-1.5 text-xs font-bold text-white shadow-sm"
                  >
                    <span>⚽</span>
                    <span>{team}</span>
                    <button
                      onClick={(e) => removePinnedTeam(team, e)}
                      className="text-[#8b94a5] hover:text-red-400 ml-1 transition-colors"
                      title="Remove from favorites"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Match Stream Watchlist */}
            <div>
              <div className="flex items-center justify-between mb-2.5 text-xs">
                <span className="font-bold uppercase tracking-wider text-white font-mono flex items-center gap-1.5">
                  <Tv className="h-3.5 w-3.5 text-[#00ff88]" /> Saved Broadcasts & Fixtures
                </span>
                <span className="text-[11px] text-[#8b94a5] font-mono">
                  {matches.length} Matches In Feed
                </span>
              </div>

              {matches.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#8b94a5] rounded-xl border border-dashed border-[#232838]">
                  No matches in your feed right now. Refresh the live sports feed to discover games.
                </div>
              ) : (
                <div className="space-y-2">
                  {matches.slice(0, 6).map((match) => {
                    const hasAlert = alertMatchIds[match.id];
                    return (
                      <motion.div
                        key={match.id}
                        whileHover={{ scale: 1.01, x: 2 }}
                        onClick={() => {
                          onSelectMatch(match);
                          onClose();
                        }}
                        className="flex items-center justify-between p-3 rounded-xl border border-[#202638] bg-[#131724] hover:border-[#00ff88]/40 hover:bg-[#161b2a] cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col items-center">
                            {match.status === 'LIVE' ? (
                              <span className="flex items-center gap-1 rounded bg-[#ff3355] px-1.5 py-0.5 text-[9px] font-black text-white font-mono animate-pulse">
                                <Radio className="h-2.5 w-2.5" /> LIVE
                              </span>
                            ) : (
                              <span className="rounded bg-[#1e2333] px-1.5 py-0.5 text-[9px] font-bold text-[#8b94a5] font-mono">
                                {match.kickoffTime}
                              </span>
                            )}
                            <span className="text-[9px] font-mono text-[#00ff88] mt-0.5">
                              {match.status === 'LIVE' ? match.minute : 'SOON'}
                            </span>
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white truncate max-w-[130px] sm:max-w-[180px]">
                                {match.homeTeam.name}
                              </span>
                              <span className="text-[10px] text-[#8b94a5] font-mono">vs</span>
                              <span className="text-xs font-bold text-white truncate max-w-[130px] sm:max-w-[180px]">
                                {match.awayTeam.name}
                              </span>
                            </div>
                            <div className="text-[10px] text-[#8b94a5] mt-0.5">
                              {match.tournament} • {match.stadium}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => toggleAlert(match.id, e)}
                            className={`p-2 rounded-lg border transition-colors ${
                              hasAlert
                                ? 'border-[#00ff88] bg-[#00ff88]/20 text-[#00ff88]'
                                : 'border-[#232838] bg-[#1a2030] text-[#8b94a5] hover:text-white hover:border-[#38425d]'
                            }`}
                            title={hasAlert ? 'Alert enabled' : 'Set kickoff alert'}
                          >
                            {hasAlert ? (
                              <BellRing className="h-3.5 w-3.5" />
                            ) : (
                              <Bell className="h-3.5 w-3.5" />
                            )}
                          </button>

                          <button
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#00ff88] text-black font-bold text-xs hover:bg-[#00e078] transition-colors shadow-sm"
                          >
                            <Play className="h-3 w-3 fill-current" />
                            <span>Watch</span>
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
