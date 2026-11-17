'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PlaySquare,
  ChevronLeft,
  ChevronRight,
  Play,
  Clock,
  Eye,
  Sparkles,
  Flame,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { HighlightItem } from '../../types/football';

interface HighlightsCarouselProps {
  onPlayHighlight?: (highlight: HighlightItem) => void;
}

export const HighlightsCarousel: React.FC<HighlightsCarouselProps> = ({
  onPlayHighlight,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [highlights, setHighlights] = useState<HighlightItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const filterTabs = [
    { id: 'ALL', label: 'All Highlights' },
    { id: 'EXTENDED', label: '15-Min Extended' },
    { id: 'ALL GOALS', label: 'All Goals Recaps' },
    { id: 'VIRAL', label: 'Viral Moments' },
  ];

  const fetchHighlights = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch(`/api/highlights?filter=${selectedFilter}`);
      if (!res.ok) {
        throw new Error(`Media API returned status ${res.status}`);
      }
      const data = await res.json();
      if (data.success && Array.isArray(data.highlights)) {
        setHighlights(data.highlights);
      } else {
        throw new Error(data.error || 'Failed to load highlights');
      }
    } catch (err: any) {
      setError(err.message || 'Media network stream unavailable');
      setHighlights([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHighlights();
  }, [selectedFilter]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -360 : 360;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section className="space-y-4">
      {/* Header and Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00ff88]/20 border border-[#00ff88]/40 shadow-[0_0_10px_rgba(0,255,136,0.2)]">
            <PlaySquare className="h-4 w-4 text-[#00ff88]" />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
              HIGHLIGHTS & MATCH REPLAYS
              <span className="rounded-full bg-[#1c2233] px-2 py-0.5 text-[10px] font-bold text-[#00ff88] font-mono">
                ON DEMAND
              </span>
            </h2>
            <p className="text-xs text-[#8b94a5]">
              Extended match recaps, all goals multicam, and official club highlights
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
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

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedFilter(tab.id)}
            className={`whitespace-nowrap rounded-lg px-3 py-1 text-xs font-bold transition-all ${
              selectedFilter === tab.id
                ? 'bg-[#00ff88] text-black shadow-[0_0_12px_rgba(0,255,136,0.3)]'
                : 'border border-[#222838] bg-[#12151e] text-[#8b94a5] hover:border-[#00ff88]/30 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="flex gap-4 overflow-hidden py-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="min-w-[280px] max-w-[280px] rounded-xl border border-[#222838] bg-[#121520] p-3 animate-pulse">
              <div className="aspect-video w-full bg-[#1b2030] rounded-lg mb-3" />
              <div className="h-4 w-3/4 bg-[#1b2030] rounded mb-2" />
              <div className="h-3 w-1/2 bg-[#1b2030] rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="rounded-xl border border-red-500/20 bg-red-950/20 p-4 text-center">
          <AlertCircle className="h-5 w-5 text-red-400 mx-auto mb-2" />
          <p className="text-xs text-red-300 font-mono mb-2">{error}</p>
          <button
            onClick={fetchHighlights}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-xs text-red-300 font-bold transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Retry Fetch
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && highlights.length === 0 && (
        <div className="rounded-xl border border-[#222838] bg-[#121520] p-6 text-center text-xs text-[#8b94a5]">
          No video highlights available for this category right now.
        </div>
      )}

      {/* Highlights List */}
      {!isLoading && !error && highlights.length > 0 && (
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto no-scrollbar py-1"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {highlights.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -4 }}
              onClick={() => onPlayHighlight?.(item)}
              className="group min-w-[280px] max-w-[280px] cursor-pointer rounded-xl border border-[#222838] bg-[#12151e] overflow-hidden transition-all hover:border-[#00ff88]/40 hover:shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
              style={{ scrollSnapAlign: 'start' }}
            >
              <div className="relative aspect-video w-full overflow-hidden bg-black">
                <img
                  src={item.thumbnailUrl}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                <div className="absolute top-2 left-2 rounded bg-black/60 backdrop-blur-md px-1.5 py-0.5 text-[9px] font-bold text-[#00ff88] font-mono border border-white/10">
                  {item.quality || '4K HDR'}
                </div>

                <div className="absolute bottom-2 right-2 rounded bg-black/80 backdrop-blur-md px-1.5 py-0.5 text-[10px] font-mono text-white flex items-center gap-1">
                  <Clock className="h-2.5 w-2.5 text-[#00ff88]" />
                  {item.duration}
                </div>

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00ff88] text-black shadow-[0_0_15px_rgba(0,255,136,0.6)]">
                    <Play className="h-5 w-5 fill-black ml-0.5" />
                  </div>
                </div>
              </div>

              <div className="p-3">
                <span className="text-[10px] font-mono font-bold uppercase text-[#00ff88]">
                  {item.tournament}
                </span>
                <h3 className="text-xs font-bold text-white line-clamp-2 mt-0.5 group-hover:text-[#00ff88] transition-colors">
                  {item.title}
                </h3>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#1a1f2c] text-[10px] text-[#8b94a5]">
                  <span>{item.date || 'Today'}</span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-2.5 w-2.5" />
                    {item.views}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};
