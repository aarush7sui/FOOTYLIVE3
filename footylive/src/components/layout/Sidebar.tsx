'use client';

import React from 'react';
import Link from 'next/link';
import {
  Home,
  Radio,
  Trophy,
  CalendarDays,
  GitBranch,
  PlaySquare,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Flame,
  ShieldCheck,
  Globe2,
  Tv2,
  Sliders,
  Settings,
} from 'lucide-react';
import { Tournament } from '../../types/football';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onSelectLeague: (leagueId: string) => void;
  selectedLeagueId?: string;
  tournaments: Tournament[];
  onOpenAllTournaments: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  isCollapsed,
  onToggleCollapse,
  onSelectLeague,
  selectedLeagueId,
  tournaments,
  onOpenAllTournaments,
}) => {
  const navItems = [
    { id: 'discover', label: 'Discover & Stream', icon: Home },
    { id: 'live', label: 'Live Now', icon: Radio, badge: '5 LIVE', badgeColor: 'bg-[#ff3355]' },
    { id: 'tournaments', label: 'All Tournaments', icon: Trophy, badge: 'WORLD', badgeColor: 'bg-[#00ff88]/20 text-[#00ff88]' },
    { id: 'schedule', label: 'Fixtures & Schedule', icon: CalendarDays },
    { id: 'bracket', label: 'Tournament Brackets', icon: GitBranch },
    { id: 'highlights', label: 'Highlights & VOD', icon: PlaySquare },
    { id: 'favorites', label: 'My Watchlist', icon: Bookmark },
  ];

  const quickLeagues = [
    { id: 'uefa-champions-league', name: 'Champions League', flag: '⭐' },
    { id: 'premier-league', name: 'Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
    { id: 'la-liga', name: 'La Liga EA Sports', flag: '🇪🇸' },
    { id: 'serie-a', name: 'Serie A', flag: '🇮🇹' },
    { id: 'bundesliga', name: 'Bundesliga', flag: '🇩🇪' },
    { id: 'fifa-world-cup-2026', name: 'World Cup 2026', flag: '🌍' },
    { id: 'copa-libertadores', name: 'Copa Libertadores', flag: '🏆' },
    { id: 'saudi-pro-league', name: 'Saudi Pro League', flag: '🇸🇦' },
  ];

  return (
    <aside
      className={`relative flex flex-col justify-between border-r border-[#1a1f2c] bg-[#0f1118] transition-all duration-300 z-30 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Header / Logo */}
      <div>
        <div className="flex h-16 items-center justify-between px-4 border-b border-[#1a1f2c]">
          <div
            onClick={() => onTabChange('discover')}
            className="flex items-center gap-3 cursor-pointer overflow-hidden"
          >
            <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#12151e] to-[#1c2233] border border-[#2b3348] shadow-md group">
              <Tv2 className="h-5 w-5 text-[#00ff88] transition-transform group-hover:scale-110" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff88] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00ff88]"></span>
              </span>
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <div className="flex items-center tracking-wider font-black text-lg text-white">
                  FOOTY<span className="text-[#00ff88] ml-0.5">LIVE</span>
                </div>
                <span className="text-[9px] uppercase tracking-widest text-[#8b94a5] font-semibold -mt-1">
                  DAZN BROADCAST
                </span>
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            className="rounded-lg p-1.5 text-[#8b94a5] hover:bg-[#181d29] hover:text-[#f3f4f6] transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Primary Navigation */}
        <nav className="p-3 space-y-1">
          <div className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#647188] ${isCollapsed ? 'text-center' : ''}`}>
            {isCollapsed ? '•••' : 'Main Menu'}
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all relative ${
                  isActive
                    ? 'bg-[#18202d] text-[#00ff88] border border-[#00ff88]/30 shadow-[0_0_12px_rgba(0,255,136,0.12)]'
                    : 'text-[#9da7b8] hover:bg-[#141824] hover:text-white'
                } ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon
                  className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-[#00ff88]' : 'text-[#8b94a5]'
                  }`}
                />
                {!isCollapsed && (
                  <div className="flex flex-1 items-center justify-between">
                    <span>{item.label}</span>
                    {item.badge && (
                      <span
                        className={`rounded-md px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                          item.badgeColor || 'bg-[#232838] text-[#c0c7d5]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
                {/* Active Neon Bar */}
                {isActive && (
                  <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-md bg-[#00ff88]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Leagues Section */}
        <div className="p-3 pt-1 border-t border-[#1a1f2c]">
          <div className="flex items-center justify-between px-2 py-1.5">
            <span className={`text-[10px] font-bold uppercase tracking-wider text-[#647188] ${isCollapsed ? 'sr-only' : ''}`}>
              Top Leagues
            </span>
            {!isCollapsed && (
              <button
                onClick={onOpenAllTournaments}
                className="text-[10px] font-semibold text-[#00ff88] hover:underline"
              >
                Browse All
              </button>
            )}
          </div>
          <div className="space-y-1">
            {/* World Cup 2026 Daylight Experience Button */}
            <button
              onClick={() => {
                const el = document.getElementById('world-cup-2026-experience');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs border border-[#0055FF]/40 bg-[#0055FF]/15 text-[#5497ff] hover:bg-[#0055FF] hover:text-white transition-all ${
                isCollapsed ? 'justify-center' : ''
              }`}
              title="World Cup 2026 Daylight Experience"
            >
              <span className="text-sm">🌍</span>
              {!isCollapsed && (
                <div className="flex flex-1 items-center justify-between">
                  <span className="font-bold text-white">World Cup &apos;26</span>
                  <span className="rounded bg-[#FF3D00] px-1.5 py-0.2 text-[9px] font-black text-white">
                    DAYLIGHT
                  </span>
                </div>
              )}
            </button>

            {quickLeagues.map((league) => {
              const isSelected = selectedLeagueId === league.id;
              return (
                <button
                  key={league.id}
                  onClick={() => onSelectLeague(league.id)}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs transition-colors ${
                    isSelected
                      ? 'bg-[#18202d] text-[#00ff88] font-bold border border-[#00ff88]/30'
                      : 'text-[#9da7b8] hover:bg-[#141824] hover:text-[#f3f4f6]'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                  title={isCollapsed ? league.name : undefined}
                >
                  <span className="text-sm">{league.flag}</span>
                  {!isCollapsed && (
                    <span className="truncate text-left">{league.name}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom VIP Subscription Pill */}
      <div className="p-3 border-t border-[#1a1f2c] bg-[#0c0e14]">
        {!isCollapsed ? (
          <div className="rounded-xl border border-[#2b3347] bg-gradient-to-b from-[#141926] to-[#0e111a] p-3 text-left">
            <div className="flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-1.5 text-xs font-black text-white">
                <ShieldCheck className="h-3.5 w-3.5 text-[#00ff88]" />
                DAZN PRO PASS
              </span>
              <span className="rounded bg-[#00ff88]/20 px-1.5 py-0.5 text-[9px] font-bold text-[#00ff88]">
                ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-[#8b94a5] mb-2 leading-tight">
              Streaming in 4K HDR 60fps with zero ads & multi-angle camera feeds.
            </p>
            <button
              onClick={onOpenAllTournaments}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#00ff88] py-1.5 text-xs font-bold text-black transition-all hover:bg-[#12ff96] shadow-[0_0_12px_rgba(0,255,136,0.3)]"
            >
              <Globe2 className="h-3.5 w-3.5" />
              World Tournaments Hub
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAllTournaments}
            className="flex h-10 w-full items-center justify-center rounded-xl bg-[#00ff88]/10 text-[#00ff88] hover:bg-[#00ff88]/20 transition-colors"
            title="Explore All Tournaments"
          >
            <Globe2 className="h-5 w-5 text-[#00ff88]" />
          </button>
        )}
      </div>
    </aside>
  );
};
