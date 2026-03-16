import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from "react";
import { Match, Bet, Participant, GroupStanding } from "@/types/bolao";
import { calculateScore } from "@/lib/scoring";
import { computeCupGroupStandings } from "@/hooks/use-bolao-data";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SimMatch {
  id: string;
  homeScore: number | undefined;
  awayScore: number | undefined;
  played: boolean;
}

export interface SimBet {
  matchId: string;
  participantId: string;
  homeScore: number;
  awayScore: number;
}

interface SimulatorCtx {
  // Base data (from DB, read-only source)
  baseMatches: Match[];
  baseBets: Bet[];
  participants: Participant[];
  setBaseData: (matches: Match[], bets: Bet[], participants: Participant[]) => void;

  // Simulated overrides
  simMatches: Record<string, SimMatch>;
  simBets: Record<string, SimBet>; // key = matchId:participantId
  setMatchResult: (matchId: string, homeScore: number | undefined, awayScore: number | undefined, played: boolean) => void;
  clearMatchResult: (matchId: string) => void;
  setSimBet: (matchId: string, participantId: string, home: number, away: number) => void;
  resetAll: () => void;

  // Derived merged data (base + overrides)
  mergedMatches: Match[];
  mergedBets: Bet[];

  // Computed
  leagueStandings: Array<Participant & { simPoints: number }>;
  cupGroupStandings: Record<string, GroupStanding[]>;
}

// ─── Helper: merge ─────────────────────────────────────────────────────────

function mergeMatches(baseMatches: Match[], simMatches: Record<string, SimMatch>): Match[] {
  return baseMatches.map((m) => {
    const s = simMatches[m.id];
    if (!s) return m;
    return {
      ...m,
      homeScore: s.homeScore,
      awayScore: s.awayScore,
      played: s.played,
    };
  });
}

function mergeBets(baseBets: Bet[], simBets: Record<string, SimBet>): Bet[] {
  const result = [...baseBets];
  Object.values(simBets).forEach((sb) => {
    const key = `${sb.matchId}:${sb.participantId}`;
    const idx = result.findIndex((b) => b.matchId === sb.matchId && b.participantId === sb.participantId);
    const bet: Bet = { id: key, matchId: sb.matchId, participantId: sb.participantId, homeScore: sb.homeScore, awayScore: sb.awayScore };
    if (idx >= 0) result[idx] = bet;
    else result.push(bet);
  });
  return result;
}

function computeLeague(
  participants: Participant[],
  matches: Match[],
  bets: Bet[]
): Array<Participant & { simPoints: number }> {
  const pointsMap = new Map<string, number>();
  for (const bet of bets) {
    const m = matches.find((x) => x.id === bet.matchId);
    if (!m?.played || m.homeScore === undefined || m.awayScore === undefined) continue;
    const pts = calculateScore(bet.homeScore, bet.awayScore, m.homeScore, m.awayScore).points;
    pointsMap.set(bet.participantId, (pointsMap.get(bet.participantId) ?? 0) + pts);
  }
  return participants
    .map((p) => ({ ...p, simPoints: pointsMap.get(p.id) ?? 0 }))
    .sort((a, b) => b.simPoints - a.simPoints);
}

// ─── Context ─────────────────────────────────────────────────────────────────

const SimulatorContext = createContext<SimulatorCtx | null>(null);

export function SimulatorProvider({ children }: { children: ReactNode }) {
  const [baseMatches, setBaseMatches] = useState<Match[]>([]);
  const [baseBets, setBaseBets] = useState<Bet[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [simMatches, setSimMatches] = useState<Record<string, SimMatch>>({});
  const [simBets, setSimBets] = useState<Record<string, SimBet>>({});

  const setBaseData = useCallback((matches: Match[], bets: Bet[], parts: Participant[]) => {
    setBaseMatches(matches);
    setBaseBets(bets);
    setParticipants(parts);
  }, []);

  const setMatchResult = useCallback((id: string, hs: number | undefined, as_: number | undefined, played: boolean) => {
    setSimMatches((prev) => ({
      ...prev,
      [id]: { id, homeScore: hs, awayScore: as_, played },
    }));
  }, []);

  const clearMatchResult = useCallback((id: string) => {
    setSimMatches((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const setSimBet = useCallback((matchId: string, participantId: string, home: number, away: number) => {
    const key = `${matchId}:${participantId}`;
    setSimBets((prev) => ({ ...prev, [key]: { matchId, participantId, homeScore: home, awayScore: away } }));
  }, []);

  const resetAll = useCallback(() => {
    setSimMatches({});
    setSimBets({});
  }, []);

  const mergedMatches = useMemo(() => mergeMatches(baseMatches, simMatches), [baseMatches, simMatches]);
  const mergedBets = useMemo(() => mergeBets(baseBets, simBets), [baseBets, simBets]);

  const leagueStandings = useMemo(
    () => computeLeague(participants, mergedMatches, mergedBets),
    [participants, mergedMatches, mergedBets]
  );

  const cupGroupStandings = useMemo(
    () => computeCupGroupStandings(participants, mergedMatches, mergedBets),
    [participants, mergedMatches, mergedBets]
  );

  return (
    <SimulatorContext.Provider value={{
      baseMatches, baseBets, participants, setBaseData,
      simMatches, simBets,
      setMatchResult, clearMatchResult, setSimBet, resetAll,
      mergedMatches, mergedBets,
      leagueStandings, cupGroupStandings,
    }}>
      {children}
    </SimulatorContext.Provider>
  );
}

export function useSimulator() {
  const ctx = useContext(SimulatorContext);
  if (!ctx) throw new Error("useSimulator must be used inside SimulatorProvider");
  return ctx;
}
