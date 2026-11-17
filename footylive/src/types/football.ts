export interface MatchTeam {
  name: string;
  shortName: string;
  code: string;
  color: string;
  accentColor: string;
  logo: string;
  country: string;
  rank?: number;
}

export interface MatchScore {
  home: number;
  away: number;
}

export interface MatchEvent {
  id: string;
  type: 'goal' | 'yellow_card' | 'red_card' | 'sub' | 'penalty_miss';
  minute: number;
  player: string;
  team: 'home' | 'away';
  detail?: string;
}

export interface MatchStats {
  possession: [number, number];
  shots: [number, number];
  shotsOnTarget: [number, number];
  xG: [number, number];
  corners: [number, number];
  fouls: [number, number];
  yellowCards: [number, number];
  passes: [number, number];
  passAccuracy: [number, number];
}

export interface PlayerInfo {
  number: number;
  name: string;
  position: string;
  rating?: number;
}

export interface MatchLineup {
  home: {
    formation: string;
    startingXI: PlayerInfo[];
  };
  away: {
    formation: string;
    startingXI: PlayerInfo[];
  };
}

export interface MatchOdds {
  home: number;
  draw: number;
  away: number;
}

export interface Match {
  id: string;
  tournament: string;
  stage: string;
  homeTeam: MatchTeam;
  awayTeam: MatchTeam;
  score: MatchScore;
  minute: string;
  liveClockSeconds?: number;
  momentum?: number[];
  status: 'LIVE' | 'UPCOMING' | 'FINISHED' | 'HT';
  kickoffTime: string;
  kickoffDate: string;
  stadium: string;
  city: string;
  viewers?: string;
  streamQuality?: string;
  channels?: string[];
  cameraAngles?: { name: string; description: string }[];
  commentaryTracks?: { language: string; commentator: string }[];
  events?: MatchEvent[];
  stats: MatchStats;
  lineup?: MatchLineup;
  odds?: MatchOdds;
  highlightVideoUrl?: string;
}

export interface StandingItem {
  rank: number;
  team: string;
  logo?: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gd: number;
  points: number;
  form: ('W' | 'D' | 'L')[];
}

export interface TournamentFixture {
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  stage: string;
  stadium: string;
}

export interface Tournament {
  id: string;
  name: string;
  shortName: string;
  confederation: 'UEFA' | 'CONMEBOL' | 'CONCACAF' | 'AFC' | 'CAF' | 'FIFA';
  region: string;
  country: string;
  flag: string;
  tier: 'Club' | 'International';
  format?: string;
  teamsCount?: number;
  totalTeams?: number;
  venueCount?: number;
  officialBall?: string;
  broadcastPartners?: string[];
  defendingChampion: string;
  currentSeason: string;
  currentPhase: string;
  broadcastPass?: string;
  description?: string;
  standings?: StandingItem[];
  fixtures?: TournamentFixture[];
  topScorers?: {
    name: string;
    team: string;
    goals: number;
    assists: number;
  }[];
}

export interface BracketMatch {
  id: string;
  matchNumber?: number;
  team1: {
    name: string;
    score?: number;
    aggScore?: number;
    penalties?: number;
    isWinner?: boolean;
    flag?: string;
  };
  team2: {
    name: string;
    score?: number;
    aggScore?: number;
    penalties?: number;
    isWinner?: boolean;
    flag?: string;
  };
  status: 'COMPLETED' | 'LIVE' | 'SCHEDULED' | string;
  minute?: string;
  date?: string;
  stage?: string;
  venue?: string;
  notes?: string;
}

export interface BracketRound {
  title: string;
  matches: BracketMatch[];
}

export interface HighlightItem {
  id: string;
  title: string;
  subtitle?: string;
  match: string;
  tournament: string;
  duration: string;
  views: string;
  timeAgo?: string;
  date?: string;
  tag: 'EXTENDED' | 'ALL GOALS' | 'VIRAL' | 'TACTICAL' | 'PRESS' | string;
  hd?: boolean;
  quality?: string;
  thumbnailUrl: string;
  author?: string;
}
