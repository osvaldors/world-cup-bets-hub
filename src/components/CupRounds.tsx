import { useMatches, useParticipants, useAllBets } from "@/hooks/use-bolao-data";
import { calculateScore } from "@/lib/scoring";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Match, Participant } from "@/types/bolao";
import { motion } from "framer-motion";

interface CupMatchup {
  p1: Participant;
  p2: Participant;
  p1Points: number;
  p2Points: number;
}

function MatchupCard({ matchup, idx }: { matchup: CupMatchup; idx: number }) {
  const { p1, p2, p1Points, p2Points } = matchup;
  const p1Wins = p1Points > p2Points;
  const p2Wins = p2Points > p1Points;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
      <Card className="glass p-4">
        <div className="flex items-center gap-3">
          <div className={`flex-1 text-right ${p1Wins ? "font-bold" : ""}`}>
            <p className="text-sm font-medium">{p1.name}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-lg font-heading font-bold min-w-[32px] text-right ${p1Wins ? "text-primary" : "text-muted-foreground"}`}>{p1Points}</span>
            <span className="text-xs text-muted-foreground">×</span>
            <span className={`text-lg font-heading font-bold min-w-[32px] text-left ${p2Wins ? "text-primary" : "text-muted-foreground"}`}>{p2Points}</span>
          </div>
          <div className={`flex-1 ${p2Wins ? "font-bold" : ""}`}>
            <p className="text-sm font-medium">{p2.name}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export function CupRounds() {
  const { data: matches = [] } = useMatches();
  const { data: participants = [] } = useParticipants();
  const { data: bets = [] } = useAllBets();

  // Group participants by cup group
  const cupGroups: Record<string, Participant[]> = {};
  participants.forEach((p) => {
    if (p.cupGroup) {
      if (!cupGroups[p.cupGroup]) cupGroups[p.cupGroup] = [];
      cupGroups[p.cupGroup].push(p);
    }
  });

  // Get group stage matches organized by round
  const groups = [...new Set(matches.filter(m => m.stage === "group").map(m => m.group).filter(Boolean))] as string[];
  const groupMatchesByRound: Record<string, Match[][]> = {};
  groups.forEach((g) => {
    const gMatches = matches.filter((m) => m.stage === "group" && m.group === g).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    groupMatchesByRound[g] = [gMatches.slice(0, 2), gMatches.slice(2, 4), gMatches.slice(4, 6)];
  });

  const allGroupRounds = Object.values(groupMatchesByRound);
  const roundMatchIds = [0, 1, 2].map((r) => allGroupRounds.flatMap((gr) => (gr[r] || []).map((m) => m.id)));

  function getPointsForMatches(participant: Participant, matchIds: string[]): number {
    return matchIds.reduce((sum, matchId) => {
      const match = matches.find((m) => m.id === matchId);
      const bet = bets.find((b) => b.matchId === matchId && b.participantId === participant.id);
      if (!match?.played || !bet || match.homeScore === undefined || match.awayScore === undefined) return sum;
      const result = calculateScore(bet.homeScore, bet.awayScore, match.homeScore, match.awayScore);
      return sum + result.points;
    }, 0);
  }

  // Build confrontations
  const confrontations: Record<string, { round: number; matchups: CupMatchup[] }[]> = {};
  Object.entries(cupGroups).forEach(([cupGroup, ps]) => {
    if (ps.length < 4) return;
    const rounds = [
      [{ p1: ps[0], p2: ps[1] }, { p1: ps[2], p2: ps[3] }],
      [{ p1: ps[0], p2: ps[2] }, { p1: ps[1], p2: ps[3] }],
      [{ p1: ps[0], p2: ps[3] }, { p1: ps[1], p2: ps[2] }],
    ];
    confrontations[cupGroup] = rounds.map((matchups, roundIdx) => ({
      round: roundIdx + 1,
      matchups: matchups.map(({ p1, p2 }) => ({
        p1, p2,
        p1Points: getPointsForMatches(p1, roundMatchIds[roundIdx]),
        p2Points: getPointsForMatches(p2, roundMatchIds[roundIdx]),
      })),
    }));
  });

  const knockoutRounds = [
    { label: "Quartas de Final", description: "Pontos dos palpites: 16 Avos + Oitavas", wcStages: ["round-of-32", "round-of-16"] },
    { label: "Semifinais", description: "Pontos dos palpites: Quartas + Semifinais da Copa", wcStages: ["quarter-final", "semi-final"] },
    { label: "Final / 3º Lugar", description: "Pontos dos palpites: Final + 3º Lugar da Copa", wcStages: ["third-place", "final"] },
  ].map((round) => ({
    ...round,
    matchIds: matches.filter((m) => round.wcStages.includes(m.stage)).map((m) => m.id),
  }));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading text-lg font-semibold mb-4">Fase de Grupos — Confrontos</h2>
        {Object.keys(confrontations).length === 0 ? (
          <p className="text-muted-foreground text-sm">Cadastre participantes com grupo da copa para ver os confrontos</p>
        ) : (
          <Tabs defaultValue="1" className="w-full">
            <TabsList className="glass">
              <TabsTrigger value="1">Rodada 1</TabsTrigger>
              <TabsTrigger value="2">Rodada 2</TabsTrigger>
              <TabsTrigger value="3">Rodada 3</TabsTrigger>
            </TabsList>
            {[1, 2, 3].map((round) => (
              <TabsContent key={round} value={String(round)} className="mt-4">
                <p className="text-xs text-muted-foreground mb-4">Pontos baseados nos palpites da {round}ª rodada da fase de grupos da Copa do Mundo</p>
                <div className="grid md:grid-cols-2 gap-6">
                  {Object.entries(confrontations)
                    .sort(([groupA], [groupB]) => groupA.localeCompare(groupB))
                    .map(([cupGroup, rounds]) => {
                    const roundData = rounds[round - 1];
                    if (!roundData) return null;
                    return (
                      <div key={cupGroup}>
                        <h3 className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wider mb-2">Grupo {cupGroup}</h3>
                        <div className="space-y-2">
                          {roundData.matchups.map((matchup, i) => <MatchupCard key={i} matchup={matchup} idx={i} />)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>

      <div>
        <h2 className="font-heading text-lg font-semibold mb-4">Mata-Mata — Regras de Pontuação</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {knockoutRounds.map((round, i) => (
            <motion.div key={round.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="glass p-4 h-full">
                <h3 className="font-heading font-semibold text-primary text-sm mb-2">{round.label}</h3>
                <p className="text-xs text-muted-foreground">{round.description}</p>
                <p className="text-xs text-muted-foreground mt-2">{round.matchIds.length} jogos na somatória</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
