'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Trophy,
  Calendar,
  MapPin,
  Users,
  Tv,
  ArrowRight,
  Sparkles,
  Flame,
  Radio,
  Clock,
  Compass,
  Play,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Shield,
  Ticket,
  Volume2,
} from 'lucide-react';
import { PageLoadCurtain } from '../../components/splash/PageLoadCurtain';
import { ParticleBurstContainer } from '../../components/worldcup/ParticleBurst';
import { TiltCard } from '../../components/worldcup/TiltCard';

// Venues dataset
const HOST_VENUES = [
  {
    id: 'metlife',
    name: 'MetLife Stadium',
    city: 'New York / New Jersey',
    country: 'USA',
    flag: '🇺🇸',
    capacity: '82,500',
    role: 'Grand Final Host Stadium',
    matches: '8 Matches (Including Final on July 19)',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
    highlight: 'FINAL VENUE',
  },
  {
    id: 'azteca',
    name: 'Estadio Azteca',
    city: 'Mexico City',
    country: 'Mexico',
    flag: '🇲🇽',
    capacity: '87,523',
    role: 'Opening Match Host',
    matches: '5 Matches (Historic 3rd World Cup Opener)',
    image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=800&q=80',
    highlight: 'OPENING MATCH',
  },
  {
    id: 'sofi',
    name: 'SoFi Stadium',
    city: 'Los Angeles, California',
    country: 'USA',
    flag: '🇺🇸',
    capacity: '70,240',
    role: 'Quarter-Final Host',
    matches: '8 Matches (USA Group Stage Opener)',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
    highlight: 'USA OPENER',
  },
  {
    id: 'att',
    name: 'AT&T Stadium',
    city: 'Dallas, Texas',
    country: 'USA',
    flag: '🇺🇸',
    capacity: '92,000',
    role: 'Semi-Final Host',
    matches: '9 Matches (Semi-Final & Round of 16)',
    image: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=800&q=80',
    highlight: 'SEMI-FINAL',
  },
  {
    id: 'hardrock',
    name: 'Hard Rock Stadium',
    city: 'Miami, Florida',
    country: 'USA',
    flag: '🇺🇸',
    capacity: '64,767',
    role: 'Bronze Final Host',
    matches: '7 Matches (Bronze Medal Match)',
    image: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=800&q=80',
    highlight: 'BRONZE FINAL',
  },
  {
    id: 'bcplace',
    name: 'BC Place',
    city: 'Vancouver, BC',
    country: 'Canada',
    flag: '🇨🇦',
    capacity: '54,500',
    role: 'Round of 16 Host',
    matches: '7 Matches (Canada Group Matches)',
    image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=800&q=80',
    highlight: 'CANADA HUB',
  },
];

