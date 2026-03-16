import { useSimulator } from "@/contexts/SimulatorContext";
import { CupBracketMatch, Participant } from "@/types/bolao";
import { FlaskConical, GitBranch } from "lucide-react";
import { calculateScore } from "@/lib/scoring";

// Helper to calculate simulated points for a set of stages
function getSimulatedPointsForParticipant(
  participant: Participant | undefined,
  stages: string[],
  matches: any[],
  bets: any[]
): number {
  if (!participant) return 0;
  const stageMatchIds = matches.filter((m) => stages.includes(m.stage)).map((m) => m.id);
  return stageMatchIds.reduce((sum, matchId) => {
    const m = matches.find((x) => x.id === matchId);
    const bet = bets.find((b) => b.matchId === matchId && b.participantId === participant.id);
    if (!m?.played || !bet || m.homeScore === undefined || m.awayScore === undefined) return sum;
    return sum + calculateScore(bet.homeScore, bet.awayScore, m.homeScore, m.awayScore).points;
  }, 0);
}

const bracketScoringStages: Record<string, string[]> = {
  "qf": ["round-of-32", "round-of-16"], // Stages that count for Quarters
  "sf": ["quarter-final", "semi-final"],
  "final": ["third-place", "final"],
};

function SimBracketCard({
  title,
  p1,
  p2,
  scoringStages,
  matches,
  bets
}: {
  title?: string;
  p1: Participant | undefined;
  p2: Participant | undefined;
  scoringStages: string[];
  matches: any[];
  bets: any[];
}) {
  const pts1 = getSimulatedPointsForParticipant(p1, scoringStages, matches, bets);
  const pts2 = getSimulatedPointsForParticipant(p2, scoringStages, matches, bets);
  const winnerId = pts1 > pts2 ? p1?.id : pts2 > pts1 ? p2?.id : undefined;

  return (
    <div className="glass rounded-lg p-3 w-52 space-y-1 border border-border/50">
      {title && <div className="text-[10px] text-muted-foreground mb-1 uppercase tracking-tighter">{title}</div>}
      <div className={`flex items-center justify-between p-1.5 rounded ${winnerId === p1?.id ? "bg-primary/20 ring-1 ring-primary/30" : ""}`}>
        <span className="text-xs font-medium truncate">{p1?.name || "A definir"}</span>
        <span className="text-xs font-bold ml-2">{pts1}</span>
      </div>
      <div className={`flex items-center justify-between p-1.5 rounded ${winnerId === p2?.id ? "bg-primary/20 ring-1 ring-primary/30" : ""}`}>
        <span className="text-xs font-medium truncate">{p2?.name || "A definir"}</span>
        <span className="text-xs font-bold ml-2">{pts2}</span>
      </div>
    </div>
  );
}

export default function SimBracketPage() {
  const { cupGroupStandings, mergedMatches, mergedBets } = useSimulator();

  // Get top 2 from each group
  const getTop = (group: string, rank: number) => cupGroupStandings[group]?.[rank - 1]?.participant;

  const q1 = { p1: getTop("A", 1), p2: getTop("B", 2), title: "QF 1" };
  const q2 = { p1: getTop("C", 1), p2: getTop("D", 2), title: "QF 2" };
  const q3 = { p1: getTop("B", 1), p2: getTop("A", 2), title: "QF 3" };
  const q4 = { p1: getTop("D", 1), p2: getTop("C", 2), title: "QF 4" };

  const getWinner = (p1: Participant | undefined, p2: Participant | undefined, stages: string[]) => {
    const pts1 = getSimulatedPointsForParticipant(p1, stages, mergedMatches, mergedBets);
    const pts2 = getSimulatedPointsForParticipant(p2, stages, mergedMatches, mergedBets);
    if (pts1 === 0 && pts2 === 0) return undefined;
    return pts1 >= pts2 ? p1 : p2;
  };

  const s1p1 = getWinner(q1.p1, q1.p2, bracketScoringStages.qf);
  const s1p2 = getWinner(q2.p1, q2.p2, bracketScoringStages.qf);
  const s2p1 = getWinner(q3.p1, q3.p2, bracketScoringStages.qf);
  const s2p2 = getWinner(q4.p1, q4.p2, bracketScoringStages.qf);

  const finalP1 = getWinner(s1p1, s1p2, bracketScoringStages.sf);
  const finalP2 = getWinner(s2p1, s2p2, bracketScoringStages.sf);

  return (
    <div className="space-y-6 animate-fade-in overflow-hidden">
      <div>
        <h1 className="font-heading text-3xl font-bold flex items-center gap-3">
          <FlaskConical className="h-7 w-7 text-amber-400" />
          <GitBranch className="h-7 w-7 text-primary" />
          Simulador — Chaveamento
        </h1>
        <p className="text-muted-foreground mt-1">
          Visualização automática do mata-mata baseada na classificação simulada
        </p>
      </div>

      <div className="overflow-x-auto pb-8">
        <div className="min-w-[800px] flex items-center gap-8 py-4">
          {/* QUARTERS */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-heading font-semibold text-muted-foreground uppercase tracking-widest text-center">Quartas</h3>
            {[q1, q2, q3, q4].map((q, i) => (
              <SimBracketCard key={i} {...q} scoringStages={bracketScoringStages.qf} matches={mergedMatches} bets={mergedBets} />
            ))}
          </div>

          {/* CONNECTORS Q -> S */}
          <div className="flex flex-col justify-around h-[380px] text-border py-8">
            <div className="w-8 h-20 border-r-2 border-t-2 border-b-2 border-border rounded-r-lg" />
            <div className="w-8 h-20 border-r-2 border-t-2 border-b-2 border-border rounded-r-lg" />
          </div>

          {/* SEMIS */}
          <div className="space-y-32">
            <h3 className="text-[10px] font-heading font-semibold text-muted-foreground uppercase tracking-widest text-center">Semifinais</h3>
            <SimBracketCard p1={s1p1} p2={s1p2} scoringStages={bracketScoringStages.sf} matches={mergedMatches} bets={mergedBets} />
            <SimBracketCard p1={s2p1} p2={s2p2} scoringStages={bracketScoringStages.sf} matches={mergedMatches} bets={mergedBets} />
          </div>

          {/* CONNECTORS S -> F */}
          <div className="flex flex-col justify-center h-[380px]">
            <div className="w-8 h-40 border-r-2 border-t-2 border-b-2 border-border rounded-r-lg" />
          </div>

          {/* FINAL */}
          <div className="space-y-8">
            <h3 className="text-[10px] font-heading font-semibold text-primary uppercase tracking-widest text-center">🏆 Final</h3>
            <SimBracketCard p1={finalP1} p2={finalP2} scoringStages={bracketScoringStages.final} matches={mergedMatches} bets={mergedBets} />
          </div>
        </div>
      </div>
      
      <div className="glass p-4 text-xs text-muted-foreground leading-relaxed">
        <p><strong>Nota:</strong> Este chaveamento é calculado dinamicamente em memória.</p>
        <p>A classificação do Grupo depende dos jogos simulados na aba <strong>Jogos</strong>.</p>
        <p>O avanço no mata-mata depende da soma de pontos dos participantes nos jogos reais/simulados da Copa do Mundo.</p>
      </div>
    </div>
  );
}
