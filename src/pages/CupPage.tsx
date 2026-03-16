import { Trophy } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GroupTable } from "@/components/GroupTable";
import { CupBracket } from "@/components/CupBracket";
import { CupRounds } from "@/components/CupRounds";
import { useParticipants, useMatches, useAllBets } from "@/hooks/use-bolao-data";
import { calculateScore } from "@/lib/scoring";
import { GroupStanding, Participant, Match, Bet } from "@/types/bolao";

function computeCupGroupStandings(
  participants: Participant[],
  matches: Match[],
  bets: Bet[]
): Record<string, GroupStanding[]> {
  // Group participants by cupGroup
  const cupGroups: Record<string, Participant[]> = {};
  participants.forEach((p) => {
    if (p.cupGroup) {
      if (!cupGroups[p.cupGroup]) cupGroups[p.cupGroup] = [];
      cupGroups[p.cupGroup].push(p);
    }
  });

  const groupStageMatches = matches.filter((m) => m.stage === "group");
  
  // Get WC group match rounds
  const wcGroups = [...new Set(groupStageMatches.map(m => m.group).filter(Boolean))] as string[];
  const allRoundMatches: Match[][] = [[], [], []];
  wcGroups.forEach((g) => {
    const gMatches = groupStageMatches.filter(m => m.group === g).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    allRoundMatches[0].push(...gMatches.slice(0, 2));
    allRoundMatches[1].push(...gMatches.slice(2, 4));
    allRoundMatches[2].push(...gMatches.slice(4, 6));
  });

  const result: Record<string, GroupStanding[]> = {};

  Object.entries(cupGroups).forEach(([cupGroup, ps]) => {
    if (ps.length < 4) return;

    // 3 rounds of matchups
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
      const anyPlayed = roundMatches.some(m => m.played);
      if (!anyPlayed) return;

      const roundMatchIds = roundMatches.map(m => m.id);
      
      matchups.forEach(({ p1, p2 }) => {
        const p1Points = roundMatchIds.reduce((sum, matchId) => {
          const match = matches.find(m => m.id === matchId);
          const bet = bets.find(b => b.matchId === matchId && b.participantId === p1.id);
          if (!match?.played || !bet || match.homeScore === undefined || match.awayScore === undefined) return sum;
          return sum + calculateScore(bet.homeScore, bet.awayScore, match.homeScore, match.awayScore).points;
        }, 0);
        
        const p2Points = roundMatchIds.reduce((sum, matchId) => {
          const match = matches.find(m => m.id === matchId);
          const bet = bets.find(b => b.matchId === matchId && b.participantId === p2.id);
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
          s1.wins++; s1.points += 3;
          s2.losses++;
        } else if (p2Points > p1Points) {
          s2.wins++; s2.points += 3;
          s1.losses++;
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

export default function CupPage() {
  const { data: participants = [], isLoading: lp } = useParticipants();
  const { data: matches = [], isLoading: lm } = useMatches();
  const { data: bets = [], isLoading: lb } = useAllBets();

  if (lp || lm || lb) {
    return <div className="flex items-center justify-center py-20 text-muted-foreground">Carregando...</div>;
  }

  const cupGroupStandings = computeCupGroupStandings(participants, matches, bets);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-heading text-3xl font-bold flex items-center gap-3">
          <Trophy className="h-8 w-8 text-primary" />
          Copa do Bolão
        </h1>
        <p className="text-muted-foreground mt-1">Fase de grupos, confrontos e mata-mata entre os participantes</p>
      </div>

      <Tabs defaultValue="rounds" className="w-full">
        <TabsList className="glass">
          <TabsTrigger value="rounds">Confrontos</TabsTrigger>
          <TabsTrigger value="groups">Classificação</TabsTrigger>
          <TabsTrigger value="bracket">Chaveamento</TabsTrigger>
        </TabsList>

        <TabsContent value="rounds" className="mt-6">
          <CupRounds />
        </TabsContent>

        <TabsContent value="groups" className="mt-6">
          {Object.keys(cupGroupStandings).length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Cadastre participantes com grupo da copa para ver a classificação</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(cupGroupStandings)
                .sort(([groupA], [groupB]) => groupA.localeCompare(groupB))
                .map(([group, standings]) => (
                <GroupTable key={group} group={group} standings={standings} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="bracket" className="mt-6">
          <CupBracket />
        </TabsContent>
      </Tabs>
    </div>
  );
}
