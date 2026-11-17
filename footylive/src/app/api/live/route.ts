import { NextResponse } from 'next/server';
import { Match, MatchTeam, MatchEvent } from '../../../types/football';

// Map ESPN season slugs / league keys to friendly tournament names
const LEAGUE_MAP: Record<string, string> = {
  '2026-27-english-premier-league': 'Premier League',
  'english-premier-league': 'Premier League',
  'eng.1': 'Premier League',
  'uefa-champions-league': 'UEFA Champions League',
  'uefa.champions': 'UEFA Champions League',
  '2026-27-laliga': 'La Liga EA Sports',
  'laliga': 'La Liga EA Sports',
  'esp.1': 'La Liga EA Sports',
  '2026-27-italian-serie-a': 'Serie A Made in Italy',
  'italian-serie-a': 'Serie A Made in Italy',
  'ita.1': 'Serie A Made in Italy',
  '2026-27-german-bundesliga': 'Bundesliga',
  'german-bundesliga': 'Bundesliga',
  'ger.1': 'Bundesliga',
  '2026-27-ligue-1': 'Ligue 1 McDonald’s',
  'fra.1': 'Ligue 1 McDonald’s',
  'torneo-apertura': 'Liga MX',
  'mex.1': 'Liga MX',
  'major-league-soccer': 'Major League Soccer',
  'usa.1': 'Major League Soccer',
  'saudi-pro-league': 'Roshn Saudi League',
  'sau.1': 'Roshn Saudi League',
  'conmebol-libertadores': 'CONMEBOL Copa Libertadores',
  'conmebol.libertadores': 'CONMEBOL Copa Libertadores',
};

