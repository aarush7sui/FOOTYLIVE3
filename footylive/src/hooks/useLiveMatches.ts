'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Match, MatchEvent } from '../types/football';

// Helper to parse clock string like "74'", "74:12", "HT", "LIVE" into seconds
function parseClockToSeconds(clockStr?: string): number {
  if (!clockStr) return 45 * 60;
  if (clockStr.includes(':')) {
    const [min, sec] = clockStr.split(':').map((v) => parseInt(v, 10));
    return (isNaN(min) ? 45 : min) * 60 + (isNaN(sec) ? 0 : sec);
  }
  const clean = clockStr.replace(/[^0-9]/g, '');
  const min = parseInt(clean, 10);
  return isNaN(min) ? 55 * 60 : min * 60;
}

// Format seconds into MM:SS
function formatSecondsToClock(totalSeconds: number): string {
  const min = Math.floor(totalSeconds / 60);
  const sec = totalSeconds % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

export function useLiveMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Syncing live telemetry...');
  const [source, setSource] = useState<string>('Live Satellite Stream');
  const [secondsUntilNextSync, setSecondsUntilNextSync] = useState<number>(5);
  const [liveSecondTick, setLiveSecondTick] = useState<number>(0);

  const syncCountdownRef = useRef<number>(5);

  // Client-side parser for direct ESPN scoreboard in browser
  const transformDirectEspn = (event: any): Match | null => {
    try {
      const competition = event.competitions?.[0];
      if (!competition) return null;
      const comps = competition.competitors || [];
      const homeComp = comps.find((c: any) => c.homeAway === 'home') || comps[0];
      const awayComp = comps.find((c: any) => c.homeAway === 'away') || comps[1];
      if (!homeComp || !awayComp) return null;

      const state = competition.status?.type?.state || 'pre';
      let status: 'LIVE' | 'UPCOMING' | 'FINISHED' | 'HT' = 'UPCOMING';
      let clockSecs = 0;
      let minute = 'Upcoming';

      if (state === 'in') {
        status = 'LIVE';
        const display = competition.status?.displayClock || '45:00';
        clockSecs = parseClockToSeconds(display);
        minute = formatSecondsToClock(clockSecs);
        if (competition.status?.type?.name === 'STATUS_HALFTIME') {
          status = 'HT';
          minute = 'HT';
        }
      } else if (state === 'post') {
        status = 'FINISHED';
        minute = 'FT';
      }

      const homeScore = parseInt(homeComp.score || '0', 10);
      const awayScore = parseInt(awayComp.score || '0', 10);

      const homePoss = Math.min(70, Math.max(30, 52 + (homeScore - awayScore) * 4));
      const awayPoss = 100 - homePoss;

      return {
        id: event.id,
        tournament: event.season?.slug || competition.notes?.[0]?.headline || 'Global Football Championship',
        stage: competition.type?.text || (status === 'LIVE' ? 'Live In-Play' : 'Official Fixture'),
        homeTeam: {
          name: homeComp.team?.displayName || 'Home Team',
          shortName: homeComp.team?.shortDisplayName || homeComp.team?.abbreviation || 'HOM',
          code: homeComp.team?.abbreviation || 'HOM',
          color: '#' + (homeComp.team?.color || 'ffffff'),
          accentColor: '#' + (homeComp.team?.alternateColor || '0055ff'),
          logo: homeComp.team?.logo || '⚽',
          country: homeComp.team?.location || 'Global',
        },
        awayTeam: {
          name: awayComp.team?.displayName || 'Away Team',
          shortName: awayComp.team?.shortDisplayName || awayComp.team?.abbreviation || 'AWY',
          code: awayComp.team?.abbreviation || 'AWY',
          color: '#' + (awayComp.team?.color || '00ff88'),
          accentColor: '#' + (awayComp.team?.alternateColor || '111420'),
          logo: awayComp.team?.logo || '⚽',
          country: awayComp.team?.location || 'Global',
        },
        score: { home: isNaN(homeScore) ? 0 : homeScore, away: isNaN(awayScore) ? 0 : awayScore },
        minute,
        liveClockSeconds: status === 'LIVE' ? clockSecs : undefined,
        status,
        kickoffTime: new Date(event.date || Date.now()).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        kickoffDate: 'Today',
        stadium: competition.venue?.fullName || 'International Stadium',
        city: competition.venue?.address?.city || 'Global',
        viewers: status === 'LIVE' ? `${(Math.random() * 1.5 + 1.2).toFixed(1)}M Watching` : undefined,
        streamQuality: '4K HDR',
        channels: ['FOOTYLive Main 4K', 'Direct Satellite Feed'],
        cameraAngles: [
          { name: 'Tactical Cam 1', description: 'Wide broadcast tactical flow' },
          { name: 'Director Cut 4K', description: 'Main broadcast production feed' },
          { name: 'Goal Line Cam', description: 'High frame-rate pitch replay' },
        ],
        commentaryTracks: [
          { language: 'English (Live)', commentator: 'World Feed Commentary' },
          { language: 'Spanish (Live)', commentator: 'Relato en Vivo' },
        ],
        events: [
          ...(homeScore > 0 ? [{ id: 'gh1', type: 'goal' as const, minute: 34, player: `${homeComp.team?.shortDisplayName || 'Home'} Striker`, team: 'home' as const, detail: 'Goal ⚽' }] : []),
          ...(awayScore > 0 ? [{ id: 'ga1', type: 'goal' as const, minute: 58, player: `${awayComp.team?.shortDisplayName || 'Away'} Winger`, team: 'away' as const, detail: 'Goal ⚽' }] : []),
        ],
        stats: {
          possession: [homePoss, awayPoss],
          shots: [Math.max(homeScore * 3 + 6, 10), Math.max(awayScore * 3 + 5, 8)],
          shotsOnTarget: [Math.max(homeScore + 2, 4), Math.max(awayScore + 2, 3)],
          xG: [parseFloat((homeScore * 0.75 + 0.35).toFixed(2)), parseFloat((awayScore * 0.75 + 0.25).toFixed(2))],
          corners: [6, 4],
          fouls: [9, 11],
          yellowCards: [1, 2],
          passes: [Math.round(homePoss * 9.2), Math.round(awayPoss * 9.2)],
          passAccuracy: [87, 84],
        },
        lineup: {
          home: {
            formation: '4-3-3',
            startingXI: [
              { number: 1, name: 'Starting Keeper', position: 'GK', rating: 7.5 },
              { number: 4, name: 'Defensive Anchor', position: 'CB', rating: 7.8 },
              { number: 10, name: 'Creative Mid', position: 'CAM', rating: 8.4 },
              { number: 9, name: 'Centre Forward', position: 'ST', rating: 8.6 },
            ],
          },
          away: {
            formation: '4-2-3-1',
            startingXI: [
              { number: 1, name: 'Starting Keeper', position: 'GK', rating: 7.3 },
              { number: 5, name: 'Centre Back', position: 'CB', rating: 7.4 },
              { number: 7, name: 'Right Winger', position: 'RW', rating: 8.0 },
              { number: 9, name: 'Striker', position: 'ST', rating: 8.1 },
            ],
          },
        },
        odds: { home: 2.1, draw: 3.2, away: 3.4 },
      };
    } catch {
      return null;
    }
  };

  const fetchLiveMatches = useCallback(async () => {
    try {
      // Strategy 1: Fetch from internal Next.js live API route
      let fetchedMatches: Match[] = [];
      let feedSource = 'Live Satellite Global Telemetry';
      let fetchError: string | null = null;

      try {
        const res = await fetch('/api/live', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.matches) && data.matches.length > 0) {
            fetchedMatches = data.matches;
            feedSource = data.source || feedSource;
          } else if (data.error) {
            fetchError = data.error;
          }
        } else {
          fetchError = `Internal API route status: ${res.status}`;
        }
      } catch (err: any) {
        fetchError = err.message || 'API Route unreachable';
      }

      // Strategy 2: If internal route failed or returned empty, attempt direct browser ESPN client fetch
      if (fetchedMatches.length === 0) {
        try {
          const directRes = await fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/all/scoreboard', {
            cache: 'no-store',
          });
          if (directRes.ok) {
            const espnData = await directRes.json();
            const parsed = (espnData.events || [])
              .map(transformDirectEspn)
              .filter(Boolean) as Match[];

            if (parsed.length > 0) {
              fetchedMatches = parsed;
              feedSource = 'Direct Live Satellite Stream (ESPN Public API)';
              fetchError = null;
            }
          }
        } catch (err: any) {
          // Direct fetch also blocked
        }
      }

      if (fetchedMatches.length > 0) {
        setMatches((prev) => {
          return fetchedMatches.map((newM) => {
            const oldM = prev.find((p) => p.id === newM.id);
            if (newM.status === 'LIVE') {
              const currentSecs = oldM?.liveClockSeconds || parseClockToSeconds(newM.minute);
              return {
                ...newM,
                liveClockSeconds: currentSecs,
                minute: formatSecondsToClock(currentSecs),
              };
            }
            return newM;
          });
        });

        setIsLiveConnected(true);
        setError(null);
        setSource(feedSource);
        const now = new Date();
        setLastSyncTime(
          now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        );
      } else {
        // No matches found from live endpoints
        if (matches.length === 0) {
          setError(fetchError || 'No live matches available from sports telemetry feed right now.');
        }
        setIsLiveConnected(false);
      }
    } catch (err: any) {
      console.warn('Live scores telemetry exception:', err);
      setError(err.message || 'Error connecting to live sports API.');
      setIsLiveConnected(false);
    } finally {
      setIsLoading(false);
      syncCountdownRef.current = 5;
      setSecondsUntilNextSync(5);
    }
  }, [matches.length]);

  // 1-SECOND TICK ENGINE: Runs every 1000ms
  useEffect(() => {
    fetchLiveMatches();

    const secondInterval = setInterval(() => {
      setLiveSecondTick((t) => t + 1);

      // Decrement sync countdown
      syncCountdownRef.current -= 1;
      if (syncCountdownRef.current <= 0) {
        syncCountdownRef.current = 5;
        fetchLiveMatches();
      }
      setSecondsUntilNextSync(syncCountdownRef.current);

      // Advance clock and live stats for every LIVE match
      setMatches((prevMatches) => {
        if (prevMatches.length === 0) return prevMatches;

        return prevMatches.map((match) => {
          if (match.status !== 'LIVE') return match;

          const currentSeconds = (match.liveClockSeconds || parseClockToSeconds(match.minute)) + 1;
          const updatedMinute = formatSecondsToClock(currentSeconds);

          // Dynamic momentum wave shift
          const currentMomentum = match.momentum || [35, 45, 55, 20, 60, 40, 75, -20, 80, 65];
          const shiftedMomentum = [
            ...currentMomentum.slice(1),
            Math.round(Math.sin(currentSeconds * 0.2) * 50 + (match.score.home - match.score.away) * 15),
          ];

          return {
            ...match,
            liveClockSeconds: currentSeconds,
            minute: updatedMinute,
            momentum: shiftedMomentum,
          };
        });
      });
    }, 1000);

    return () => clearInterval(secondInterval);
  }, [fetchLiveMatches]);

  return {
    matches,
    isLoading,
    isLiveConnected,
    error,
    lastSyncTime,
    source,
    refreshLiveScores: fetchLiveMatches,
    liveCount: matches.filter((m) => m.status === 'LIVE').length,
    totalCount: matches.length,
    secondsUntilNextSync,
    liveSecondTick,
  };
}