// Groups dataset
const GROUPS_DATA = [
  {
    group: 'Group A',
    host: 'Mexico City',
    teams: [
      { name: 'Mexico', flag: '🇲🇽', seed: 'Host (Pot 1)', star: 'Santiago Giménez' },
      { name: 'Germany', flag: '🇩🇪', seed: 'Pot 2', star: 'Florian Wirtz' },
      { name: 'Japan', flag: '🇯🇵', seed: 'Pot 3', star: 'Takefusa Kubo' },
      { name: 'Egypt', flag: '🇪🇬', seed: 'Pot 4', star: 'Mohamed Salah' },
    ],
  },
  {
    group: 'Group B',
    host: 'Los Angeles / Seattle',
    teams: [
      { name: 'United States', flag: '🇺🇸', seed: 'Host (Pot 1)', star: 'Christian Pulisic' },
      { name: 'Netherlands', flag: '🇳🇱', seed: 'Pot 2', star: 'Virgil van Dijk' },
      { name: 'Senegal', flag: '🇸🇳', seed: 'Pot 3', star: 'Sadio Mané' },
      { name: 'Ukraine', flag: '🇺🇦', seed: 'Pot 4', star: 'Mykhailo Mudryk' },
    ],
  },
  {
    group: 'Group C',
    host: 'Vancouver / Toronto',
    teams: [
      { name: 'Canada', flag: '🇨🇦', seed: 'Host (Pot 1)', star: 'Alphonso Davies' },
      { name: 'France', flag: '🇫🇷', seed: 'Pot 2', star: 'Kylian Mbappé' },
      { name: 'Morocco', flag: '🇲🇦', seed: 'Pot 3', star: 'Achraf Hakimi' },
      { name: 'Chile', flag: '🇨🇱', seed: 'Pot 4', star: 'Alexis Sánchez' },
    ],
  },
  {
    group: 'Group D',
    host: 'Miami / Atlanta',
    teams: [
      { name: 'Argentina', flag: '🇦🇷', seed: 'Defending Champ', star: 'Lionel Messi' },
      { name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', seed: 'Pot 2', star: 'Jude Bellingham' },
      { name: 'Colombia', flag: '🇨🇴', seed: 'Pot 3', star: 'Luis Díaz' },
      { name: 'Australia', flag: '🇦🇺', seed: 'Pot 4', star: 'Nestory Irankunda' },
    ],
  },
];

export default function WorldCup2026LandingPage() {
  const [replayCount, setReplayCount] = useState(0);
  const [selectedCountryFilter, setSelectedCountryFilter] = useState('ALL');
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);
  const [ticketToast, setTicketToast] = useState<string | null>(null);

  const filteredVenues = HOST_VENUES.filter((v) => {
    if (selectedCountryFilter === 'ALL') return true;
    return v.country === selectedCountryFilter;
  });

  const handleTicketSelect = (tier: string) => {
    setTicketToast(`Selected ${tier}! Connecting to official FIFA ticketing gateway.`);
    setTimeout(() => setTicketToast(null), 3500);
  };

  return (
    <div className="min-h-screen bg-[#F7F9FB] text-[#0A1128] font-sans selection:bg-[#0055FF] selection:text-white daylight-pitch-bg relative overflow-x-hidden">
      {/* 1) PAGE-LOAD CURTAIN (splash) */}
      <PageLoadCurtain replayTrigger={replayCount} />

      {/* Particle Burst System on Click */}
      <ParticleBurstContainer />

      {/* Daylight Faint Pitch Background Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Soccer center circle */}
          <circle cx="50%" cy="40%" r="220" fill="none" stroke="#0055FF" strokeWidth="1" strokeDasharray="6 6" />
          <line x1="0" y1="40%" x2="100%" y2="40%" stroke="#0055FF" strokeWidth="1" strokeDasharray="6 6" />
          <circle cx="50%" cy="40%" r="12" fill="#0055FF" fillOpacity="0.1" />
        </svg>
      </div>

      {/* Floating Action Button: Replay Opening Animation */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
        <button
          onClick={() => setReplayCount((c) => c + 1)}
          className="flex items-center gap-2 rounded-full border border-blue-200 bg-white/90 px-4 py-2.5 text-xs font-bold text-[#0055FF] shadow-xl backdrop-blur-md hover:bg-blue-50 hover:scale-105 active:scale-95 transition-all"
          title="Re-play the full opening splash curtain animation"
        >
          <RotateCcw className="h-4 w-4 text-[#FF3D00]" />
          <span>Replay Splash Curtain</span>
        </button>
      </div>

      {/* Top Daylight Stadium Header */}
      <header className="sticky top-0 z-30 w-full border-b border-blue-100 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo & World Cup 2026 Tag */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-[#0055FF] to-[#0088FF] text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black uppercase tracking-tight text-[#0055FF] font-sans">
                  FOOTY<span className="text-[#0A1128]">LIVE</span>
                </span>
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#FF3D00] -mt-1">
                  WORLD CUP 2026
                </span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-1.5 rounded-full border border-blue-200/60 bg-blue-50/70 px-3 py-1 text-xs font-semibold text-[#0055FF]">
              <span>🇺🇸 USA</span>
              <span>•</span>
              <span>🇨🇦 CAN</span>
              <span>•</span>
              <span>🇲🇽 MEX</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-bold uppercase tracking-wider text-[#0A1128]/80">
            <a href="#venues" className="hover:text-[#0055FF] transition-colors">Host Cities</a>
            <a href="#groups" className="hover:text-[#0055FF] transition-colors">12 Groups</a>
            <a href="#matchups" className="hover:text-[#0055FF] transition-colors">Blockbusters</a>
            <a href="#tickets" className="hover:text-[#0055FF] transition-colors">Passes</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-xl bg-[#0055FF] px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/25 hover:bg-[#0047db] hover:shadow-xl transition-all"
            >
              <Radio className="h-4 w-4 animate-pulse text-[#FF3D00]" />
              <span className="hidden sm:inline">Launch Dark Stream Hub 4K</span>
              <span className="sm:hidden">4K Hub</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Ticket Selection Toast Notification */}
      {ticketToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-2xl border border-blue-200 bg-white px-5 py-3 shadow-2xl animate-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="h-5 w-5 text-[#0055FF]" />
          <span className="text-xs font-bold text-[#0A1128]">{ticketToast}</span>
        </div>
      )}

      {/* Main Single-Page Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-24">
        {/* HERO SECTION ("Daylight Stadium Opener") */}
        <section className="relative text-center space-y-8 pt-4">
          {/* Eyebrow Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/90 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-[#0055FF] shadow-sm backdrop-blur-md"
          >
            <Sparkles className="h-4 w-4 text-[#FF3D00]" />
            <span>OFFICIAL TOURNAMENT PREVIEW • JUNE 11 – JULY 19, 2026</span>
          </motion.div>

          {/* Massive Display Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="space-y-4 max-w-5xl mx-auto"
          >
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-[#0A1128] font-sans leading-[1.05]">
              THE GREATEST STAGE <br />
              <span className="text-[#0055FF] relative inline-block">
                ON EARTH
                <span className="absolute -bottom-2 left-0 right-0 h-2 bg-[#FF3D00] rounded-full opacity-80" />
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#475467] font-medium leading-relaxed">
              48 Nations. 16 World-Class Venues. 104 Historic Matches. Experience the largest sports spectacle in human history with daylight broadcast clarity and 4K multi-cam radar on FOOTYLive.
            </p>
          </motion.div>

          {/* Tournament Champions Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <div className="rounded-3xl border border-white/80 bg-white/80 p-5 sm:p-6 shadow-xl shadow-blue-900/5 backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Trophy className="h-3.5 w-3.5 text-[#FF3D00]" />
                  TOURNAMENT CONCLUDED • CHAMPIONS CROWNED
                </span>
                <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-black uppercase text-[#0055FF]">
                  JULY 19, 2026
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-2xl bg-yellow-50/80 p-4 border border-yellow-200 shadow-sm">
                  <span className="text-2xl">🥇</span>
                  <div className="font-mono text-[10px] font-black uppercase text-amber-600 mt-1">CHAMPION</div>
                  <div className="text-base sm:text-xl font-black text-[#0A1128] mt-0.5">🇦🇷 Argentina</div>
                  <div className="text-[10px] text-slate-500 mt-1">1 - 0 vs Colombia</div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 shadow-sm">
                  <span className="text-2xl">🥈</span>
                  <div className="font-mono text-[10px] font-black uppercase text-slate-500 mt-1">RUNNER-UP</div>
                  <div className="text-base sm:text-xl font-black text-[#0A1128] mt-0.5">🇨🇴 Colombia</div>
                  <div className="text-[10px] text-slate-500 mt-1">Silver Medal</div>
                </div>

                <div className="rounded-2xl bg-orange-50/70 p-4 border border-orange-200 shadow-sm">
                  <span className="text-2xl">🥉</span>
                  <div className="font-mono text-[10px] font-black uppercase text-orange-600 mt-1">3RD PLACE</div>
                  <div className="text-base sm:text-xl font-black text-[#0A1128] mt-0.5">🇫🇷 France</div>
                  <div className="text-[10px] text-slate-500 mt-1">Bronze Medal</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Bar (3D Tilt Cards) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-4">
            {[
              { label: 'Participating Nations', value: '48', sub: 'Expanded 12 Groups' },
              { label: 'Host Stadiums', value: '16', sub: 'USA • CAN • MEX' },
              { label: 'Total Matches', value: '104', sub: '39 Days of Action' },
              { label: 'Expected Stadium Fans', value: '6.5M', sub: 'All-Time Attendance Record' },
            ].map((stat, idx) => (
              <TiltCard key={idx} className="p-4 sm:p-5 text-center">
                <span className="font-mono text-2xl sm:text-3xl font-black text-[#0055FF] block">
                  {stat.value}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-[#0A1128] block mt-1">
                  {stat.label}
                </span>
                <span className="font-mono text-[10px] text-slate-500 block mt-0.5">
                  {stat.sub}
                </span>
              </TiltCard>
            ))}
          </div>

          {/* Quick CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href="#venues"
              className="flex items-center gap-2 rounded-xl bg-[#0055FF] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-[#0047db] hover:scale-105 active:scale-95 transition-all"
            >
              <span>Explore 16 Host Cities</span>
              <ArrowRight className="h-4 w-4" />
            </a>

            <a
              href="#groups"
              className="flex items-center gap-2 rounded-xl border border-blue-200 bg-white/90 px-6 py-3.5 text-sm font-bold text-[#0055FF] shadow-md hover:bg-blue-50 hover:scale-105 active:scale-95 transition-all"
            >
              <span>View 12 Groups</span>
            </a>
          </div>
        </section>

        {/* SECTION 2: HOST CITIES & 3D TILT VENUES */}
        <section id="venues" className="space-y-6 pt-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#FF3D00]">
                NORTH AMERICAN INFRASTRUCTURE
              </span>
              <h2 className="text-2xl sm:text-4xl font-black uppercase text-[#0A1128] tracking-tight">
                16 ICONIC HOST VENUES
              </h2>
              <p className="text-sm text-[#475467] max-w-xl mt-1">
                From the historic heights of Estadio Azteca to the modern architectural marvels of MetLife and SoFi Stadium.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 rounded-2xl border border-blue-100 bg-white p-1.5 shadow-sm">
              {[
                { id: 'ALL', label: 'All 16 Venues' },
                { id: 'USA', label: '🇺🇸 USA (11)' },
                { id: 'Mexico', label: '🇲🇽 Mexico (3)' },
                { id: 'Canada', label: '🇨🇦 Canada (2)' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedCountryFilter(f.id)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                    selectedCountryFilter === f.id
                      ? 'bg-[#0055FF] text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-600 hover:text-[#0055FF] hover:bg-blue-50/50'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Venues Grid with 3D Tilt Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVenues.map((venue) => (
              <TiltCard key={venue.id} className="flex flex-col justify-between">
                <div>
                  {/* Photo Banner with Tag */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                      style={{ backgroundImage: `url(${venue.image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                    <div className="absolute top-3 left-3">
                      <span className="rounded-lg bg-white/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-black uppercase text-[#0055FF] shadow-sm">
                        {venue.highlight}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="flex items-center gap-1.5 text-xs font-semibold">
                        <span>{venue.flag}</span>
                        <span>{venue.city}</span>
                      </div>
                      <h3 className="text-lg font-black">{venue.name}</h3>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-medium">Capacity:</span>
                      <span className="font-mono font-bold text-[#0055FF] text-sm">
                        {venue.capacity} Seats
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-medium">Role:</span>
                      <span className="font-bold text-[#0A1128]">{venue.role}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-medium">Schedule:</span>
                      <span className="text-slate-700 font-medium">{venue.matches}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => handleTicketSelect(venue.name)}
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50/50 py-2.5 text-xs font-bold text-[#0055FF] hover:bg-[#0055FF] hover:text-white transition-all"
                  >
                    <Ticket className="h-3.5 w-3.5" />
                    <span>View Stadium Pass Options</span>
                  </button>
                </div>
              </TiltCard>
            ))}
          </div>
        </section>

        {/* SECTION 3: 12 GROUPS INTERACTIVE EXPLORER */}
        <section id="groups" className="space-y-6 pt-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#0055FF]">
              NEW EXPANDED FORMAT
            </span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase text-[#0A1128] tracking-tight">
              THE 12 OFFICIAL GROUPS
            </h2>
            <p className="text-sm text-[#475467]">
              Top 2 from each group plus the 8 best 3rd-placed teams advance to the historic Round of 32.
            </p>
          </div>

          {/* Group Switcher Tabs */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar py-2">
            {GROUPS_DATA.map((grp, idx) => (
              <button
                key={grp.group}
                onClick={() => setSelectedGroupIndex(idx)}
                className={`rounded-2xl px-5 py-2.5 text-xs font-bold uppercase transition-all ${
                  selectedGroupIndex === idx
                    ? 'bg-[#0055FF] text-white shadow-lg shadow-blue-500/25 scale-105'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-300'
                }`}
              >
                {grp.group}
              </button>
            ))}
          </div>

          {/* Selected Group Card */}
          <div className="max-w-4xl mx-auto">
            <TiltCard className="p-6 sm:p-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <div>
                  <h3 className="text-xl font-black text-[#0A1128] uppercase tracking-tight">
                    {GROUPS_DATA[selectedGroupIndex].group} Standings Preview
                  </h3>
                  <span className="text-xs text-slate-500">
                    Host Hub: <strong className="text-[#0055FF]">{GROUPS_DATA[selectedGroupIndex].host}</strong>
                  </span>
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-mono font-bold text-[#0055FF]">
                  4 NATIONS
                </span>
              </div>

              <div className="space-y-3">
                {GROUPS_DATA[selectedGroupIndex].teams.map((team, tIdx) => (
                  <div
                    key={team.name}
                    className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/60 p-4 hover:border-blue-200 transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="font-mono font-bold text-slate-400 text-sm">
                        #{tIdx + 1}
                      </span>
                      <span className="text-2xl">{team.flag}</span>
                      <div>
                        <div className="text-sm font-black text-[#0A1128]">{team.name}</div>
                        <div className="text-xs text-slate-500">{team.seed}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-[#0055FF] block">
                        ⭐ {team.star}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400 block">
                        Key Player
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </TiltCard>
          </div>
        </section>

        {/* SECTION 4: BLOCKBUSTER MATCHUPS */}
        <section id="matchups" className="space-y-6 pt-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#FF3D00]">
              PRIMETIME SHOWDOWNS
            </span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase text-[#0A1128] tracking-tight">
              HEADLINE TOURNAMENT MATCHUPS
            </h2>
            <p className="text-sm text-[#475467]">
              Historic rivalries and potential rematches across North America.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {[
              {
                id: 'm1',
                team1: 'United States',
                flag1: '🇺🇸',
                team2: 'Mexico',
                flag2: '🇲🇽',
                stadium: 'MetLife Stadium (NY/NJ)',
                tag: 'CONCACAF CLÁSICO',
                date: 'June 18 • 20:00 EST',
              },
              {
                id: 'm2',
                team1: 'Argentina',
                flag1: '🇦🇷',
                team2: 'France',
                flag2: '🇫🇷',
                stadium: 'Hard Rock Stadium (Miami)',
                tag: '2022 FINAL REMATCH',
                date: 'June 24 • 19:00 EST',
              },
              {
                id: 'm3',
                team1: 'Brazil',
                flag1: '🇧🇷',
                team2: 'Spain',
                flag2: '🇪🇸',
                stadium: 'SoFi Stadium (Los Angeles)',
                tag: 'SAMBA VS TIKI-TAKA',
                date: 'June 21 • 18:00 PST',
              },
              {
                id: 'm4',
                team1: 'England',
                flag1: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
                team2: 'Germany',
                flag2: '🇩🇪',
                stadium: 'AT&T Stadium (Dallas)',
                tag: 'EUROPEAN TITANS',
                date: 'June 27 • 21:00 CST',
              },
            ].map((match) => (
              <TiltCard key={match.id} className="p-6">
                <div className="flex items-center justify-between text-xs mb-4">
                  <span className="rounded-md bg-orange-100/70 px-2.5 py-0.5 text-[10px] font-black uppercase text-[#FF3D00]">
                    {match.tag}
                  </span>
                  <span className="font-mono text-slate-500 font-semibold">{match.date}</span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{match.flag1}</span>
                    <span className="text-base font-black text-[#0A1128]">{match.team1}</span>
                  </div>

                  <span className="rounded-full bg-slate-100 px-3 py-1 font-mono text-xs font-bold text-slate-500">
                    VS
                  </span>

                  <div className="flex items-center gap-3">
                    <span className="text-base font-black text-[#0A1128]">{match.team2}</span>
                    <span className="text-3xl">{match.flag2}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">📍 {match.stadium}</span>
                  <button
                    onClick={() => handleTicketSelect(`${match.team1} vs ${match.team2}`)}
                    className="font-bold text-[#0055FF] hover:underline"
                  >
                    Matchday Pass →
                  </button>
                </div>
              </TiltCard>
            ))}
          </div>
        </section>

        {/* SECTION 5: DAYLIGHT PASSES & TICKETING */}
        <section id="tickets" className="space-y-6 pt-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#0055FF]">
              OFFICIAL BROADCAST & HOSPITALITY
            </span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase text-[#0A1128] tracking-tight">
              TOURNAMENT STREAMING PASSES
            </h2>
            <p className="text-sm text-[#475467]">
              Watch all 104 matches live in 4K HDR or secure hospitality tickets for stadiums.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                title: '4K Digital Stream Pass',
                price: '$29.99',
                period: 'Full Tournament Pass',
                features: [
                  'All 104 matches live in 4K HDR',
                  'Multi-angle tactical radar camera feeds',
                  'Dolby Atmos 5.1 stadium atmosphere',
                  'Multi-language audio commentary',
                  'Full replay DVR & 15-min extended highlights',
                ],
                recommended: true,
                badge: 'POPULAR CHOICE',
              },
              {
                title: 'Single Matchday Pass',
                price: '$9.99',
                period: '24-Hour Access',
                features: [
                  'Full 24-hour live matchday access',
                  '1080p60 Full HD streaming',
                  'Live match center & real-time analytics',
                  'Desktop, tablet, & mobile access',
                ],
                recommended: false,
              },
              {
                title: 'VIP Stadium Hospitality',
                price: '$499+',
                period: 'Per Match / Venue',
                features: [
                  'Official category 1 stadium seat',
                  'Pitch-side lounge dining access',
                  'Commemorative World Cup 2026 gift pack',
                  'Complimentary FOOTYLive 4K VIP streaming',
                ],
                recommended: false,
              },
            ].map((plan) => (
              <TiltCard
                key={plan.title}
                className={`p-6 sm:p-8 flex flex-col justify-between ${
                  plan.recommended
                    ? 'border-2 border-[#0055FF] bg-gradient-to-b from-white via-white to-blue-50/40 shadow-2xl shadow-blue-500/10'
                    : ''
                }`}
              >
                <div>
                  {plan.badge && (
                    <span className="rounded-full bg-[#0055FF] px-3 py-1 text-[10px] font-black uppercase text-white tracking-wider mb-3 inline-block">
                      {plan.badge}
                    </span>
                  )}
                  <h3 className="text-lg font-black text-[#0A1128]">{plan.title}</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="font-mono text-3xl sm:text-4xl font-black text-[#0055FF]">
                      {plan.price}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">/{plan.period}</span>
                  </div>

                  <ul className="mt-6 space-y-3 text-xs text-slate-700">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-[#0055FF] flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <button
                    onClick={() => handleTicketSelect(plan.title)}
                    className={`w-full rounded-xl py-3 text-xs font-bold transition-all ${
                      plan.recommended
                        ? 'bg-[#0055FF] text-white shadow-lg shadow-blue-600/30 hover:bg-[#0047db]'
                        : 'border border-blue-200 bg-white text-[#0055FF] hover:bg-blue-50'
                    }`}
                  >
                    Select {plan.title}
                  </button>
                </div>
              </TiltCard>
            ))}
          </div>
        </section>

        {/* SECTION 6: SWITCH BACK TO FOOTYLIVE DAZN DARK ARENA */}
        <section className="rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-600 to-[#0055FF] p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-black uppercase tracking-wider backdrop-blur-md">
              DAZN STREAMING ENGINE
            </span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight">
              EXPERIENCE FOOTYLIVE 4K STREAM ARENA
            </h2>
            <p className="text-sm text-blue-100 leading-relaxed">
              Switch back to the dark-themed FOOTYLive dashboard with live score tickers, simulated pitch broadcast player, multi-angle tactical cameras, tournament brackets, and live fan chat.
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-xs font-black uppercase tracking-wider text-[#0055FF] shadow-xl hover:bg-blue-50 hover:scale-105 active:scale-95 transition-all"
              >
                <span>Launch Main Dark Streaming Hub</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Decorative background shape */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 skew-x-12 pointer-events-none" />
        </section>
      </main>

      {/* Daylight Stadium Footer */}
      <footer className="border-t border-blue-100 bg-white/80 py-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#0055FF]">FOOTYLive</span>
            <span>•</span>
            <span>Official World Cup 2026 Interactive Experience</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-[#0055FF]">Dark Stream Arena</Link>
            <a href="#venues" className="hover:text-[#0055FF]">Venues</a>
            <a href="#groups" className="hover:text-[#0055FF]">Groups</a>
            <a href="#tickets" className="hover:text-[#0055FF]">Passes</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
