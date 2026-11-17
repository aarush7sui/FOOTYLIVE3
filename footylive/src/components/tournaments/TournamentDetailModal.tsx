'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Trophy,
  Users,
  Calendar,
  Award,
  Globe,
  Radio,
  Flame,
  CheckCircle,
  ExternalLink,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { Tournament, StandingItem } from '../../types/football';
import { TeamLogo } from '../common/TeamLogo';
import { StandingsSkeleton } from '../common/LoadingSkeletons';

interface TournamentDetailModalProps {
  tournament: Tournament | null;
  onClose: () => void;
  onSelectMatchFixture?: (home: string, away: string) => void;
}

export const TournamentDetailModal: React.FC<TournamentDetailModalProps> = ({
  tournament,
  onClose,
  onSelectMatchFixture,
}) => {
  const [activeTab, setActiveTab] = useState<'standings' | 'fixtures' | 'scorers' | 'info'>('standings');
  const [liveStandings, setLiveStandings] = useState<StandingItem[]>([]);
  const [isLoadingStandings, setIsLoadingStandings] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch real-world live standings from ESPN API when tournament opens
  const fetchStandings = async () => {
    if (!tournament) return;
    try {
      setIsLoadingStandings(true);
      setError(null);
      const res = await fetch(`/api/standings?league=${tournament.id}`);
      if (!res.ok) {
        throw new Error(`Standings telemetry responded with status ${res.status}`);
      }
      const data = await res.json();
      if (data.success && Array.isArray(data.standings) && data.standings.length > 0) {
        setLiveStandings(data.standings);
      } else {
        throw new Error(data.error || 'No live standings data returned for this competition');
      }
    } catch (err: any) {
      setError(err.message || 'Unable to connect to live standings feed');
      setLiveStandings([]);
    } finally {
      setIsLoadingStandings(false);
    }
  };

  useEffect(() => {
    fetchStandings();
  }, [tournament]);

  if (!tournament) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border border-[#262c3e] bg-[#0f121b] shadow-2xl overflow-hidden"
        >
          {/* Modal Header */}
          <div className="relative border-b border-[#1c2233] bg-gradient-to-r from-[#141825] via-[#10141f] to-[#171c2c] p-5 sm:p-6">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-4 right-4 rounded-xl border border-white/10 bg-black/40 p-2 text-[#8b94a5] hover:text-white hover:border-[#00ff88]/50 transition-colors"
            >
              <X className="h-5 w-5" />
            </motion.button>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1c2234] border border-[#2b3348] text-3xl shadow-inner">
                {tournament.flag}
              </div>

              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="rounded-md bg-[#00ff88]/20 border border-[#00ff88]/30 px-2 py-0.5 text-[10px] font-black uppercase text-[#00ff88] font-mono">
                    {tournament.confederation} • {tournament.tier}
                  </span>
                  <span className="text-xs text-[#8b94a5]">{tournament.region}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {tournament.name}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-[#8b94a5] mt-1 font-mono">
                  <span>Season: <strong className="text-white">{tournament.currentSeason}</strong></span>
                  <span>•</span>
                  <span>Status: <strong className="text-[#00ff88]">{tournament.currentPhase}</strong></span>
                  <span>•</span>
                  <span>Champions: <strong className="text-white">🏆 {tournament.defendingChampion}</strong></span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs with Framer Motion Sliding Pill */}
            <div className="flex items-center gap-2 mt-5 border-t border-[#1e2436] pt-3 overflow-x-auto no-scrollbar">
              {[
                { id: 'standings', label: 'League Table & Standings' },
                { id: 'fixtures', label: 'Fixtures & Schedule' },
                { id: 'scorers', label: 'Top Scorers' },
                { id: 'info', label: 'Tournament Overview' },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setActiveTab(tab.id as any)}
                    className="relative rounded-lg px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition-all"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeModalTab"
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
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar space-y-4">
            {/* Standings Tab */}
            {activeTab === 'standings' && (
              <div>
                {isLoadingStandings && <StandingsSkeleton />}

                {!isLoadingStandings && error && (
                  <div className="rounded-xl border border-red-500/20 bg-red-950/20 p-6 text-center">
                    <AlertCircle className="h-6 w-6 text-red-400 mx-auto mb-2" />
                    <p className="text-xs text-red-300 font-mono mb-3">{error}</p>
                    <button
                      onClick={fetchStandings}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-xs text-red-300 font-bold transition-colors"
                    >
                      <RefreshCw className="h-3.5 w-3.5" /> Reconnect to Live Standings Feed
                    </button>
                  </div>
                )}

                {!isLoadingStandings && !error && liveStandings.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-[#202738] text-[11px] font-bold uppercase text-[#8b94a5] font-mono">
                          <th className="py-2.5 px-3">#</th>
                          <th className="py-2.5 px-3">Club</th>
                          <th className="py-2.5 px-3 text-center">P</th>
                          <th className="py-2.5 px-3 text-center">W</th>
                          <th className="py-2.5 px-3 text-center">D</th>
                          <th className="py-2.5 px-3 text-center">L</th>
                          <th className="py-2.5 px-3 text-center">GD</th>
                          <th className="py-2.5 px-3 text-center font-bold text-white">PTS</th>
                          <th className="py-2.5 px-3 text-center">Recent Form</th>
                        </tr>
                      </thead>
                      <tbody>
                        {liveStandings.map((row) => (
                          <tr
                            key={row.team}
                            className="border-b border-[#181d2c] hover:bg-[#151926] transition-colors"
                          >
                            <td className="py-2.5 px-3 font-mono font-bold text-[#8b94a5]">
                              <span
                                className={`inline-flex h-5 w-5 items-center justify-center rounded ${
                                  row.rank <= 4
                                    ? 'bg-[#00ff88]/20 text-[#00ff88] font-bold'
                                    : 'text-[#8b94a5]'
                                }`}
                              >
                                {row.rank}
                              </span>
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-2.5">
                                <TeamLogo logo={row.logo} name={row.team} className="h-5 w-5" />
                                <span className="font-bold text-white truncate max-w-[150px] sm:max-w-[200px]">
                                  {row.team}
                                </span>
                              </div>
                            </td>
                            <td className="py-2.5 px-3 text-center font-mono text-[#8b94a5]">{row.played}</td>
                            <td className="py-2.5 px-3 text-center font-mono text-[#8b94a5]">{row.won}</td>
                            <td className="py-2.5 px-3 text-center font-mono text-[#8b94a5]">{row.drawn}</td>
                            <td className="py-2.5 px-3 text-center font-mono text-[#8b94a5]">{row.lost}</td>
                            <td className="py-2.5 px-3 text-center font-mono text-[#8b94a5]">
                              {row.gd > 0 ? `+${row.gd}` : row.gd}
                            </td>
                            <td className="py-2.5 px-3 text-center font-mono font-black text-white text-sm">
                              {row.points}
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="flex items-center justify-center gap-1">
                                {row.form.map((res, i) => (
                                  <span
                                    key={i}
                                    className={`flex h-4 w-4 items-center justify-center rounded text-[9px] font-black font-mono ${
                                      res === 'W'
                                        ? 'bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/40'
                                        : res === 'D'
                                        ? 'bg-[#ffaa00]/20 text-[#ffaa00] border border-[#ffaa00]/40'
                                        : 'bg-red-500/20 text-red-400 border border-red-500/40'
                                    }`}
                                  >
                                    {res}
                                  </span>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Fixtures Tab */}
            {activeTab === 'fixtures' && (
              <div className="space-y-3">
                <div className="rounded-xl border border-[#232838] bg-[#121520] p-4">
                  <div className="flex items-center justify-between mb-3 text-xs text-[#8b94a5] font-mono">
                    <span>Official Matchday Schedule</span>
                    <span className="text-[#00ff88]">Live Synchronized</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { home: 'Top Seed A', away: 'Challenger B', time: 'Tomorrow • 20:00 GMT', venue: 'Main Arena' },
                      { home: 'League Leader', away: 'Rival FC', time: 'Saturday • 17:30 GMT', venue: 'Metropolitan Stadium' },
                      { home: 'Continental Contender', away: 'Domestic Champ', time: 'Sunday • 19:45 GMT', venue: 'National Bowl' },
                    ].map((fixture, idx) => (
                      <div
                        key={idx}
                        className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-lg bg-[#161a27] border border-[#202638] hover:border-[#00ff88]/40 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-white">{fixture.home}</span>
                          <span className="text-[10px] font-mono text-[#00ff88] bg-[#00ff88]/10 px-1.5 py-0.5 rounded">VS</span>
                          <span className="text-xs font-bold text-white">{fixture.away}</span>
                        </div>
                        <div className="text-[11px] font-mono text-[#8b94a5]">
                          {fixture.time} • {fixture.venue}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Scorers Tab */}
            {activeTab === 'scorers' && (
              <div className="space-y-3">
                <div className="rounded-xl border border-[#232838] bg-[#121520] p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Trophy className="h-4 w-4 text-[#ffaa00]" />
                    <h3 className="text-xs font-bold uppercase text-white font-mono">Top Scorer Leaderboard</h3>
                  </div>
                  <div className="space-y-2">
                    {[
                      { rank: 1, name: 'Leading Striker', team: 'League Leaders', goals: 14, assists: 5 },
                      { rank: 2, name: 'Key Winger', team: 'Top 4 Contender', goals: 11, assists: 7 },
                      { rank: 3, name: 'Attacking Playmaker', team: 'European Finalist', goals: 9, assists: 8 },
                    ].map((scorer) => (
                      <div
                        key={scorer.rank}
                        className="flex items-center justify-between p-3 rounded-lg bg-[#161a27] border border-[#202638]"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-xs text-[#00ff88]">#{scorer.rank}</span>
                          <div>
                            <div className="text-xs font-bold text-white">{scorer.name}</div>
                            <div className="text-[10px] text-[#8b94a5]">{scorer.team}</div>
                          </div>
                        </div>
                        <div className="font-mono text-xs text-white">
                          <strong className="text-[#00ff88] text-sm">{scorer.goals}</strong> goals ({scorer.assists} assists)
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Info Tab */}
            {activeTab === 'info' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-[#232838] bg-[#121520] p-4 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#00ff88] font-mono flex items-center gap-2">
                    <Globe className="h-4 w-4" /> Competition Details
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-[#1c2233]">
                      <span className="text-[#8b94a5]">Confederation:</span>
                      <span className="font-bold text-white">{tournament.confederation}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#1c2233]">
                      <span className="text-[#8b94a5]">Region:</span>
                      <span className="font-bold text-white">{tournament.region}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#1c2233]">
                      <span className="text-[#8b94a5]">Tier:</span>
                      <span className="font-bold text-white">{tournament.tier} Competition</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#1c2233]">
                      <span className="text-[#8b94a5]">Total Clubs / Nations:</span>
                      <span className="font-mono font-bold text-white">{tournament.totalTeams}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#8b94a5]">Host Venues:</span>
                      <span className="font-mono font-bold text-white">{tournament.venueCount} Stadiums</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-[#232838] bg-[#121520] p-4 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#00ff88] font-mono flex items-center gap-2">
                    <Radio className="h-4 w-4" /> Broadcast & Technology
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-[#1c2233]">
                      <span className="text-[#8b94a5]">Stream Telemetry:</span>
                      <span className="font-bold text-[#00ff88]">Live 4K Ultra HDR</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#1c2233]">
                      <span className="text-[#8b94a5]">Official Match Ball:</span>
                      <span className="font-bold text-white">{tournament.officialBall || 'Standard FIFA Matchball'}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#8b94a5]">Broadcast Rights:</span>
                      <span className="font-bold text-white truncate max-w-[160px]">
                        {tournament.broadcastPartners?.join(', ') || 'FOOTYLive Satellite'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
