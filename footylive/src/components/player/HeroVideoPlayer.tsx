'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TeamLogo } from '../common/TeamLogo';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Settings2,
  Radio,
  Eye,
  Camera,
  Activity,
  Users,
  MessageSquare,
  Sparkles,
  Flame,
  Award,
  Layers,
  Volume1,
  Share2,
  Info,
  Check,
} from 'lucide-react';
import { Match, MatchEvent } from '../../types/football';

interface HeroVideoPlayerProps {
  match: Match;
  onSelectMatch?: (match: Match) => void;
}

export const HeroVideoPlayer: React.FC<HeroVideoPlayerProps> = ({ match }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'stats' | 'lineups' | 'events' | 'chat'>('stats');
  const [showMatchDrawer, setShowMatchDrawer] = useState(true);

  // Stream settings
  const [selectedQuality, setSelectedQuality] = useState<string>(match.streamQuality || '4K HDR');
  const [showQualityMenu, setShowQualityMenu] = useState(false);

  const [selectedAngle, setSelectedAngle] = useState(match.cameraAngles?.[0]?.name || 'Tactical Cam 1');
  const [showAngleMenu, setShowAngleMenu] = useState(false);

  const [selectedCommentary, setSelectedCommentary] = useState(
    match.commentaryTracks?.[0]?.language || 'English (UK)'
  );
  const [showCommentaryMenu, setShowCommentaryMenu] = useState(false);

  // Sync state when active match changes
  useEffect(() => {
    setSelectedQuality(match.streamQuality || '4K HDR');
    if (match.cameraAngles && match.cameraAngles.length > 0) {
      setSelectedAngle(match.cameraAngles[0].name);
    }
    if (match.commentaryTracks && match.commentaryTracks.length > 0) {
      setSelectedCommentary(match.commentaryTracks[0].language);
    }
  }, [match.id, match.streamQuality]);

  // Fan chat messages
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; user: string; text: string; time: string; team?: string }>>([
    { id: 'c1', user: 'Madridista_07', text: 'BELLINGHAM IS HIM! WHAT A VOLLEY ⚽🔥', time: '74\'', team: 'RMA' },
    { id: 'c2', user: 'CityzensDaily', text: 'De Bruyne and Haaland connection is unstoppable tonight', time: '75\'', team: 'MCI' },
    { id: 'c3', user: 'KroosControl', text: 'Ancelotti make the sub bring on Modrić please', time: '77\'', team: 'RMA' },
    { id: 'c4', user: 'TacticsJunkie', text: 'Both managers playing at insane tactical level, 2.18 xG vs 1.94 xG', time: '78\'' },
  ]);
  const [newChatMessage, setNewChatMessage] = useState('');
  const [floatingReactions, setFloatingReactions] = useState<Array<{ id: number; emoji: string; x: number }>>([]);

  const containerRef = useRef<HTMLDivElement>(null);

  // Trigger floating reaction animation
  const triggerReaction = (emoji: string) => {
    const id = Date.now() + Math.random();
    const x = Math.floor(Math.random() * 60) + 20; // 20% to 80%
    setFloatingReactions((prev) => [...prev, { id, emoji, x }]);
    setTimeout(() => {
      setFloatingReactions((prev) => prev.filter((r) => r.id !== id));
    }, 2000);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatMessage.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        user: 'You (VIP Streamer)',
        text: newChatMessage,
        time: match.minute || 'LIVE',
      },
    ]);
    setNewChatMessage('');
    triggerReaction('⚽');
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-2xl overflow-hidden border border-[#232a3b] bg-[#0c0e14] shadow-2xl transition-all"
    >
      {/* Top Match Info Overlay Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1c2233] bg-[#10131d]/90 px-4 py-2.5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 rounded-full bg-[#ff3355]/20 border border-[#ff3355]/40 px-2.5 py-0.5 text-xs font-black text-[#ff3355]">
            <span className="h-2 w-2 rounded-full bg-[#ff3355] animate-ping" />
            LIVE STREAM
          </span>
          <div className="flex items-center gap-2 text-xs font-medium text-[#c0c7d5]">
            <span className="text-[#00ff88] font-bold">{match.tournament}</span>
            <span>•</span>
            <span className="text-white font-semibold">{match.stage || 'Quarter-Final'}</span>
            <span>•</span>
            <span className="text-[#8b94a5] hidden sm:inline">{match.stadium}, {match.city}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 rounded bg-[#18202e] px-2 py-0.5 text-xs text-[#8b94a5]">
            <Eye className="h-3.5 w-3.5 text-[#00ff88]" />
            <span className="font-mono text-white font-bold">{match.viewers || '1.8M'}</span>
          </span>
          <span className="rounded border border-[#00ff88]/40 bg-[#00ff88]/10 px-2 py-0.5 text-[11px] font-black text-[#00ff88]">
            {selectedQuality}
          </span>
        </div>
      </div>

      {/* Main Video Arena Layout: Video Screen + Right Side Match Center */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-[480px] xl:min-h-[540px]">
        {/* Left: Video Player Arena Canvas */}
        <div
          className={`relative flex flex-col justify-between bg-gradient-to-b from-[#0a0c12] via-[#0d1017] to-[#08090d] overflow-hidden ${
            showMatchDrawer ? 'lg:col-span-8 xl:col-span-8' : 'lg:col-span-12'
          }`}
        >
          {/* Animated Pitch Atmosphere Simulation */}
          <div className="absolute inset-0 pointer-events-none opacity-40">
            {/* Tactical Grid / Field Lines */}
            <div className="absolute inset-x-8 inset-y-12 border border-white/10 rounded-2xl">
              <div className="absolute inset-y-0 left-1/2 w-[1px] bg-white/10" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-44 w-44 rounded-full border border-white/10" />
              <div className="absolute inset-y-16 left-0 w-24 border-r border-y border-white/10" />
              <div className="absolute inset-y-16 right-0 w-24 border-l border-y border-white/10" />
            </div>

            {/* Stadium Floodlights Glow */}
            <div className="absolute -top-32 left-1/4 h-80 w-80 rounded-full bg-[#00ff88]/10 blur-3xl" />
            <div className="absolute -top-32 right-1/4 h-80 w-80 rounded-full bg-[#0099ff]/10 blur-3xl" />
            <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 h-64 w-96 rounded-full bg-[#00ff88]/5 blur-3xl" />
          </div>

          {/* Floating animated tactical player dots & soccer ball */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Tactical Ball Movement */}
            <div className="absolute top-[48%] left-[46%] animate-pitch-ball">
              <div className="h-4 w-4 rounded-full bg-white shadow-[0_0_12px_#00ff88] flex items-center justify-center text-[8px]">
                ⚽
              </div>
            </div>

            {/* Home Player Nodes (White/Gold) */}
            <div className="absolute top-[35%] left-[30%] flex items-center gap-1 opacity-80">
              <div className="h-3 w-3 rounded-full bg-white border border-[#febe10] shadow-[0_0_8px_white]" />
              <span className="text-[10px] text-white/70 font-mono">Bellingham</span>
            </div>
            <div className="absolute top-[60%] left-[24%] flex items-center gap-1 opacity-80">
              <div className="h-3 w-3 rounded-full bg-white border border-[#febe10]" />
              <span className="text-[10px] text-white/70 font-mono">Vinícius Jr</span>
            </div>
            <div className="absolute top-[50%] left-[16%] flex items-center gap-1 opacity-80">
              <div className="h-3 w-3 rounded-full bg-white border border-[#febe10]" />
              <span className="text-[10px] text-white/70 font-mono">Valverde</span>
            </div>

            {/* Away Player Nodes (Sky Blue) */}
            <div className="absolute top-[40%] right-[32%] flex items-center gap-1 opacity-80">
              <div className="h-3 w-3 rounded-full bg-[#6cabdd] border border-white shadow-[0_0_8px_#6cabdd]" />
              <span className="text-[10px] text-sky-200 font-mono">De Bruyne</span>
            </div>
            <div className="absolute top-[55%] right-[22%] flex items-center gap-1 opacity-80">
              <div className="h-3 w-3 rounded-full bg-[#6cabdd] border border-white" />
              <span className="text-[10px] text-sky-200 font-mono">Haaland</span>
            </div>
            <div className="absolute top-[30%] right-[18%] flex items-center gap-1 opacity-80">
              <div className="h-3 w-3 rounded-full bg-[#6cabdd] border border-white" />
              <span className="text-[10px] text-sky-200 font-mono">Foden</span>
            </div>
          </div>

          {/* Floating Live Reaction Emojis */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {floatingReactions.map((r) => (
              <div
                key={r.id}
                style={{ left: `${r.x}%` }}
                className="absolute bottom-16 text-3xl animate-bounce transition-all duration-1000 opacity-90 drop-shadow-lg"
              >
                {r.emoji}
              </div>
            ))}
          </div>

          {/* Video Overlay Top Header: Official Scorebug */}
          <div className="relative z-10 p-4 sm:p-6 flex items-start justify-between">
            {/* High-Impact DAZN Scorebug */}
            <div className="flex items-center rounded-xl border border-white/10 bg-[#0d1017]/90 p-2 shadow-2xl backdrop-blur-md">
              {/* Home Team */}
              <div className="flex items-center gap-2.5 px-3">
                <TeamLogo logo={match.homeTeam.logo} name={match.homeTeam.name} className="h-7 w-7" />
                <div className="flex flex-col">
                  <span className="text-sm font-black text-white">{match.homeTeam.code}</span>
                  <span className="text-[10px] text-[#8b94a5] uppercase truncate max-w-[80px]">{match.homeTeam.name}</span>
                </div>
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={`home-${match.score.home}`}
                    initial={{ y: -8, scale: 1.25, color: '#00ff88' }}
                    animate={{ y: 0, scale: 1, color: '#ffffff' }}
                    exit={{ y: 8, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    className="text-2xl font-black font-mono px-2 inline-block"
                  >
                    {match.score.home}
                  </motion.span>
                </AnimatePresence>
              </div>

              {/* Minute & Status Divider */}
              <div className="flex flex-col items-center justify-center border-x border-white/10 px-3 min-w-[72px]">
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff3355] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff3355]" />
                  </span>
                  <motion.span
                    key={match.minute}
                    initial={{ opacity: 0.7, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.25 }}
                    className="text-sm font-black text-[#00ff88] font-mono tracking-tight"
                  >
                    {match.minute || 'LIVE'}
                  </motion.span>
                </div>
                <span className="text-[9px] font-bold text-[#ff3355] tracking-wider uppercase font-mono mt-0.5">
                  {match.status === 'LIVE' ? 'LIVE SYNC' : match.status}
                </span>
              </div>

              {/* Away Team */}
              <div className="flex items-center gap-2.5 px-3">
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={`away-${match.score.away}`}
                    initial={{ y: -8, scale: 1.25, color: '#00ff88' }}
                    animate={{ y: 0, scale: 1, color: '#ffffff' }}
                    exit={{ y: 8, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    className="text-2xl font-black font-mono px-2 inline-block"
                  >
                    {match.score.away}
                  </motion.span>
                </AnimatePresence>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-black text-white">{match.awayTeam.code}</span>
                  <span className="text-[10px] text-[#8b94a5] uppercase truncate max-w-[80px]">{match.awayTeam.name}</span>
                </div>
                <TeamLogo logo={match.awayTeam.logo} name={match.awayTeam.name} className="h-7 w-7" />
              </div>
            </div>

            {/* Top Right Quick Badges */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAngleMenu(!showAngleMenu)}
                className="relative flex items-center gap-1.5 rounded-lg border border-white/15 bg-black/60 px-2.5 py-1.5 text-xs font-semibold text-white backdrop-blur-md hover:border-[#00ff88] transition-all"
              >
                <Camera className="h-3.5 w-3.5 text-[#00ff88]" />
                <span className="hidden sm:inline">{selectedAngle}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowMatchDrawer(!showMatchDrawer)}
                className="flex items-center gap-1.5 rounded-lg border border-[#00ff88]/40 bg-[#00ff88]/10 px-3 py-1.5 text-xs font-bold text-[#00ff88] backdrop-blur-md hover:bg-[#00ff88]/20 transition-all"
              >
                <Activity className="h-3.5 w-3.5" />
                <span>{showMatchDrawer ? 'Hide Intel' : 'Match Center'}</span>
              </motion.button>
            </div>
          </div>

          {/* Camera Angles Selection Modal / Popover with Framer Motion AnimatePresence */}
          <AnimatePresence>
            {showAngleMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute top-16 right-6 z-30 w-72 rounded-xl border border-[#2b3347] bg-[#141824]/95 p-2 shadow-2xl backdrop-blur-xl"
              >
                <div className="px-2 py-1 text-xs font-bold uppercase text-[#8b94a5]">
                  Switch Camera Angle (4K Live)
                </div>
                <div className="mt-1 space-y-1">
                  {match.cameraAngles?.map((angle) => (
                    <motion.button
                      key={angle.name}
                      whileHover={{ scale: 1.02, x: 2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedAngle(angle.name);
                        setShowAngleMenu(false);
                      }}
                      className={`flex w-full flex-col rounded-lg p-2 text-left transition-colors ${
                        selectedAngle === angle.name
                          ? 'bg-[#00ff88]/20 border border-[#00ff88]/50 text-white'
                          : 'hover:bg-[#1f2638] text-[#c0c7d5]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span>{angle.name}</span>
                        {selectedAngle === angle.name && (
                          <span className="text-[10px] text-[#00ff88] font-mono">ACTIVE</span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#8b94a5]">{angle.description}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Middle Watermark Branding */}
          <div className="relative z-10 flex flex-col items-center justify-center py-10 pointer-events-none">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-1.5 backdrop-blur-md">
              <Radio className="h-4 w-4 text-[#00ff88] animate-pulse" />
              <span className="text-xs font-bold tracking-wider text-white">
                BROADCAST FEED: {selectedAngle.toUpperCase()}
              </span>
              <span className="text-xs text-[#00ff88]">• {selectedCommentary}</span>
            </div>
          </div>

          {/* Bottom Player Controls Container */}
          <div className="relative z-20 border-t border-white/10 bg-gradient-to-t from-black via-black/80 to-transparent p-4 sm:p-5">
            {/* Timeline Scrub Bar with Goals & Events Markers */}
            <div className="mb-3">
              <div className="relative h-2 w-full rounded-full bg-white/20 cursor-pointer group">
                {/* Buffer & Progress Fill */}
                <div className="absolute inset-y-0 left-0 w-[82%] rounded-full bg-gradient-to-r from-[#00ff88]/80 to-[#00ff88] shadow-[0_0_8px_rgba(0,255,136,0.5)]" />

                {/* Event Markers on Timeline (Goals / Cards) */}
                {match.events?.map((ev) => {
                  const percent = Math.min((ev.minute / 90) * 100, 100);
                  const isGoal = ev.type === 'goal';
                  return (
                    <div
                      key={ev.id}
                      style={{ left: `${percent}%` }}
                      className="absolute -top-1.5 -translate-x-1/2 flex flex-col items-center group/marker cursor-pointer"
                    >
                      <div
                        className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] shadow-lg border ${
                          isGoal
                            ? 'bg-[#00ff88] text-black border-white'
                            : 'bg-yellow-400 text-black border-black'
                        }`}
                      >
                        {isGoal ? '⚽' : '🟨'}
                      </div>
                      {/* Tooltip */}
                      <div className="absolute bottom-6 hidden group-hover/marker:flex flex-col items-center rounded-lg bg-[#141824] border border-[#2b3347] px-2.5 py-1 text-[11px] text-white whitespace-nowrap z-40 shadow-xl">
                        <span className="font-bold text-[#00ff88]">
                          {ev.minute}&apos; {ev.player}
                        </span>
                        <span className="text-[10px] text-[#8b94a5]">{ev.detail}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Controls Row */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Playback Controls */}
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00ff88] text-black hover:bg-[#1aff9b] shadow-[0_0_15px_rgba(0,255,136,0.4)] transition-all"
                  title={isPlaying ? 'Pause Stream' : 'Play Stream'}
                >
                  {isPlaying ? <Pause className="h-5 w-5 fill-black" /> : <Play className="h-5 w-5 fill-black ml-0.5" />}
                </button>

                <button
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                  title="Rewind 10 seconds"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>

                <button
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                  title="Forward 10 seconds"
                >
                  <RotateCw className="h-4 w-4" />
                </button>

                {/* Volume Slider */}
                <div className="flex items-center gap-2 pl-2">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="h-5 w-5 text-[#ff3355]" />
                    ) : (
                      <Volume2 className="h-5 w-5 text-[#00ff88]" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      setVolume(parseFloat(e.target.value));
                      setIsMuted(false);
                    }}
                    className="w-16 sm:w-20 accent-[#00ff88] cursor-pointer"
                  />
                </div>

                {/* Live DVR Status */}
                <div className="flex items-center gap-1.5 pl-2 border-l border-white/10">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff3355] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff3355]"></span>
                  </span>
                  <span className="text-xs font-black tracking-wider text-white">DVR LIVE</span>
                </div>
              </div>

              {/* Right Player Actions */}
              <div className="flex items-center gap-2">
                {/* Floating Reaction Triggers */}
                <div className="hidden sm:flex items-center gap-1 border-r border-white/10 pr-2">
                  {['🔥', '⚽', '🐐', '🧤'].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => triggerReaction(emoji)}
                      className="rounded-lg bg-white/5 hover:bg-white/15 px-2 py-1 text-sm transition-transform active:scale-125"
                      title={`React with ${emoji}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                {/* Commentary Button */}
                <div className="relative">
                  <button
                    onClick={() => setShowCommentaryMenu(!showCommentaryMenu)}
                    className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-white/90 hover:border-[#00ff88]"
                    title="Audio Commentary"
                  >
                    <Volume1 className="h-3.5 w-3.5 text-[#00ff88]" />
                    <span className="hidden md:inline">{selectedCommentary.split(' ')[0]}</span>
                  </button>
                  {showCommentaryMenu && (
                    <div className="absolute bottom-11 right-0 w-60 rounded-xl border border-[#2b3347] bg-[#141824] p-1.5 shadow-2xl z-40">
                      <div className="px-2 py-1 text-[11px] font-bold text-[#8b94a5] uppercase">
                        Select Audio Commentary
                      </div>
                      {match.commentaryTracks?.map((track) => (
                        <button
                          key={track.language}
                          onClick={() => {
                            setSelectedCommentary(track.language);
                            setShowCommentaryMenu(false);
                          }}
                          className={`flex w-full items-center justify-between rounded-lg p-2 text-xs text-left ${
                            selectedCommentary === track.language
                              ? 'bg-[#00ff88]/20 text-[#00ff88] font-bold'
                              : 'text-white/80 hover:bg-white/10'
                          }`}
                        >
                          <div>
                            <div>{track.language}</div>
                            <div className="text-[10px] text-[#8b94a5]">{track.commentator}</div>
                          </div>
                          {selectedCommentary === track.language && <Check className="h-3.5 w-3.5" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quality Switcher */}
                <div className="relative">
                  <button
                    onClick={() => setShowQualityMenu(!showQualityMenu)}
                    className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-mono font-bold text-[#00ff88] hover:border-[#00ff88]"
                    title="Stream Quality"
                  >
                    <Settings2 className="h-3.5 w-3.5" />
                    <span>{selectedQuality}</span>
                  </button>
                  {showQualityMenu && (
                    <div className="absolute bottom-11 right-0 w-44 rounded-xl border border-[#2b3347] bg-[#141824] p-1.5 shadow-2xl z-40">
                      <div className="px-2 py-1 text-[11px] font-bold text-[#8b94a5] uppercase">
                        Stream Quality
                      </div>
                      {['4K HDR (60fps)', '1080p60 Full HD', '720p60 HD', 'Data Saver (480p)'].map(
                        (q) => (
                          <button
                            key={q}
                            onClick={() => {
                              setSelectedQuality(q);
                              setShowQualityMenu(false);
                            }}
                            className={`flex w-full items-center justify-between rounded-lg p-2 text-xs font-medium text-left ${
                              selectedQuality === q
                                ? 'bg-[#00ff88]/20 text-[#00ff88] font-bold'
                                : 'text-white/80 hover:bg-white/10'
                            }`}
                          >
                            <span>{q}</span>
                            {selectedQuality === q && <Check className="h-3.5 w-3.5" />}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>

                {/* Fullscreen Button */}
                <button
                  onClick={toggleFullscreen}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                  title="Toggle Fullscreen"
                >
                  {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Interactive Match Center Drawer */}
        {showMatchDrawer && (
          <div className="lg:col-span-4 xl:col-span-4 flex flex-col border-t lg:border-t-0 lg:border-l border-[#1f2434] bg-[#11141e]">
            {/* Tabs Selector with Framer Motion Sliding Pill */}
            <div className="flex items-center border-b border-[#1f2434] bg-[#0e111a] p-1.5 gap-1">
              {[
                { id: 'stats', label: 'Live Stats', icon: Activity },
                { id: 'lineups', label: 'Tactics & Pitch', icon: Users },
                { id: 'events', label: 'Timeline', icon: Layers },
                { id: 'chat', label: 'Fan Live Chat', icon: MessageSquare },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`relative flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-all ${
                      isActive ? 'text-[#00ff88]' : 'text-[#8b94a5] hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="matchCenterActiveTab"
                        className="absolute inset-0 rounded-lg bg-[#18202e] border border-[#00ff88]/30 shadow-[0_0_10px_rgba(0,255,136,0.18)]"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">
                      <Icon className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Tab 1: Live Match Stats */}
            {activeTab === 'stats' && (
              <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[460px] custom-scrollbar">
                <div className="flex items-center justify-between text-xs font-bold text-[#8b94a5] uppercase">
                  <span className="text-white flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-[#00ff88]" />
                    {match.homeTeam.shortName}
                  </span>
                  <span className="text-[#00ff88] font-mono text-[11px] flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#00ff88] animate-ping" />
                    1-SEC LIVE TELEMETRY
                  </span>
                  <span className="text-white flex items-center gap-1">
                    {match.awayTeam.shortName}
                    <span className="h-2 w-2 rounded-full bg-[#38bdf8]" />
                  </span>
                </div>

                {/* Possession Bar with Framer Motion Spring */}
                <div className="space-y-1.5 rounded-xl border border-[#232a3b] bg-[#141824] p-3">
                  <div className="flex justify-between text-xs font-bold">
                    <motion.span
                      key={match.stats.possession[0]}
                      initial={{ scale: 1.15, color: '#00ff88' }}
                      animate={{ scale: 1, color: '#ffffff' }}
                      className="text-white font-mono"
                    >
                      {match.stats.possession[0]}%
                    </motion.span>
                    <span className="text-[#8b94a5] uppercase font-semibold text-[11px] tracking-wider">
                      Live Possession
                    </span>
                    <motion.span
                      key={match.stats.possession[1]}
                      initial={{ scale: 1.15, color: '#38bdf8' }}
                      animate={{ scale: 1, color: '#ffffff' }}
                      className="text-white font-mono"
                    >
                      {match.stats.possession[1]}%
                    </motion.span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-[#1e2434] overflow-hidden flex">
                    <motion.div
                      animate={{ width: `${match.stats.possession[0]}%` }}
                      transition={{ type: 'spring', stiffness: 80, damping: 18 }}
                      className="bg-gradient-to-r from-[#00cc6a] to-[#00ff88] h-full shadow-[0_0_12px_rgba(0,255,136,0.6)]"
                    />
                    <motion.div
                      animate={{ width: `${match.stats.possession[1]}%` }}
                      transition={{ type: 'spring', stiffness: 80, damping: 18 }}
                      className="bg-gradient-to-r from-[#38bdf8] to-[#0284c7] h-full"
                    />
                  </div>
                </div>

                {/* Dynamic Live Attack Momentum Wave (Last 10 Min Pressure) */}
                <div className="rounded-xl border border-[#232a3b] bg-[#141824] p-3 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#8b94a5] uppercase">
                    <span>Attack Momentum</span>
                    <span className="text-[#00ff88] font-mono">Live Pitch Pressure</span>
                  </div>
                  <div className="flex items-end justify-between gap-1.5 h-14 pt-2 border-b border-[#232a3b]">
                    {(match.momentum || [35, 45, 55, 20, 60, 40, 75, -20, 80, 65]).map((val, idx) => {
                      const isHome = val >= 0;
                      const heightPercent = Math.min(Math.abs(val), 100);
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full">
                          <motion.div
                            layout
                            initial={{ height: 0 }}
                            animate={{ height: `${Math.max(15, heightPercent)}%` }}
                            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                            className={`w-full rounded-t-sm ${
                              isHome
                                ? 'bg-gradient-to-t from-[#00ff88]/40 to-[#00ff88] shadow-[0_0_8px_rgba(0,255,136,0.4)]'
                                : 'bg-gradient-to-t from-sky-500/40 to-sky-400'
                            }`}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-[9px] font-mono text-[#606a7e]">
                    <span>-10 Min</span>
                    <span>-5 Min</span>
                    <span className="text-[#00ff88]">Now</span>
                  </div>
                </div>

                {/* Expected Goals (xG) with Spring Animation */}
                <div className="rounded-xl border border-[#232a3b] bg-[#141824] p-3">
                  <div className="flex justify-between items-center mb-1 text-xs">
                    <span className="font-mono font-bold text-[#00ff88] text-sm">{match.stats.xG[0]}</span>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#8b94a5]">
                      Expected Goals (xG)
                    </span>
                    <span className="font-mono font-bold text-sky-400 text-sm">{match.stats.xG[1]}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[#1c2233] flex overflow-hidden">
                    <motion.div
                      animate={{
                        width: `${(match.stats.xG[0] / (match.stats.xG[0] + match.stats.xG[1] || 1)) * 100}%`,
                      }}
                      transition={{ type: 'spring', stiffness: 70, damping: 15 }}
                      className="bg-[#00ff88] h-full"
                    />
                    <motion.div
                      animate={{
                        width: `${(match.stats.xG[1] / (match.stats.xG[0] + match.stats.xG[1] || 1)) * 100}%`,
                      }}
                      transition={{ type: 'spring', stiffness: 70, damping: 15 }}
                      className="bg-sky-400 h-full"
                    />
                  </div>
                </div>

                {/* Comparative Live Stat Rows with Animated Dual-Sided Bars */}
                <div className="space-y-3 pt-1">
                  {[
                    { label: 'Total Shots', home: match.stats.shots[0], away: match.stats.shots[1] },
                    { label: 'Shots on Target', home: match.stats.shotsOnTarget[0], away: match.stats.shotsOnTarget[1] },
                    { label: 'Total Passes', home: match.stats.passes[0], away: match.stats.passes[1] },
                    { label: 'Pass Accuracy', home: `${match.stats.passAccuracy[0]}%`, away: `${match.stats.passAccuracy[1]}%`, homeVal: match.stats.passAccuracy[0], awayVal: match.stats.passAccuracy[1] },
                    { label: 'Corner Kicks', home: match.stats.corners[0], away: match.stats.corners[1] },
                    { label: 'Fouls Committed', home: match.stats.fouls[0], away: match.stats.fouls[1] },
                    { label: 'Yellow Cards', home: match.stats.yellowCards[0], away: match.stats.yellowCards[1] },
                  ].map((stat, idx) => {
                    const hVal = typeof stat.home === 'number' ? stat.home : (stat as any).homeVal || 50;
                    const aVal = typeof stat.away === 'number' ? stat.away : (stat as any).awayVal || 50;
                    const total = hVal + aVal || 1;
                    const hPct = (hVal / total) * 100;

                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono font-bold text-white min-w-[32px]">{stat.home}</span>
                          <span className="text-[#8b94a5] font-semibold text-[11px]">{stat.label}</span>
                          <span className="font-mono font-bold text-white min-w-[32px] text-right">{stat.away}</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-[#1c2233] flex overflow-hidden gap-1">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${hPct}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            className="bg-[#00ff88] h-full rounded-full"
                          />
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${100 - hPct}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            className="bg-sky-400 h-full rounded-full ml-auto"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Betting Odds */}
                {match.odds && (
                  <div className="rounded-xl border border-[#2b3347] bg-[#141824] p-3 text-center">
                    <div className="text-[11px] font-bold text-[#8b94a5] uppercase mb-2">
                      Live Win Probability & Odds
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <motion.div whileHover={{ scale: 1.05 }} className="rounded-lg bg-[#1c2233] p-1.5 border border-white/5 hover:border-[#00ff88]/30 transition-all">
                        <div className="text-[10px] text-[#8b94a5]">{match.homeTeam.shortName}</div>
                        <div className="text-xs font-mono font-black text-[#00ff88]">{match.odds.home}</div>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} className="rounded-lg bg-[#1c2233] p-1.5 border border-white/5 hover:border-white/20 transition-all">
                        <div className="text-[10px] text-[#8b94a5]">Draw</div>
                        <div className="text-xs font-mono font-black text-white">{match.odds.draw}</div>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} className="rounded-lg bg-[#1c2233] p-1.5 border border-white/5 hover:border-sky-400/30 transition-all">
                        <div className="text-[10px] text-[#8b94a5]">{match.awayTeam.shortName}</div>
                        <div className="text-xs font-mono font-black text-sky-400">{match.odds.away}</div>
                      </motion.div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Tactics & Lineups */}
            {activeTab === 'lineups' && (
              <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[460px] custom-scrollbar">
                {match.lineup ? (
                  <>
                    <div className="flex items-center justify-between text-xs font-bold">
                      <div className="flex items-center gap-1.5">
                        <TeamLogo logo={match.homeTeam.logo} name={match.homeTeam.name} className="h-4 w-4" />
                        <span className="text-white font-mono">{match.lineup.home?.formation || '4-3-3'}</span>
                      </div>
                      <span className="text-[10px] text-[#00ff88] uppercase tracking-wider font-mono">
                        TACTICAL SETUP
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-white font-mono">{match.lineup.away?.formation || '4-2-3-1'}</span>
                        <TeamLogo logo={match.awayTeam.logo} name={match.awayTeam.name} className="h-4 w-4" />
                      </div>
                    </div>

                    {/* Pitch Graphic Preview with Framer Motion interactive player nodes */}
                    <div className="relative rounded-xl border border-[#232a3b] bg-gradient-to-b from-[#0a1a12] via-[#0b1f15] to-[#0a1a12] p-4 text-center overflow-hidden">
                      <div className="absolute inset-x-4 inset-y-4 border border-white/20 rounded-lg">
                        <div className="absolute inset-y-0 left-1/2 w-[1px] bg-white/20" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16 rounded-full border border-white/20" />
                      </div>

                      <div className="relative z-10 grid grid-cols-2 gap-4 text-left py-2">
                        <div>
                          <div className="text-[11px] font-bold text-[#00ff88] mb-1.5 flex items-center gap-1">
                            <span>{match.homeTeam.name}</span>
                            <span className="text-[9px] px-1 py-0.2 bg-[#00ff88]/20 rounded text-[#00ff88]">HOME</span>
                          </div>
                          <div className="space-y-1.5">
                            {(match.lineup.home?.startingXI || []).map((p) => (
                              <motion.div
                                key={p.name}
                                whileHover={{ x: 3, scale: 1.02 }}
                                className="flex items-center justify-between text-[11px] text-[#c0c7d5] p-1 rounded bg-[#0d1410] border border-[#16271c]"
                              >
                                <span className="flex items-center gap-1.5">
                                  <span className="h-4 w-4 rounded-full bg-[#00ff88]/20 text-[#00ff88] text-[9px] font-mono font-bold flex items-center justify-center">
                                    {p.number}
                                  </span>
                                  <span>{p.name}</span>
                                  <span className="text-[9px] text-[#8b94a5]">({p.position})</span>
                                </span>
                                {p.rating && (
                                  <span className="text-[10px] font-mono text-[#00ff88] font-bold bg-[#00ff88]/10 px-1 rounded">
                                    {p.rating}
                                  </span>
                                )}
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="text-[11px] font-bold text-sky-400 mb-1.5 flex items-center gap-1">
                            <span>{match.awayTeam.name}</span>
                            <span className="text-[9px] px-1 py-0.2 bg-sky-400/20 rounded text-sky-400">AWAY</span>
                          </div>
                          <div className="space-y-1.5">
                            {(match.lineup.away?.startingXI || []).map((p) => (
                              <motion.div
                                key={p.name}
                                whileHover={{ x: 3, scale: 1.02 }}
                                className="flex items-center justify-between text-[11px] text-[#c0c7d5] p-1 rounded bg-[#0b131a] border border-[#162430]"
                              >
                                <span className="flex items-center gap-1.5">
                                  <span className="h-4 w-4 rounded-full bg-sky-400/20 text-sky-400 text-[9px] font-mono font-bold flex items-center justify-center">
                                    {p.number}
                                  </span>
                                  <span>{p.name}</span>
                                  <span className="text-[9px] text-[#8b94a5]">({p.position})</span>
                                </span>
                                {p.rating && (
                                  <span className="text-[10px] font-mono text-sky-400 font-bold bg-sky-400/10 px-1 rounded">
                                    {p.rating}
                                  </span>
                                )}
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-8 text-center text-xs text-[#8b94a5] font-mono">
                    Tactical lineups confirmed 60 minutes before kickoff.
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Timeline & Match Events with Framer Motion Bounce */}
            {activeTab === 'events' && (
              <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[460px] custom-scrollbar">
                <div className="text-xs font-bold text-[#8b94a5] uppercase flex items-center justify-between">
                  <span>Match Event Log</span>
                  <span className="text-[#00ff88] font-mono text-[10px]">ALL KEY MOMENTS</span>
                </div>
                <div className="space-y-2.5">
                  <AnimatePresence>
                    {match.events?.map((ev, idx) => (
                      <motion.div
                        key={ev.id || idx}
                        initial={{ opacity: 0, x: -15, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        whileHover={{ scale: 1.02, x: 3 }}
                        className="flex items-start gap-3 rounded-xl border border-[#1f2638] bg-[#141824] p-2.5 shadow-md"
                      >
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#1c2233] text-sm border border-white/5">
                          {ev.type === 'goal' ? '⚽' : ev.type === 'yellow_card' ? '🟨' : ev.type === 'red_card' ? '🟥' : '🔄'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white">
                              {ev.player} ({ev.team === 'home' ? match.homeTeam.code : match.awayTeam.code})
                            </span>
                            <span className="text-[11px] font-mono font-black text-[#00ff88] bg-[#00ff88]/10 px-1.5 py-0.5 rounded">
                              {ev.minute}&apos;
                            </span>
                          </div>
                          {ev.detail && (
                            <div className="text-[11px] text-[#8b94a5] mt-0.5">{ev.detail}</div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Tab 4: Fan Live Chat with Animated Messages */}
            {activeTab === 'chat' && (
              <div className="flex-1 flex flex-col justify-between p-3 h-[460px]">
                <div className="space-y-2 overflow-y-auto pr-1 custom-scrollbar">
                  <AnimatePresence>
                    {chatMessages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className="rounded-lg bg-[#141824] p-2 border border-[#1f2638]"
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-[#00ff88]">{msg.user}</span>
                          <span className="text-[10px] text-[#647188] font-mono">{msg.time}</span>
                        </div>
                        <p className="text-xs text-[#f3f4f6] mt-0.5 leading-snug">{msg.text}</p>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <form onSubmit={handleSendChat} className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={newChatMessage}
                    onChange={(e) => setNewChatMessage(e.target.value)}
                    placeholder="Join 2.4M football fans in chat..."
                    className="flex-1 rounded-lg border border-[#232838] bg-[#141722] px-3 py-1.5 text-xs text-white placeholder-[#606a7e] outline-none focus:border-[#00ff88] focus:shadow-[0_0_10px_rgba(0,255,136,0.15)] transition-all"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="rounded-lg bg-[#00ff88] px-3.5 py-1.5 text-xs font-black text-black hover:bg-[#15ff95] shadow-[0_0_10px_rgba(0,255,136,0.3)]"
                  >
                    Send
                  </motion.button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
