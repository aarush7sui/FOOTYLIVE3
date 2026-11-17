'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  GitBranch,
  Trophy,
  ChevronLeft,
  ChevronRight,
  Flame,
  Award,
  Calendar,
  AlertCircle,
  RefreshCw,
  MapPin,
} from 'lucide-react';
import { BracketRound } from '../../types/football';
import { TeamLogo } from '../common/TeamLogo';
import { TiltCard } from '../worldcup/TiltCard';

interface BracketViewerProps {
  onSelectTournamentId?: (id: string) => void;
}

export const BracketViewer: React.FC<BracketViewerProps> = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedTournament, setSelectedTournament] = useState<'worldcup' | 'ucl' | 'euro' | 'copa'>('worldcup');
  const [rounds, setRounds] = useState<BracketRound[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const tournamentOptions = [
    { id: 'worldcup', name: 'FIFA World Cup 2026', icon: '🌍', badge: 'COMPLETED' },
    { id: 'ucl', name: 'Champions League', icon: '⭐', badge: 'OFFICIAL' },
    { id: 'euro', name: 'UEFA EURO 2024', icon: '🇪🇺', badge: 'OFFICIAL' },
    { id: 'copa', name: 'Copa América', icon: '🏆', badge: 'OFFICIAL' },
  ];

  const fetchBracket = async (tId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch(`/api/bracket?tournament=${tId}`);
      if (!res.ok) throw new Error(`Bracket API returned status ${res.status}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.rounds)) {
        setRounds(data.rounds);
      } else {
        throw new Error(data.error || 'Failed to load tournament bracket');
      }
    } catch (err: any) {
      setError(err.message || 'Knockout telemetry feed unreachable');
      setRounds([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBracket(selectedTournament);
  }, [selectedTournament]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -380 : 380;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section className="space-y-4">
      {/* Header and Tournament Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#00ff88]/20 border border-[#00ff88]/40 shadow-[0_0_12px_rgba(0,255,136,0.25)]">
            <GitBranch className="h-5 w-5 text-[#00ff88]" />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
              OFFICIAL TOURNAMENT KNOCKOUT BRACKET
              <span className="rounded-full bg-[#1c2233] px-2.5 py-0.5 text-[10px] font-bold text-[#00ff88] font-mono border border-[#00ff88]/30">
                VERIFIED REAL RESULTS
              </span>
            </h2>
            <p className="text-xs text-[#8b94a5]">
              Real-world knockout tournament progression with verified match scores, aggregate legs, penalties, and venues
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Tournament Toggle Pills with Framer Motion Sliding Pill */}
          <div className="flex items-center gap-1 rounded-xl border border-[#232838] bg-[#141722] p-1">
            {tournamentOptions.map((t) => {
              const isSelected = selectedTournament === t.id;
              return (
                <motion.button
                  key={t.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedTournament(t.id as any)}
                  className="relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all"
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeBracketTournamentPill"
                      className="absolute inset-0 rounded-lg bg-[#00ff88] shadow-[0_0_12px_rgba(0,255,136,0.35)]"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{t.icon}</span>
                  <span className={`relative z-10 ${isSelected ? 'text-black' : 'text-[#8b94a5]'}`}>
                    {t.name}
                  </span>
                </motion.button>
              );
            })}
          </div>

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

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="flex gap-6 overflow-hidden py-4">
          {[1, 2, 3, 4].map((r) => (
            <div key={r} className="min-w-[320px] space-y-4 animate-pulse">
              <div className="h-5 w-36 bg-[#232838] rounded-lg" />
              {[1, 2].map((m) => (
                <div key={m} className="h-32 rounded-2xl bg-[#141724] border border-[#232838]" />
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {!isLoading && error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-950/20 p-6 text-center">
          <AlertCircle className="h-6 w-6 text-red-400 mx-auto mb-2" />
          <p className="text-xs text-red-300 font-mono mb-3">{error}</p>
          <button
            onClick={() => fetchBracket(selectedTournament)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-xs text-red-300 font-bold transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Reconnect Bracket Feed
          </button>
        </div>
      )}

      {/* Bracket Rounds Container */}
      {!isLoading && !error && rounds.length > 0 && (
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto no-scrollbar py-2"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {rounds.map((round, rIndex) => (
            <div
              key={round.title}
              className="flex min-w-[320px] max-w-[340px] flex-col space-y-3"
              style={{ scrollSnapAlign: 'start' }}
            >
              {/* Round Header */}
              <div className="flex items-center justify-between border-b border-[#232838] pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#1e2333] text-[10px] font-bold text-[#00ff88] font-mono border border-[#00ff88]/30">
                    {rIndex + 1}
                  </span>
                  <h3 className="text-xs font-black uppercase tracking-wider text-white">
                    {round.title}
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-[#8b94a5]">
                  {round.matches.length} {round.matches.length === 1 ? 'Match' : 'Matches'}
                </span>
              </div>

              {/* Match Cards with 3D Tilt Parallax */}
              <div className="flex flex-1 flex-col justify-around gap-3">
                {round.matches.map((match) => (
                  <TiltCard
                    key={match.id}
                    maxTilt={6}
                    className="border border-[#232838] bg-[#12151e] p-3.5 shadow-xl hover:border-[#00ff88]/50"
                  >
                    {/* Header: Date, Venue & Status */}
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#8b94a5] mb-2.5 border-b border-[#1c2233] pb-2">
                      <span className="truncate max-w-[190px] flex items-center gap-1">
                        <MapPin className="h-2.5 w-2.5 text-[#00ff88]" />
                        {match.venue || match.date}
                      </span>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[9px] font-bold font-mono ${
                          match.notes?.includes('CHAMPIONS')
                            ? 'bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/50 shadow-[0_0_8px_rgba(0,255,136,0.3)]'
                            : match.status === 'COMPLETED'
                            ? 'bg-[#1c2233] text-[#8b94a5]'
                            : 'bg-red-500/20 text-red-400 animate-pulse'
                        }`}
                      >
                        {match.notes?.includes('CHAMPIONS') ? 'CHAMPIONS 🏆' : match.notes || match.status}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {/* Team 1 */}
                      <div
                        className={`flex items-center justify-between rounded-lg px-2.5 py-2 transition-colors ${
                          match.team1.isWinner
                            ? 'bg-[#00ff88]/15 text-white font-bold border border-[#00ff88]/20'
                            : 'text-[#8b94a5] bg-[#151926]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <TeamLogo logo={match.team1.flag} name={match.team1.name} className="h-5 w-5" />
                          <span className="text-xs truncate max-w-[170px] font-semibold text-white">
                            {match.team1.name}
                          </span>
                          {match.team1.isWinner && (
                            <Award className="h-3.5 w-3.5 text-[#00ff88] ml-0.5" />
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 font-mono">
                          {match.team1.penalties !== undefined && (
                            <span className="text-[10px] text-[#8b94a5]">({match.team1.penalties})</span>
                          )}
                          <span className="text-sm font-black text-white">
                            {match.team1.score ?? '-'}
                          </span>
                        </div>
                      </div>

                      {/* Team 2 */}
                      <div
                        className={`flex items-center justify-between rounded-lg px-2.5 py-2 transition-colors ${
                          match.team2.isWinner
                            ? 'bg-[#00ff88]/15 text-white font-bold border border-[#00ff88]/20'
                            : 'text-[#8b94a5] bg-[#151926]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <TeamLogo logo={match.team2.flag} name={match.team2.name} className="h-5 w-5" />
                          <span className="text-xs truncate max-w-[170px] font-semibold text-white">
                            {match.team2.name}
                          </span>
                          {match.team2.isWinner && (
                            <Award className="h-3.5 w-3.5 text-[#00ff88] ml-0.5" />
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 font-mono">
                          {match.team2.penalties !== undefined && (
                            <span className="text-[10px] text-[#8b94a5]">({match.team2.penalties})</span>
                          )}
                          <span className="text-sm font-black text-white">
                            {match.team2.score ?? '-'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {match.notes && !match.notes.includes('CHAMPIONS') && (
                      <div className="mt-2 pt-1.5 border-t border-[#1a2030] text-[10px] font-mono text-[#00ff88] text-right">
                        {match.notes}
                      </div>
                    )}
                  </TiltCard>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