// Transform ESPN scoreboard event into our Match schema
function transformEspnEvent(event: any): Match | null {
  try {
    const competition = event.competitions?.[0];
    if (!competition) return null;

    const competitors = competition.competitors || [];
    const homeComp = competitors.find((c: any) => c.homeAway === 'home') || competitors[0];
    const awayComp = competitors.find((c: any) => c.homeAway === 'away') || competitors[1];

    if (!homeComp || !awayComp) return null;

    const statusType = competition.status?.type || event.status?.type || {};
    const state = statusType.state || 'pre'; // 'in', 'pre', 'post'

    let status: 'LIVE' | 'UPCOMING' | 'FINISHED' | 'HT' = 'UPCOMING';
    let minute = 'Upcoming';
    let clockSecs = 0;

    if (state === 'in') {
      status = 'LIVE';
      const clock = competition.status?.displayClock || event.status?.displayClock;
      minute = clock ? `${clock}` : 'LIVE';
      if (clock && typeof clock === 'string') {
        const parts = clock.split(':');
        if (parts.length === 2) {
          clockSecs = (parseInt(parts[0], 10) || 0) * 60 + (parseInt(parts[1], 10) || 0);
        } else {
          const num = parseInt(clock.replace(/[^0-9]/g, ''), 10);
          clockSecs = isNaN(num) ? 55 * 60 : num * 60;
        }
      } else {
        clockSecs = 55 * 60;
      }

      if (statusType.name === 'STATUS_HALFTIME') {
        status = 'HT';
        minute = 'HT';
        clockSecs = 45 * 60;
      }
    } else if (state === 'post') {
      status = 'FINISHED';
      minute = statusType.shortDetail || 'FT';
    } else {
      status = 'UPCOMING';
      minute = statusType.shortDetail || 'Starts Soon';
    }

    const homeScore = parseInt(homeComp.score || '0', 10);
    const awayScore = parseInt(awayComp.score || '0', 10);

    // Date formatting
    const eventDate = new Date(event.date || Date.now());
    const isToday = new Date().toDateString() === eventDate.toDateString();
    const kickoffTime = eventDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }) + ' GMT';

    const kickoffDate = isToday
      ? 'Today'
      : eventDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    // Tournament Name lookup
    const seasonSlug = event.season?.slug || '';
    const tournamentName =
      LEAGUE_MAP[seasonSlug] ||
      LEAGUE_MAP[event.league?.name] ||
      event.competitions?.[0]?.notes?.[0]?.headline ||
      (seasonSlug ? seasonSlug.split('-').map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ') : 'World Football Match');

    // Home & Away Teams
    const homeTeam: MatchTeam = {
      name: homeComp.team?.displayName || homeComp.team?.name || 'Home Club',
      shortName: homeComp.team?.shortDisplayName || homeComp.team?.abbreviation || 'HOM',
      code: homeComp.team?.abbreviation || 'HOM',
      color: '#' + (homeComp.team?.color || 'ffffff'),
      accentColor: '#' + (homeComp.team?.alternateColor || '0055ff'),
      logo: homeComp.team?.logo || '⚽',
      country: homeComp.team?.location || 'Global',
    };

    const awayTeam: MatchTeam = {
      name: awayComp.team?.displayName || awayComp.team?.name || 'Away Club',
      shortName: awayComp.team?.shortDisplayName || awayComp.team?.abbreviation || 'AWY',
      code: awayComp.team?.abbreviation || 'AWY',
      color: '#' + (awayComp.team?.color || '00ff88'),
      accentColor: '#' + (awayComp.team?.alternateColor || '111420'),
      logo: awayComp.team?.logo || '⚽',
      country: awayComp.team?.location || 'Global',
    };

    // Extract live stats if available from competition
    const getStat = (name: string, defaultVal: [number, number]): [number, number] => {
      try {
        const homeStats = homeComp.statistics || [];
        const awayStats = awayComp.statistics || [];
        const h = homeStats.find((s: any) => s.name === name)?.displayValue;
        const a = awayStats.find((s: any) => s.name === name)?.displayValue;
        if (h !== undefined && a !== undefined) {
          const valH = parseFloat(h.replace('%', ''));
          const valA = parseFloat(a.replace('%', ''));
          if (!isNaN(valH) && !isNaN(valA)) return [valH, valA];
        }
      } catch {}
      return defaultVal;
    };

    const homePoss = getStat('possessionPct', [52, 48])[0];
    const awayPoss = 100 - homePoss;
    const shots = getStat('shotsTotal', [Math.max(homeScore * 3 + 5, 8), Math.max(awayScore * 3 + 4, 6)]);
    const shotsOnTarget = getStat('shotsOnTarget', [Math.max(homeScore + 2, 4), Math.max(awayScore + 1, 3)]);
    const corners = getStat('corners', [5, 4]);
    const fouls = getStat('foulsCommitted', [9, 11]);
    const yellowCards = getStat('yellowCards', [1, 2]);

    // Live momentum wave calculation based on score difference & possession
    const scoreDiff = homeScore - awayScore;
    const momentum = [
      Math.round(Math.min(90, Math.max(-90, (homePoss - 50) * 1.5 + scoreDiff * 20))),
      Math.round(Math.min(90, Math.max(-90, (homePoss - 50) * 1.8 + scoreDiff * 25))),
      Math.round(Math.min(90, Math.max(-90, (homePoss - 50) * 1.2 + scoreDiff * 15))),
      Math.round(Math.min(90, Math.max(-90, (homePoss - 50) * 2.0 + scoreDiff * 30))),
      Math.round(Math.min(90, Math.max(-90, (homePoss - 50) * 1.6 + scoreDiff * 22))),
      Math.round(Math.min(90, Math.max(-90, (homePoss - 50) * 2.2 + scoreDiff * 35))),
      Math.round(Math.min(90, Math.max(-90, (homePoss - 50) * 1.4 + scoreDiff * 18))),
      Math.round(Math.min(90, Math.max(-90, (homePoss - 50) * 2.5 + scoreDiff * 40))),
      Math.round(Math.min(90, Math.max(-90, (homePoss - 50) * 1.9 + scoreDiff * 28))),
      Math.round(Math.min(90, Math.max(-90, (homePoss - 50) * 2.1 + scoreDiff * 32))),
    ];

    // Real match events parsing if ESPN returns competition details
    const parsedEvents: MatchEvent[] = [];
    if (Array.isArray(competition.details)) {
      competition.details.forEach((d: any, idx: number) => {
        const isGoal = d.type?.text?.toLowerCase().includes('goal');
        const isYellow = d.type?.text?.toLowerCase().includes('yellow');
        const isRed = d.type?.text?.toLowerCase().includes('red');
        const teamSide = d.team?.id === homeComp.team?.id ? 'home' : 'away';

        if (isGoal) {
          parsedEvents.push({
            id: `espn-goal-${idx}`,
            type: 'goal',
            minute: parseInt(d.clock?.displayValue || '0', 10) || 45,
            player: d.athletesInvolved?.[0]?.displayName || `${teamSide === 'home' ? homeTeam.shortName : awayTeam.shortName} Player`,
            team: teamSide,
            detail: d.type?.text || 'Goal ⚽',
          });
        } else if (isYellow || isRed) {
          parsedEvents.push({
            id: `espn-card-${idx}`,
            type: isRed ? 'red_card' : 'yellow_card',
            minute: parseInt(d.clock?.displayValue || '0', 10) || 45,
            player: d.athletesInvolved?.[0]?.displayName || 'Player',
            team: teamSide,
            detail: d.type?.text || 'Foul',
          });
        }
      });
    }

    // If no events returned by details, generate goals consistent with score
    if (parsedEvents.length === 0) {
      if (homeScore > 0) {
        parsedEvents.push({
          id: 'h-g1',
          type: 'goal',
          minute: Math.min(85, Math.max(12, Math.floor(Math.random() * 60 + 15))),
          player: `${homeTeam.shortName} Attacker`,
          team: 'home',
          detail: 'Goal ⚽',
        });
      }
      if (awayScore > 0) {
        parsedEvents.push({
          id: 'a-g1',
          type: 'goal',
          minute: Math.min(88, Math.max(25, Math.floor(Math.random() * 50 + 35))),
          player: `${awayTeam.shortName} Attacker`,
          team: 'away',
          detail: 'Goal ⚽',
        });
      }
    }

    return {
      id: event.id,
      tournament: tournamentName,
      stage: competition.type?.text || (status === 'LIVE' ? 'Live In-Play' : 'Official Fixture'),
      homeTeam,
      awayTeam,
      score: { home: isNaN(homeScore) ? 0 : homeScore, away: isNaN(awayScore) ? 0 : awayScore },
      minute,
      liveClockSeconds: status === 'LIVE' ? clockSecs : undefined,
      status,
      kickoffTime,
      kickoffDate,
      stadium: competition.venue?.fullName || 'International Stadium',
      city: competition.venue?.address?.city
        ? `${competition.venue.address.city}, ${competition.venue.address.country || ''}`
        : 'Global',
      viewers: status === 'LIVE' ? `${(Math.random() * 1.8 + 1.2).toFixed(1)}M Watching` : undefined,
      streamQuality: '4K HDR',
      channels: ['FOOTYLive Ultra 4K', 'Direct Satellite Feed', 'DAZN Broadcast'],
      cameraAngles: [
        { name: 'Tactical Cam 1', description: 'Wide broadcast tactical flow and shape' },
        { name: 'Director Cut 4K', description: 'Main broadcast production feed' },
        { name: 'Goal Line Cam', description: 'High frame-rate pitch replay' },
        { name: 'Manager Dugout Cam', description: 'Dugout reactions and touchline instructions' },
      ],
      commentaryTracks: [
        { language: 'English (Live)', commentator: 'World Feed Commentary' },
        { language: 'Spanish (Live)', commentator: 'Relato en Vivo con Análisis' },
        { language: 'Stadium Atmos', commentator: 'Dolby Atmos 5.1 Clean Sound' },
      ],
      events: parsedEvents,
      momentum,
      stats: {
        possession: [homePoss, awayPoss],
        shots,
        shotsOnTarget,
        xG: [
          parseFloat((shotsOnTarget[0] * 0.28 + homeScore * 0.45).toFixed(2)),
          parseFloat((shotsOnTarget[1] * 0.28 + awayScore * 0.45).toFixed(2)),
        ],
        corners,
        fouls,
        yellowCards,
        passes: [Math.round(homePoss * 9.5), Math.round(awayPoss * 9.5)],
        passAccuracy: [Math.round(78 + homePoss * 0.18), Math.round(78 + awayPoss * 0.18)],
      },
      lineup: {
        home: {
          formation: '4-3-3',
          startingXI: [
            { number: 1, name: 'Starting Keeper', position: 'GK', rating: 7.4 },
            { number: 4, name: 'Center Back', position: 'CB', rating: 7.7 },
            { number: 8, name: 'Playmaker Mid', position: 'CM', rating: 8.2 },
            { number: 10, name: 'Target Forward', position: 'ST', rating: 8.5 },
          ],
        },
        away: {
          formation: '4-2-3-1',
          startingXI: [
            { number: 1, name: 'Starting Keeper', position: 'GK', rating: 7.2 },
            { number: 5, name: 'Center Back', position: 'CB', rating: 7.5 },
            { number: 7, name: 'Winger', position: 'RW', rating: 7.9 },
            { number: 9, name: 'Centre Forward', position: 'ST', rating: 8.0 },
          ],
        },
      },
      odds: {
        home: parseFloat((1.9 + Math.random() * 0.8).toFixed(2)),
        draw: parseFloat((3.1 + Math.random() * 0.4).toFixed(2)),
        away: parseFloat((2.8 + Math.random() * 1.2).toFixed(2)),
      },
    };
  } catch (err) {
    console.warn('Error parsing ESPN soccer event:', err);
    return null;
  }
}

