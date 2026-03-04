export interface Team {
  id: string;
  name: string;
  flag: string; // emoji flag
  group?: string;
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore?: number;
  awayScore?: number;
  date: string;
  stage: MatchStage;
  group?: string;
  played: boolean;
}

export type MatchStage = 'group' | 'round-of-16' | 'quarter-final' | 'semi-final' | 'third-place' | 'final';

export interface Bet {
  id: string;
  matchId: string;
  participantId: string;
  homeScore: number;
  awayScore: number;
}

export interface Participant {
  id: string;
  name: string;
  avatar: string;
  totalPoints: number;
  leaguePoints: number;
  cupGroup?: string;
  cupEliminated: boolean;
}

export interface GroupStanding {
  participant: Participant;
  points: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

export interface CupBracketMatch {
  id: string;
  stage: MatchStage;
  participant1?: Participant;
  participant2?: Participant;
  score1?: number;
  score2?: number;
  winner?: Participant;
}

export interface ScoringResult {
  points: number;
  label: string;
  color: string;
}

export type BolaoMode = 'league' | 'cup';
