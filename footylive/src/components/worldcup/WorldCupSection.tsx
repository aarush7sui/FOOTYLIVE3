'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  CheckCircle2,
  Ticket,
  Award,
  Medal,
} from 'lucide-react';
import { TiltCard } from './TiltCard';

const HOST_VENUES = [
  {
    id: 'metlife',
    name: 'MetLife Stadium',
    city: 'New York / New Jersey',
    country: 'USA',
    flag: '🇺🇸',
    capacity: '82,500',
    role: 'Grand Final Stadium',
    matches: '8 Matches Hosted (Argentina 1 - 0 Colombia Final on July 19)',
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
    matches: '5 Matches Hosted (Historic 3rd World Cup Opener)',
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
    matches: '8 Matches Hosted (Argentina 2 - 1 Netherlands QF)',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
    highlight: 'USA HUB',
  },
  {
    id: 'att',
    name: 'AT&T Stadium',
    city: 'Dallas, Texas',
    country: 'USA',
    flag: '🇺🇸',
    capacity: '92,000',
    role: 'Semi-Final Host',
    matches: '9 Matches Hosted (Argentina 2 - 0 France Semi-Final)',
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
    matches: '7 Matches Hosted (France 3 - 2 England 3rd Place Playoff)',
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
    matches: '7 Matches Hosted (Canada Knockout Run)',
    image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=800&q=80',
    highlight: 'CANADA HUB',
  },
];