export async function GET() {
  try {
    // Endpoints for real world soccer matches across worldwide leagues
    const endpoints = [
      'https://site.api.espn.com/apis/site/v2/sports/soccer/all/scoreboard',
      'https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard',
      'https://site.api.espn.com/apis/site/v2/sports/soccer/uefa.champions/scoreboard',
      'https://site.api.espn.com/apis/site/v2/sports/soccer/esp.1/scoreboard',
      'https://site.api.espn.com/apis/site/v2/sports/soccer/ita.1/scoreboard',
      'https://site.api.espn.com/apis/site/v2/sports/soccer/ger.1/scoreboard',
      'https://site.api.espn.com/apis/site/v2/sports/soccer/fra.1/scoreboard',
      'https://site.api.espn.com/apis/site/v2/sports/soccer/usa.1/scoreboard',
      'https://site.api.espn.com/apis/site/v2/sports/soccer/sau.1/scoreboard',
    ];

    const fetchPromises = endpoints.map((url) =>
      fetch(url, {
        next: { revalidate: 15 },
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) FOOTYLive/2.0',
        },
      })
        .then((res) => (res.ok ? res.json() : null))
        .catch(() => null)
    );

    const responses = await Promise.allSettled(fetchPromises);
    const rawEvents: any[] = [];

    responses.forEach((result) => {
      if (result.status === 'fulfilled' && result.value?.events) {
        rawEvents.push(...result.value.events);
      }
    });

    // Transform and deduplicate by match id
    const seenIds = new Set<string>();
    const liveMatches: Match[] = [];

    for (const ev of rawEvents) {
      if (seenIds.has(ev.id)) continue;
      seenIds.add(ev.id);
      const transformed = transformEspnEvent(ev);
      if (transformed) {
        liveMatches.push(transformed);
      }
    }

    // Sort matches: LIVE first, then upcoming, then finished
    liveMatches.sort((a, b) => {
      if (a.status === 'LIVE' && b.status !== 'LIVE') return -1;
      if (b.status === 'LIVE' && a.status !== 'LIVE') return 1;
      return 0;
    });

    return NextResponse.json({
      success: true,
      source: 'ESPN Live Satellite Global Telemetry',
      timestamp: new Date().toISOString(),
      totalMatches: liveMatches.length,
      liveCount: liveMatches.filter((m) => m.status === 'LIVE').length,
      matches: liveMatches,
    });
  } catch (err: any) {
    console.error('Failed to fetch live soccer scoreboard:', err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Failed to fetch live scores',
        matches: [],
      },
      { status: 503 }
    );
  }
}
