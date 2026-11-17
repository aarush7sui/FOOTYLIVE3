import React from 'react';

export function MatchCardSkeleton() {
  return (
    <div className="min-w-[340px] max-w-[340px] rounded-2xl border border-[#232838] bg-[#121520] p-4 animate-pulse">
      <div className="flex items-center justify-between border-b border-[#1c2233] pb-3 mb-3">
        <div className="h-3 w-28 bg-[#232838] rounded" />
        <div className="h-4 w-12 bg-[#232838] rounded-full" />
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#232838]" />
            <div className="h-3.5 w-24 bg-[#232838] rounded" />
          </div>
          <div className="h-5 w-6 bg-[#232838] rounded" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#232838]" />
            <div className="h-3.5 w-24 bg-[#232838] rounded" />
          </div>
          <div className="h-5 w-6 bg-[#232838] rounded" />
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-[#1c2233] flex justify-between items-center">
        <div className="h-3 w-20 bg-[#232838] rounded" />
        <div className="h-3 w-16 bg-[#232838] rounded" />
      </div>
    </div>
  );
}

export function HeroPlayerSkeleton() {
  return (
    <div className="w-full rounded-2xl border border-[#232838] bg-[#121520] overflow-hidden animate-pulse">
      <div className="aspect-video w-full bg-[#181c2a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-[#00ff88]/30 border-t-[#00ff88] animate-spin" />
          <span className="text-xs text-[#8b94a5] font-mono">CONNECTING TO BROADCAST SATELLITE...</span>
        </div>
      </div>
      <div className="p-4 border-t border-[#1c2233] flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 w-48 bg-[#232838] rounded" />
          <div className="h-3 w-32 bg-[#232838] rounded" />
        </div>
        <div className="h-8 w-24 bg-[#232838] rounded-lg" />
      </div>
    </div>
  );
}

export function StandingsSkeleton() {
  return (
    <div className="space-y-2 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#141825] border border-[#1e2436]">
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 bg-[#232838] rounded" />
            <div className="h-6 w-6 rounded-full bg-[#232838]" />
            <div className="h-3.5 w-28 bg-[#232838] rounded" />
          </div>
          <div className="flex items-center gap-4">
            <div className="h-3.5 w-8 bg-[#232838] rounded" />
            <div className="h-3.5 w-8 bg-[#232838] rounded" />
            <div className="h-3.5 w-8 bg-[#232838] rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