const GROUPS_DATA = [
  {
    group: 'Group A',
    host: 'Mexico City',
    teams: [
      { name: 'Germany', flag: '🇩🇪', seed: 'Group Winner', star: 'Florian Wirtz', pts: 7 },
      { name: 'Mexico', flag: '🇲🇽', seed: 'Runner-up (Host)', star: 'Santiago Giménez', pts: 6 },
      { name: 'Japan', flag: '🇯🇵', seed: 'Qualified 3rd', star: 'Takefusa Kubo', pts: 4 },
      { name: 'Egypt', flag: '🇪🇬', seed: 'Eliminated', star: 'Mohamed Salah', pts: 0 },
    ],
  },
  {
    group: 'Group B',
    host: 'Los Angeles / Seattle',
    teams: [
      { name: 'Netherlands', flag: '🇳🇱', seed: 'Group Winner', star: 'Virgil van Dijk', pts: 7 },
      { name: 'United States', flag: '🇺🇸', seed: 'Runner-up (Host)', star: 'Christian Pulisic', pts: 6 },
      { name: 'Senegal', flag: '🇸🇳', seed: 'Qualified 3rd', star: 'Sadio Mané', pts: 4 },
      { name: 'Ukraine', flag: '🇺🇦', seed: 'Eliminated', star: 'Mykhailo Mudryk', pts: 0 },
    ],
  },
  {
    group: 'Group C',
    host: 'Vancouver / Toronto',
    teams: [
      { name: 'France', flag: '🇫🇷', seed: 'Group Winner', star: 'Kylian Mbappé', pts: 9 },
      { name: 'Morocco', flag: '🇲🇦', seed: 'Runner-up', star: 'Achraf Hakimi', pts: 6 },
      { name: 'Canada', flag: '🇨🇦', seed: 'Qualified 3rd (Host)', star: 'Alphonso Davies', pts: 3 },
      { name: 'Chile', flag: '🇨🇱', seed: 'Eliminated', star: 'Alexis Sánchez', pts: 0 },
    ],
  },
  {
    group: 'Group D',
    host: 'Miami / Atlanta',
    teams: [
      { name: 'Argentina', flag: '🇦🇷', seed: 'Champion 🏆', star: 'Lionel Messi', pts: 9 },
      { name: 'Colombia', flag: '🇨🇴', seed: 'Finalist 🥈', star: 'Luis Díaz', pts: 6 },
      { name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', seed: 'Semi-Finalist', star: 'Jude Bellingham', pts: 3 },
      { name: 'Australia', flag: '🇦🇺', seed: 'Eliminated', star: 'Nestory Irankunda', pts: 0 },
    ],
  },
];

export const WorldCupSection: React.FC = () => {
  const [selectedCountryFilter, setSelectedCountryFilter] = useState('ALL');
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredVenues = HOST_VENUES.filter((v) => {
    if (selectedCountryFilter === 'ALL') return true;
    return v.country === selectedCountryFilter;
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <section
      id="world-cup-2026-experience"
      className="relative rounded-3xl overflow-hidden bg-[#F7F9FB] text-[#111827] shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-[#E5E7EB] my-10"
    >
      {/* Toast Notification with AnimatePresence */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 right-4 z-50 flex items-center gap-2 rounded-xl bg-[#0055FF] px-4 py-2.5 text-xs font-bold text-white shadow-xl"
          >
            <CheckCircle2 className="h-4 w-4 text-[#00ff88]" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Banner: Day Mode */}
      <div className="relative px-6 py-12 sm:px-12 sm:py-16 overflow-hidden bg-gradient-to-br from-[#FFFFFF] via-[#F0F4F8] to-[#E2E8F0]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0055FF]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FF3D00]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#0055FF]/10 border border-[#0055FF]/20 px-3.5 py-1 text-xs font-black tracking-wider text-[#0055FF] font-mono">
            <Trophy className="h-3.5 w-3.5 text-[#FF3D00]" />
            HISTORIC TOURNAMENT CONCLUDED • JULY 19, 2026
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#0F172A] leading-tight">
            RELIVE THE GREATEST WORLD CUP IN HISTORY
          </h1>

          <p className="text-sm sm:text-base text-[#475569] max-w-2xl font-medium">
            104 matches across 16 world-class stadiums in the United States, Mexico, and Canada.
            Argentina defeated Colombia 1-0 in the Grand Final at MetLife Stadium to win back-to-back FIFA World Cups.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <motion.a
              href="/world-cup-2026"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0055FF] px-5 py-3 text-sm font-bold text-white shadow-lg hover:bg-[#0044CC] transition-all"
            >
              <Trophy className="h-4 w-4" />
              Full World Cup Hub & Archive
              <ArrowRight className="h-4 w-4" />
            </motion.a>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => showToast('Argentina Champion Replay loaded into 4K player')}
              className="inline-flex items-center gap-2 rounded-xl border border-[#CBD5E1] bg-white px-5 py-3 text-sm font-bold text-[#334155] shadow-sm hover:border-[#0055FF] hover:text-[#0055FF] transition-all"
            >
              <Medal className="h-4 w-4 text-[#FF3D00]" />
              Watch Grand Final 4K Highlights
            </motion.button>
          </div>
        </div>

        {/* Tournament Champions Showcase Podium */}
        <div className="mt-8 rounded-2xl bg-white/80 backdrop-blur-md border border-[#E2E8F0] p-6 shadow-md max-w-3xl">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-[#FF3D00]" />
              <span className="text-xs font-black uppercase tracking-wider text-[#0F172A] font-mono">
                FIFA WORLD CUP 2026 PODIUM & HONORS
              </span>
            </div>
            <span className="rounded-full bg-[#0055FF]/10 text-[#0055FF] px-2.5 py-0.5 text-[10px] font-mono font-bold">
              METLIFE STADIUM • 82,500 FANS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* 1st Place */}
            <div className="rounded-xl border-2 border-[#FFD700] bg-gradient-to-b from-yellow-50 to-white p-4 text-center shadow-sm">
              <span className="text-2xl">🥇</span>
              <div className="font-mono text-[10px] font-black uppercase text-amber-600 mt-1">CHAMPIONS</div>
              <div className="text-lg font-black text-[#0F172A] flex items-center justify-center gap-1.5 mt-0.5">
                <span>🇦🇷</span> Argentina
              </div>
              <div className="text-[11px] text-[#475569] font-medium mt-1">
                Final: 1 - 0 vs Colombia
              </div>
            </div>

            {/* 2nd Place */}
            <div className="rounded-xl border border-[#C0C0C0] bg-gradient-to-b from-slate-50 to-white p-4 text-center shadow-sm">
              <span className="text-2xl">🥈</span>
              <div className="font-mono text-[10px] font-black uppercase text-slate-500 mt-1">RUNNERS-UP</div>
              <div className="text-lg font-black text-[#0F172A] flex items-center justify-center gap-1.5 mt-0.5">
                <span>🇨🇴</span> Colombia
              </div>
              <div className="text-[11px] text-[#475569] font-medium mt-1">
                Historic Silver Medal
              </div>
            </div>

            {/* 3rd Place */}
            <div className="rounded-xl border border-[#CD7F32] bg-gradient-to-b from-orange-50 to-white p-4 text-center shadow-sm">
              <span className="text-2xl">🥉</span>
              <div className="font-mono text-[10px] font-black uppercase text-orange-600 mt-1">THIRD PLACE</div>
              <div className="text-lg font-black text-[#0F172A] flex items-center justify-center gap-1.5 mt-0.5">
                <span>🇫🇷</span> France
              </div>
              <div className="text-[11px] text-[#475569] font-medium mt-1">
                Bronze: 3 - 2 vs England
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Venues Showcase */}
      <div className="px-6 py-10 sm:px-12 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
              <MapPin className="h-5 w-5 text-[#FF3D00]" />
              THE 16 HOST STADIUMS ACROSS 3 NATIONS
            </h2>
            <p className="text-xs text-[#64748B]">
              From the 87,500-capacity Estadio Azteca to the New York Grand Final at MetLife Stadium
            </p>
          </div>

          {/* Filter Pills with Sliding Spring Animation */}
          <div className="flex items-center gap-1 rounded-xl border border-[#E2E8F0] bg-[#F1F5F9] p-1">
            {[
              { id: 'ALL', label: 'All 3 Nations' },
              { id: 'USA', label: '🇺🇸 USA (11)' },
              { id: 'Mexico', label: '🇲🇽 Mexico (3)' },
              { id: 'Canada', label: '🇨🇦 Canada (2)' },
            ].map((country) => {
              const isSelected = selectedCountryFilter === country.id;
              return (
                <motion.button
                  key={country.id}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setSelectedCountryFilter(country.id)}
                  className="relative rounded-lg px-3 py-1.5 text-xs font-bold transition-all"
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeVenueFilterPill"
                      className="absolute inset-0 rounded-lg bg-[#0055FF] shadow-sm"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                  <span className={`relative z-10 ${isSelected ? 'text-white' : 'text-[#64748B]'}`}>
                    {country.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Stadium Tilt Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVenues.map((venue) => (
            <TiltCard key={venue.id} className="cursor-pointer">
              <div
                onClick={() => showToast(`Loaded venue tour for ${venue.name}`)}
                className="group relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm hover:shadow-xl transition-all"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                  <img
                    src={venue.image}
                    alt={venue.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                  <div className="absolute top-3 left-3 rounded-md bg-[#0055FF] px-2 py-0.5 text-[10px] font-black text-white font-mono shadow-md">
                    {venue.highlight}
                  </div>

                  <div className="absolute top-3 right-3 text-lg drop-shadow">
                    {venue.flag}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="text-base font-black leading-tight drop-shadow">
                      {venue.name}
                    </h3>
                    <p className="text-xs text-slate-200 flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3 text-[#FF3D00]" />
                      {venue.city}
                    </p>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-[#64748B]">
                    <span>Capacity: <strong className="text-[#0F172A]">{venue.capacity}</strong></span>
                    <span className="text-[#0055FF] font-bold">{venue.role}</span>
                  </div>
                  <p className="text-xs text-[#475569]">{venue.matches}</p>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>

      {/* Official Groups Standings Results */}
      <div className="px-6 py-10 sm:px-12 bg-[#F8FAFC] border-t border-[#E2E8F0]">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
              <Trophy className="h-5 w-5 text-[#0055FF]" />
              FINAL GROUP STANDINGS RESULTS
            </h2>
            <p className="text-xs text-[#64748B]">
              Top 2 teams plus 8 best third-place nations advanced to the historic Round of 32
            </p>
          </div>

          <div className="flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-white p-1">
            {GROUPS_DATA.map((g, idx) => {
              const isSelected = selectedGroupIndex === idx;
              return (
                <motion.button
                  key={g.group}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setSelectedGroupIndex(idx)}
                  className="relative rounded-lg px-3 py-1 text-xs font-bold transition-all"
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeGroupPill"
                      className="absolute inset-0 rounded-lg bg-[#0055FF] shadow-sm"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                  <span className={`relative z-10 ${isSelected ? 'text-white' : 'text-[#64748B]'}`}>
                    {g.group}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Group Table View */}
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-[#F1F5F9] pb-3 text-xs font-mono text-[#64748B]">
            <span>{GROUPS_DATA[selectedGroupIndex].group} • Hosted in {GROUPS_DATA[selectedGroupIndex].host}</span>
            <span className="text-[#0055FF] font-bold">Group Stage Completed</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {GROUPS_DATA[selectedGroupIndex].teams.map((t, idx) => (
              <div
                key={t.name}
                className={`p-4 rounded-xl border transition-all ${
                  idx < 2
                    ? 'border-[#0055FF]/30 bg-blue-50/40'
                    : 'border-[#E2E8F0] bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{t.flag}</span>
                  <span className="font-mono text-xs font-bold text-[#0055FF] bg-[#0055FF]/10 px-2 py-0.5 rounded">
                    {t.pts} PTS
                  </span>
                </div>
                <h4 className="font-bold text-[#0F172A] text-sm">{t.name}</h4>
                <div className="text-[11px] font-mono text-[#64748B] mt-0.5">{t.seed}</div>
                <div className="text-xs text-[#0055FF] font-semibold mt-2 pt-2 border-t border-slate-100">
                  Star: {t.star}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
