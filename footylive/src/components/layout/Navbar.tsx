'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bell,
  Globe,
  SlidersHorizontal,
  Tv,
  Sparkles,
  ChevronDown,
  Volume2,
  CheckCircle2,
  RefreshCw,
  Radio,
} from 'lucide-react';
import { Tournament, Match } from '../../types/football';
import { TeamLogo } from '../common/TeamLogo';

interface NavbarProps {
  onSearchQuery: (query: string) => void;
  searchQuery: string;
  onSelectMatch: (match: Match) => void;
  onSelectTournament: (tournament: Tournament) => void;
  matches: Match[];
  tournaments: Tournament[];
  onOpenTournamentsModal: () => void;
  isLiveConnected?: boolean;
  lastSyncTime?: string;
  onRefreshLive?: () => void;
  liveCount?: number;
  secondsUntilNextSync?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSearchQuery,
  searchQuery,
  onSelectMatch,
  onSelectTournament,
  matches,
  tournaments,
  onOpenTournamentsModal,
  isLiveConnected = true,
  lastSyncTime = 'Live Now',
  onRefreshLive,
  liveCount = 0,
  secondsUntilNextSync = 5,
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English (Global)');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [notificationActive, setNotificationActive] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    onRefreshLive?.();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // Filtered search results
  const filteredMatches = searchQuery.trim()
    ? matches.filter(
        (m) =>
          m.homeTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.awayTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.tournament.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const filteredTournaments = searchQuery.trim()
    ? tournaments.filter(
        (t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.confederation.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1f2433] bg-[#0d0e12]/95 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left: Live Matchday Broadcast Status */}
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 rounded-full border border-[#00ff88]/30 bg-[#00ff88]/10 px-3 py-1 shadow-[0_0_12px_rgba(0,255,136,0.15)]"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff88] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ff88]"></span>
            </span>
            <span className="text-xs font-black tracking-wider text-[#00ff88] uppercase font-mono">
              LIVE STREAMING
            </span>
            {liveCount > 0 && (
              <span className="rounded bg-[#ff3355] text-white text-[10px] font-black px-1.5 py-0.2 font-mono animate-pulse">
                {liveCount} ON AIR
              </span>
            )}
          </motion.div>

          {/* Quick Refresh Button */}
          {onRefreshLive && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9, rotate: 180 }}
              onClick={handleRefreshClick}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#232838] bg-[#141722] text-[#8b94a5] hover:text-[#00ff88] hover:border-[#00ff88]/50 transition-colors"
              title="Refresh Live Scores"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-[#00ff88]' : ''}`} />
            </motion.button>
          )}
        </div>

        {/* Center: Global Search Bar */}
        <div className="relative flex-1 max-w-xl mx-4 sm:mx-8">
          <div
            className={`flex items-center gap-2.5 rounded-lg border px-3.5 py-2 transition-all ${
              isSearchFocused
                ? 'border-[#00ff88] bg-[#141722] shadow-[0_0_15px_rgba(0,255,136,0.15)]'
                : 'border-[#232838] bg-[#141722]/80 hover:border-[#32394e]'
            }`}
          >
            <Search className="h-4 w-4 text-[#8b94a5]" />
            <input
              type="text"
              placeholder="Search matches, clubs (Real Madrid, Arsenal), or world tournaments..."
              value={searchQuery}
              onChange={(e) => onSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              className="w-full bg-transparent text-sm text-[#f3f4f6] placeholder-[#606a7e] outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchQuery('')}
                className="text-xs text-[#8b94a5] hover:text-[#f3f4f6] px-1"
              >
                Clear
              </button>
            )}
          </div>

          {/* Search Dropdown Results with Framer Motion AnimatePresence */}
          <AnimatePresence>
            {isSearchFocused && searchQuery.trim() && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 right-0 top-12 mt-1 max-h-96 overflow-y-auto rounded-xl border border-[#262c3e] bg-[#141722] p-2 shadow-2xl z-50 custom-scrollbar"
              >
                {filteredMatches.length === 0 && filteredTournaments.length === 0 ? (
                  <div className="py-6 text-center text-sm text-[#8b94a5]">
                    No matching fixtures or tournaments found for &quot;{searchQuery}&quot;
                  </div>
                ) : (
                  <>
                    {filteredMatches.length > 0 && (
                      <div className="mb-3">
                        <div className="px-3 py-1 text-[11px] font-bold tracking-wider text-[#8b94a5] uppercase">
                          Matches & Streams ({filteredMatches.length})
                        </div>
                        {filteredMatches.map((match) => (
                          <motion.div
                            key={match.id}
                            whileHover={{ scale: 1.01, x: 2 }}
                            onClick={() => {
                              onSelectMatch(match);
                              setIsSearchFocused(false);
                            }}
                            className="flex items-center justify-between rounded-lg p-2.5 hover:bg-[#1f2435] cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <TeamLogo logo={match.homeTeam.logo} name={match.homeTeam.name} className="h-5 w-5" />
                              <span className="text-sm font-semibold text-white">
                                {match.homeTeam.name} vs {match.awayTeam.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {match.status === 'LIVE' ? (
                                <span className="rounded bg-[#ff3355]/20 px-2 py-0.5 text-xs font-bold text-[#ff3355] animate-pulse">
                                  LIVE {match.minute}
                                </span>
                              ) : (
                                <span className="rounded bg-[#232838] px-2 py-0.5 text-xs text-[#8b94a5]">
                                  {match.kickoffDate} {match.kickoffTime}
                                </span>
                              )}
                              <span className="text-xs text-[#00ff88] font-medium">Watch →</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {filteredTournaments.length > 0 && (
                      <div>
                        <div className="px-3 py-1 text-[11px] font-bold tracking-wider text-[#8b94a5] uppercase">
                          Worldwide Tournaments ({filteredTournaments.length})
                        </div>
                        {filteredTournaments.map((tournament) => (
                          <motion.div
                            key={tournament.id}
                            whileHover={{ scale: 1.01, x: 2 }}
                            onClick={() => {
                              onSelectTournament(tournament);
                              setIsSearchFocused(false);
                            }}
                            className="flex items-center justify-between rounded-lg p-2.5 hover:bg-[#1f2435] cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-lg">{tournament.flag}</span>
                              <div>
                                <div className="text-sm font-medium text-white">{tournament.name}</div>
                                <div className="text-xs text-[#8b94a5]">{tournament.region} • {tournament.confederation}</div>
                              </div>
                            </div>
                            <span className="rounded border border-[#00ff88]/30 bg-[#00ff88]/10 px-2 py-0.5 text-[11px] font-semibold text-[#00ff88]">
                              View Standings
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Actions, Language & Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* World Cup 2026 Daylight Experience Scroll Trigger */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const el = document.getElementById('world-cup-2026-experience');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-1.5 rounded-lg border border-[#0055FF]/40 bg-[#0055FF]/20 px-3 py-1.5 text-xs font-bold text-[#3884ff] hover:bg-[#0055FF] hover:text-white transition-all shadow-[0_0_12px_rgba(0,85,255,0.25)]"
          >
            <span>🌍</span>
            <span className="hidden sm:inline">World Cup &apos;26</span>
            <span className="rounded bg-[#FF3D00] px-1.5 py-0.2 text-[9px] font-black text-white">
              DAYLIGHT
            </span>
          </motion.button>

          {/* World Tournaments Quick Button */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpenTournamentsModal}
            className="hidden md:flex items-center gap-2 rounded-lg border border-[#2c3345] bg-[#161a25] px-3 py-1.5 text-xs font-semibold text-[#f3f4f6] hover:border-[#00ff88]/50 hover:bg-[#1c2233] transition-all"
          >
            <Globe className="h-3.5 w-3.5 text-[#00ff88]" />
            <span>All Tournaments</span>
            <span className="rounded bg-[#00ff88]/20 px-1.5 py-0.2 text-[10px] text-[#00ff88]">
              {tournaments.length}
            </span>
          </motion.button>

          {/* Commentary Language Selector */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className="flex items-center gap-2 rounded-lg border border-[#232838] bg-[#141722] px-3 py-1.5 text-xs font-medium text-[#c0c7d5] hover:border-[#38415a]"
            >
              <Volume2 className="h-3.5 w-3.5 text-[#00ff88]" />
              <span>{selectedLanguage}</span>
              <ChevronDown className="h-3 w-3 text-[#8b94a5]" />
            </button>

            <AnimatePresence>
              {showLanguageDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute right-0 mt-2 w-52 rounded-xl border border-[#252b3d] bg-[#141722] p-1.5 shadow-xl z-50"
                >
                  {[
                    'English (Global / Drury)',
                    'Spanish (Latin / Palomo)',
                    'German (DE / DAZN)',
                    'French (Canal+ Sport)',
                    'Arabic (MENA / Chaouali)',
                    'Stadium Ambience (No Voice)',
                  ].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setSelectedLanguage(lang);
                        setShowLanguageDropdown(false);
                      }}
                      className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-left text-[#c0c7d5] hover:bg-[#1f2435] hover:text-[#00ff88]"
                    >
                      <span>{lang}</span>
                      {selectedLanguage === lang && <CheckCircle2 className="h-3.5 w-3.5 text-[#00ff88]" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notification Bell */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setNotificationActive(!notificationActive)}
            className="relative rounded-lg border border-[#232838] bg-[#141722] p-2 text-[#8b94a5] hover:border-[#38415a] hover:text-[#f3f4f6]"
            title="Match Alerts"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#00ff88]" />
          </motion.button>

          {/* VIP Pass Badge & Avatar */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-[#1f2433]">
            <div className="hidden xl:flex flex-col items-end">
              <span className="text-xs font-bold text-white flex items-center gap-1">
                DAZN PASS <Sparkles className="h-3 w-3 text-[#00ff88]" />
              </span>
              <span className="text-[10px] text-[#00ff88] font-mono">4K ULTRA HDR</span>
            </div>
            <motion.div
              whileHover={{ scale: 1.08, rotate: 3 }}
              className="h-8 w-8 rounded-lg bg-gradient-to-tr from-[#00ff88] to-[#00b3ff] p-[1.5px] cursor-pointer"
            >
              <div className="h-full w-full rounded-[6px] bg-[#0d0e12] flex items-center justify-center font-bold text-xs text-[#00ff88]">
                FL
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </header>
  );
};
