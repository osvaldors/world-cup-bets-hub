import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchTeams,
  fetchMatches,
  fetchParticipants,
  fetchBets,
  fetchCupBracketMatches,
  computeParticipantPoints,
} from "@/lib/supabase-queries";
import { calculateScore } from "@/lib/scoring";
import { GroupStanding, Participant, Match, Bet } from "@/types/bolao";

export function computeCupGroupStandings(
  participants: Participant[],
  matches: Match[],
  bets: Bet[]
): Record<string, GroupStanding[]> {
  const cupGroups: Record<string, Participant[]> = {};
  participants.forEach((p) => {
    if (p.cupGroup) {
      if (!cupGroups[p.cupGroup]) cupGroups[p.cupGroup] = [];
      cupGroups[p.cupGroup].push(p);
    }
  });

  const groupStageMatches = matches.filter((m) => m.stage === "group");
  const wcGroups = [...new Set(groupStageMatches.map((m) => m.group).filter(Boolean))] as string[];
  const allRoundMatches: Match[][] = [[], [], []];
  wcGroups.forEach((g) => {
    const gMatches = groupStageMatches
      .filter((m) => m.group === g)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    allRoundMatches[0].push(...gMatches.slice(0, 2));
    allRoundMatches[1].push(...gMatches.slice(2, 4));
    allRoundMatches[2].push(...gMatches.slice(4, 6));
  });

  const result: Record<string, GroupStanding[]> = {};

  Object.entries(cupGroups).forEach(([cupGroup, ps]) => {
    if (ps.length < 4) return;

    const rounds = [
      [{ p1: ps[0], p2: ps[1] }, { p1: ps[2], p2: ps[3] }],
      [{ p1: ps[0], p2: ps[2] }, { p1: ps[1], p2: ps[3] }],
      [{ p1: ps[0], p2: ps[3] }, { p1: ps[1], p2: ps[2] }],
    ];

    const standingsMap = new Map<string, GroupStanding>();
    ps.forEach((p) => {
      standingsMap.set(p.id, {
        participant: p,
        points: 0, wins: 0, draws: 0, losses: 0,
        goalsFor: 0, goalsAgainst: 0, goalDifference: 0,
      });
    });

    rounds.forEach((matchups, roundIdx) => {
      const roundMatches = allRoundMatches[roundIdx];
      const anyPlayed = roundMatches.some((m) => m.played);
      if (!anyPlayed) return;

      const roundMatchIds = roundMatches.map((m) => m.id);
      matchups.forEach(({ p1, p2 }) => {
        const p1Points = roundMatchIds.reduce((sum, matchId) => {
          const match = matches.find((m) => m.id === matchId);
          const bet = bets.find((b) => b.matchId === matchId && b.participantId === p1.id);
          if (!match?.played || !bet || match.homeScore === undefined || match.awayScore === undefined) return sum;
          return sum + calculateScore(bet.homeScore, bet.awayScore, match.homeScore, match.awayScore).points;
        }, 0);

        const p2Points = roundMatchIds.reduce((sum, matchId) => {
          const match = matches.find((m) => m.id === matchId);
          const bet = bets.find((b) => b.matchId === matchId && b.participantId === p2.id);
          if (!match?.played || !bet || match.homeScore === undefined || match.awayScore === undefined) return sum;
          return sum + calculateScore(bet.homeScore, bet.awayScore, match.homeScore, match.awayScore).points;
        }, 0);

        const s1 = standingsMap.get(p1.id)!;
        const s2 = standingsMap.get(p2.id)!;
        s1.goalsFor += p1Points;
        s1.goalsAgainst += p2Points;
        s2.goalsFor += p2Points;
        s2.goalsAgainst += p1Points;

        if (p1Points > p2Points) {
          s1.wins++; s1.points += 3; s2.losses++;
        } else if (p2Points > p1Points) {
          s2.wins++; s2.points += 3; s1.losses++;
        } else {
          s1.draws++; s1.points += 1;
          s2.draws++; s2.points += 1;
        }
      });
    });

    const standings = ps.map((p) => {
      const s = standingsMap.get(p.id)!;
      s.goalDifference = s.goalsFor - s.goalsAgainst;
      return s;
    }).sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference || b.goalsFor - a.goalsFor);

    result[cupGroup] = standings;
  });

  return result;
}

export function useCupGroupStandings() {
  return useQuery({
    queryKey: ["cup-group-standings"],
    queryFn: async () => {
      const [participants, teams] = await Promise.all([fetchParticipants(), fetchTeams()]);
      const matches = await fetchMatches(teams);
      const bets = await fetchBets();
      return computeCupGroupStandings(participants, matches, bets);
    },
  });
}

export function useTeams() {
  return useQuery({ queryKey: ["teams"], queryFn: fetchTeams });
}

export function useMatches() {
  return useQuery({
    queryKey: ["matches"],
    queryFn: async () => {
      const teams = await fetchTeams();
      return fetchMatches(teams);
    },
  });
}

export function useParticipants() {
  return useQuery({ queryKey: ["participants"], queryFn: fetchParticipants });
}

export function useBets(participantId?: string) {
  return useQuery({
    queryKey: ["bets", participantId],
    queryFn: () => fetchBets(participantId),
  });
}

export function useAllBets() {
  return useQuery({
    queryKey: ["bets"],
    queryFn: () => fetchBets(),
  });
}

export function useCupBracketMatches() {
  return useQuery({
    queryKey: ["cup-bracket"],
    queryFn: async () => {
      const participants = await fetchParticipants();
      return fetchCupBracketMatches(participants);
    },
  });
}

export function useParticipantsWithPoints() {
  return useQuery({
    queryKey: ["participants-with-points"],
    queryFn: async () => {
      const [participants, teams] = await Promise.all([
        fetchParticipants(),
        fetchTeams(),
      ]);
      const matches = await fetchMatches(teams);
      const bets = await fetchBets();
      const pointsMap = await computeParticipantPoints(matches, bets);

      // Calcular estatísticas detalhadas para cada participante
      const participantsWithStats = participants.map((p) => {
        const stats = {
          exactScore: 0,
          winnerAndBalance: 0,
          winnerAndGoals: 0,
          correctWinner: 0,
          correctDraw: 0,
          correctGoals: 0,
          incorrect: 0,
        };

        // Buscar todas as apostas deste participante
        const participantBets = bets.filter((b) => b.participantId === p.id);

        participantBets.forEach((bet) => {
          const match = matches.find((m) => m.id === bet.matchId);
          if (!match?.played || match.homeScore === undefined || match.awayScore === undefined) {
            return;
          }

          const result = calculateScore(
            bet.homeScore,
            bet.awayScore,
            match.homeScore,
            match.awayScore
          );

          // Contar cada tipo de acerto baseado nos pontos
          if (result.points === 25) stats.exactScore++;
          else if (result.points === 18) stats.winnerAndBalance++;
          else if (result.points === 15 && result.label.includes("Gols")) stats.winnerAndGoals++;
          else if (result.points === 15) stats.correctDraw++;
          else if (result.points === 10) stats.correctWinner++;
          else if (result.points === 3) stats.correctGoals++;
          else stats.incorrect++;
        });

        return {
          ...p,
          totalPoints: pointsMap.get(p.id) || 0,
          leaguePoints: pointsMap.get(p.id) || 0,
          stats,
        };
      });

      return participantsWithStats;
    },
  });
}

export function useInvalidate() {
  const qc = useQueryClient();
  return (...keys: string[]) => {
    keys.forEach((k) => qc.invalidateQueries({ queryKey: [k] }));
  };
}