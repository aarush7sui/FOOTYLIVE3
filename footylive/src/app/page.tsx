'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '../components/layout/Sidebar';
import { Navbar } from '../components/layout/Navbar';
import { LiveScoreTicker } from '../components/layout/LiveScoreTicker';
import { HeroVideoPlayer } from '../components/player/HeroVideoPlayer';
import { LiveMatchesCarousel } from '../components/carousels/LiveMatchesCarousel';
import { UpcomingCarousel } from '../components/carousels/UpcomingCarousel';
import { BracketViewer } from '../components/bracket/BracketViewer';
import { HighlightsCarousel } from '../components/carousels/HighlightsCarousel';
import { TournamentsDirectory } from '../components/tournaments/TournamentsDirectory';
import { TournamentDetailModal } from '../components/tournaments/TournamentDetailModal';
import { PageLoadCurtain } from '../components/splash/PageLoadCurtain';
import { ParticleBurstContainer } from '../components/worldcup/ParticleBurst';
import { WorldCupSection } from '../components/worldcup/WorldCupSection';
import { ParallaxItem, FloatingBackgroundGlows } from '../components/common/ParallaxItem';
import { useLiveMatches } from '../hooks/useLiveMatches';
import { MatchCardSkeleton, HeroPlayerSkeleton } from '../components/common/LoadingSkeletons';
import { Match, Tournament, HighlightItem } from '../types/football';
import {
  Trophy,
  Radio,
  Calendar,
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  Globe2,
  Tv,
  RotateCcw,
  Wifi,
  Activity,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';

export default function FootyLiveApp() {
  const {
    matches: liveMatches,
    isLoading: isLiveLoading,
    isLiveConnected,
    error: liveError,
    lastSyncTime,
    refreshLiveScores,
    liveCount,
    totalCount,
    secondsUntilNextSync,
    liveSecondTick,
  } = useLiveMatches();

  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoadingTournaments, setIsLoadingTournaments] = useState<boolean>(true);
  const [currentTab, setCurrentTab] = useState<string>('discover');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [splashReplayCount, setSplashReplayCount] = useState<number>(0);

  // Active streaming match loaded in Hero Video Player
  const [activeMatch, setActiveMatch] = useState<Match | null>(null);

  // Selected tournament for detail modal view
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);

  // Filter by league shortcut from sidebar
  const [selectedLeagueShortcut, setSelectedLeagueShortcut] = useState<string | undefined>(undefined);

  // Fetch worldwide tournaments from live API route
  useEffect(() => {
    async function fetchTournaments() {
      try {
        setIsLoadingTournaments(true);
        const res = await fetch('/api/tournaments');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.tournaments)) {
            setTournaments(data.tournaments);
          }
        }
      } catch (err) {
        console.warn('Failed to load tournaments directory:', err);
      } finally {
        setIsLoadingTournaments(false);
      }
    }
    fetchTournaments();
  }, []);

  // Sync active match with live match feed
  useEffect(() => {
    if (liveMatches && liveMatches.length > 0) {
      setActiveMatch((prev) => {
        if (!prev) {
          const firstLive = liveMatches.find((m) => m.status === 'LIVE');
          return firstLive || liveMatches[0];
        }
        const updated = liveMatches.find((m) => m.id === prev.id);
        if (updated) return updated;
        const firstLive = liveMatches.find((m) => m.status === 'LIVE');
        return firstLive || liveMatches[0];
      });
    }
  }, [liveMatches]);

  // Handle match selection: load immediately into Hero Player and scroll to top
  const handleSelectMatch = (match: Match) => {
    setActiveMatch(match);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle main menu navigation tab selection with smooth scrolling
  const handleTabChange = (tabId: string) => {
    setCurrentTab(tabId);
    if (tabId === 'discover') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tabId === 'live') {
      const el = document.getElementById('live-matches-section');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (tabId === 'tournaments') {
      const el = document.getElementById('world-tournaments-section');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (tabId === 'schedule') {
      const el = document.getElementById('upcoming-section');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (tabId === 'bracket') {
      const el = document.getElementById('bracket-section');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (tabId === 'highlights') {
      const el = document.getElementById('highlights-section');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (tabId === 'favorites') {
      if (tournaments.length > 0) {
        setSelectedTournament(tournaments[0]);
      }
    }
  };

  // Handle league selection from sidebar quick shortcuts
  const handleSelectLeague = (leagueId: string) => {
    setSelectedLeagueShortcut(leagueId);
    if (leagueId === 'fifa-world-cup-2026') {
      const el = document.getElementById('world-cup-2026-experience');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    const tournament = tournaments.find((t) => t.id === leagueId);
    if (tournament) {
      setSelectedTournament(tournament);
    }
  };

  // When playing a highlight, load related match or update player
  const handlePlayHighlight = (highlight: HighlightItem) => {
    const relatedMatch = liveMatches.find(
      (m) =>
        highlight.match.toLowerCase().includes(m.homeTeam.name.toLowerCase()) ||
        highlight.tournament.toLowerCase().includes(m.tournament.toLowerCase())
    );
    if (relatedMatch) {
      setActiveMatch(relatedMatch);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0d0e12] text-[#f3f4f6] relative overflow-x-hidden">
      {/* Dynamic Parallax Floating Background Glows */}
      <FloatingBackgroundGlows />

      {/* 1) PAGE-LOAD CURTAIN (splash) - Plays on first load & re-triggerable */}
      <PageLoadCurtain replayTrigger={splashReplayCount} />

      {/* Particle Burst System on any user click */}
      <ParticleBurstContainer />

      {/* Floating Action Button: Replay Splash */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2 pointer-events-auto">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSplashReplayCount((c) => c + 1)}
          className="flex items-center gap-2 rounded-full border border-[#00ff88]/40 bg-[#121622]/95 px-4 py-2.5 text-xs font-bold text-[#00ff88] shadow-[0_0_20px_rgba(0,255,136,0.25)] backdrop-blur-md hover:bg-[#00ff88] hover:text-black transition-all font-mono"
          title="Replay the FOOTYLive opening splash curtain animation"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>REPLAY SPLASH</span>
        </motion.button>
      </div>

      {/* Collapsible Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        currentTab={currentTab}
        onTabChange={handleTabChange}
        onSelectLeague={handleSelectLeague}
        selectedLeagueId={selectedLeagueShortcut}
        tournaments={tournaments}
        onOpenAllTournaments={() => tournaments.length > 0 && setSelectedTournament(tournaments[0])}
      />

      {/* Main Container */}
      <div className="flex flex-1 flex-col overflow-x-hidden min-w-0 relative z-10">
        {/* Top Ticker: Live Scores Marquee */}
        <LiveScoreTicker
          matches={liveMatches}
          activeMatchId={activeMatch?.id || ''}
          onSelectMatch={handleSelectMatch}
          isLiveConnected={isLiveConnected}
        />

        {/* Global Navigation Header Bar with Real-time Sync Controls */}
        <Navbar
          searchQuery={searchQuery}
          onSearchQuery={setSearchQuery}
          onSelectMatch={handleSelectMatch}
          onSelectTournament={(tourn) => setSelectedTournament(tourn)}
          matches={liveMatches}
          tournaments={tournaments}
          onOpenTournamentsModal={() => tournaments.length > 0 && setSelectedTournament(tournaments[0])}
          isLiveConnected={isLiveConnected}
          lastSyncTime={lastSyncTime}
          onRefreshLive={refreshLiveScores}
          liveCount={liveCount}
          secondsUntilNextSync={secondsUntilNextSync}
        />

        {/* Network latency / error banner if live endpoints are unreachable */}
        {liveError && liveMatches.length === 0 && !isLiveLoading && (
          <div className="mx-4 sm:mx-8 mt-4 p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-amber-300 font-mono">LIVE TELEMETRY STREAM OFFLINE</h4>
                <p className="text-xs text-amber-200/80 mt-0.5">{liveError}</p>
              </div>
            </div>
            <button
              onClick={() => refreshLiveScores()}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Reconnect
            </button>
          </div>
        )}

        {/* Content Body */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 space-y-12 max-w-[1720px] mx-auto w-full">
          {/* Hero Section: Interactive DAZN Video Player Container with Framer Motion Reveal & Parallax */}
          <ParallaxItem speed={20}>
            <motion.section
              id="hero-player"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff88] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00ff88]"></span>
                  </span>
                  <h1 className="text-sm font-black tracking-wider uppercase text-white">
                    MAIN BROADCAST ARENA
                  </h1>
                  <span className="rounded bg-[#00ff88]/20 px-2 py-0.5 text-[10px] font-black text-[#00ff88] uppercase">
                    4K 60FPS LOW LATENCY
                  </span>
                  {activeMatch && activeMatch.status === 'LIVE' && (
                    <span className="rounded-full bg-[#ff3355] px-2 py-0.5 text-[10px] font-black text-white font-mono flex items-center gap-1 animate-pulse">
                      <Radio className="h-3 w-3" /> ON AIR: {activeMatch.minute}
                    </span>
                  )}
                </div>

                {activeMatch && (
                  <div className="hidden sm:flex items-center gap-2 text-xs text-[#8b94a5]">
                    <span>Currently Playing:</span>
                    <strong className="text-white font-semibold">
                      {activeMatch.homeTeam.name} vs {activeMatch.awayTeam.name}
                    </strong>
                  </div>
                )}
              </div>

              {isLiveLoading && !activeMatch ? (
                <HeroPlayerSkeleton />
              ) : activeMatch ? (
                <HeroVideoPlayer match={activeMatch} onSelectMatch={handleSelectMatch} />
              ) : (
                <div className="w-full aspect-video rounded-2xl border border-[#232838] bg-[#121520] flex flex-col items-center justify-center p-8 text-center space-y-3">
                  <Tv className="h-12 w-12 text-[#8b94a5]" />
                  <h3 className="text-base font-bold text-white">No Live Stream Currently Broadcasting</h3>
                  <p className="text-xs text-[#8b94a5] max-w-md">
                    Waiting for live satellite signals. All official fixtures will synchronize immediately upon kickoff.
                  </p>
                  <button
                    onClick={() => refreshLiveScores()}
                    className="px-4 py-2 rounded-xl bg-[#00ff88] text-black font-bold text-xs hover:bg-[#00e078] transition-colors"
                  >
                    Check Scoreboard Feeds
                  </button>
                </div>
              )}
            </motion.section>
          </ParallaxItem>

          {/* Carousel 1: Filterable 'Live Matches' with Framer Motion & Parallax */}
          <ParallaxItem speed={25}>
            <motion.div
              id="live-matches-section"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6 }}
            >
              {isLiveLoading && liveMatches.length === 0 ? (
                <div className="space-y-4">
                  <div className="h-6 w-48 bg-[#232838] rounded animate-pulse" />
                  <div className="flex gap-4 overflow-hidden py-1">
                    {[1, 2, 3].map((i) => (
                      <MatchCardSkeleton key={i} />
                    ))}
                  </div>
                </div>
              ) : (
                <LiveMatchesCarousel
                  matches={liveMatches}
                  activeMatchId={activeMatch?.id || ''}
                  onSelectMatch={handleSelectMatch}
                />
              )}
            </motion.div>
          </ParallaxItem>

          {/* Carousel 2: Filterable 'Upcoming' Matches with Framer Motion & Parallax */}
          <ParallaxItem speed={25}>
            <motion.div
              id="upcoming-section"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6 }}
            >
              <UpcomingCarousel
                matches={liveMatches}
                onSelectMatch={handleSelectMatch}
              />
            </motion.div>
          </ParallaxItem>

          {/* Carousel 3: Filterable Tournament Knockout 'Bracket' with Real Knockout Data & Parallax */}
          <ParallaxItem speed={30}>
            <motion.div
              id="bracket-section"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6 }}
            >
              <BracketViewer />
            </motion.div>
          </ParallaxItem>

          {/* Carousel 4: Filterable 'Highlights' & VODs with Framer Motion & Parallax */}
          <ParallaxItem speed={25}>
            <motion.div
              id="highlights-section"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6 }}
            >
              <HighlightsCarousel onPlayHighlight={handlePlayHighlight} />
            </motion.div>
          </ParallaxItem>

          {/* SINGLE-PAGE INTEGRATED "WORLD CUP 2026" COMPLETED TOURNAMENT SECTION WITH PARALLAX */}
          <ParallaxItem speed={35}>
            <WorldCupSection />
          </ParallaxItem>

          {/* Option to look through all football tournaments in the world with Parallax */}
          <ParallaxItem speed={20}>
            <motion.section
              id="world-tournaments-section"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6 }}
              className="pt-4 border-t border-[#1e2434]"
            >
              {isLoadingTournaments ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-6 w-64 bg-[#232838] rounded" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="h-32 rounded-2xl bg-[#141825] border border-[#232838]" />
                    ))}
                  </div>
                </div>
              ) : (
                <TournamentsDirectory
                  tournaments={tournaments}
                  onSelectTournament={(tourn) => setSelectedTournament(tourn)}
                />
              )}
            </motion.section>
          </ParallaxItem>

          {/* Platform Feature Footer Banner */}
          <ParallaxItem speed={15}>
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-[#23293c] bg-gradient-to-r from-[#111420] via-[#141826] to-[#0f121a] p-6 sm:p-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#00ff88]/20 border border-[#00ff88]/40">
                    <Zap className="h-5 w-5 text-[#00ff88]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Ultra-Low Latency Broadcast</h4>
                    <p className="text-xs text-[#8b94a5] mt-1">
                      Direct optical pitch feed sync with less than 2-second delay compared to stadium action.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#00ff88]/20 border border-[#00ff88]/40">
                    <Tv className="h-5 w-5 text-[#00ff88]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Multi-Angle Tactical Cams</h4>
                    <p className="text-xs text-[#8b94a5] mt-1">
                      Switch between Tactical Cam, Super Slow-Mo 4K Goal-line, and dedicated player ISO cameras.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#00ff88]/20 border border-[#00ff88]/40">
                    <Globe2 className="h-5 w-5 text-[#00ff88]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Worldwide Tournaments Hub</h4>
                    <p className="text-xs text-[#8b94a5] mt-1">
                      Complete access to UEFA, CONMEBOL, FIFA World Cup 2026, Premier League, La Liga, and AFC leagues.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#1c2233] flex flex-wrap items-center justify-between gap-4 text-xs text-[#606a7e]">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[#00ff88]" />
                  <span>© 2026 FOOTYLive Streaming Network. DAZN-Grade Football Broadcasting.</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="hover:text-white cursor-pointer">Privacy & DRM</span>
                  <span className="hover:text-white cursor-pointer">Broadcast Licenses</span>
                  <span className="hover:text-white cursor-pointer">Stream Status</span>
                  <span className="text-[#00ff88] font-mono">v3.4.0-PRO</span>
                </div>
              </div>
            </motion.section>
          </ParallaxItem>
        </main>
      </div>

      {/* World Tournament Details Standings & Fixtures Modal */}
      <TournamentDetailModal
        tournament={selectedTournament}
        onClose={() => setSelectedTournament(null)}
        onSelectMatchFixture={(home, away) => {
          setSelectedTournament(null);
          const foundMatch = liveMatches.find(
            (m) =>
              m.homeTeam.name.toLowerCase().includes(home.toLowerCase()) ||
              m.awayTeam.name.toLowerCase().includes(away.toLowerCase())
          );
          if (foundMatch) {
            handleSelectMatch(foundMatch);
          }
        }}
      />
    </div>
  );
}
