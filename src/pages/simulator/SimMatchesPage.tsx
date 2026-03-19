import { useEffect, useState } from "react";
import { useMatches, useAllBets, useParticipants } from "@/hooks/use-bolao-data";
import { useSimulator } from "@/contexts/SimulatorContext";
import { Match } from "@/types/bolao";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FlaskConical, RotateCcw, Check, X } from "lucide-react";
import { stageLabels } from "@/lib/supabase-queries";
import { motion } from "framer-motion";

const knockoutStages = ["round-of-32", "round-of-16", "quarter-final", "semi-final", "third-place", "final"];

export default function SimMatchesPage() {
  const { data: matches = [], isLoading: lm } = useMatches();
  const { data: bets = [], isLoading: lb } = useAllBets();
  const { data: participants = [], isLoading: lp } = useParticipants();
  const { setBaseData, simMatches, setMatchResult, clearMatchResult, resetAll, mergedMatches } = useSimulator();

  // Local editing state: matchId -> {home, away}
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<{ home: string; away: string }>({ home: "", away: "" });

  useEffect(() => {
    if (!lm && !lb && !lp) {
      setBaseData(matches, bets, participants);
    }
  }, [lm, lb, lp, matches, bets, participants, setBaseData]);

  if (lm || lb || lp) {
    return <div className="flex items-center justify-center py-20 text-muted-foreground">Carregando...</div>;
  }

  const startEdit = (m: Match) => {
    setEditing(m.id);
    const sim = simMatches[m.id];
    setDraft({
      home: (sim?.homeScore ?? m.homeScore)?.toString() ?? "",
      away: (sim?.awayScore ?? m.awayScore)?.toString() ?? "",
    });
  };

  const confirmEdit = (m: Match) => {
    const h = parseInt(draft.home);
    const a = parseInt(draft.away);
    if (!isNaN(h) && !isNaN(a)) {
      setMatchResult(m.id, h, a, true);
    }
    setEditing(null);
  };

  const clearEdit = (matchId: string) => {
    clearMatchResult(matchId);
    setEditing(null);
  };

  const renderRow = (m: Match) => {
    const isEditing = editing === m.id;
    const simmed = !!simMatches[m.id];
    const merged = mergedMatches.find((x) => x.id === m.id) ?? m;

    return (
      <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
        <Card className={`glass p-3 border ${simmed ? "border-amber-400/40 bg-amber-400/5" : ""}`}>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="px-1.5 py-0.5 rounded bg-muted">{stageLabels[m.stage] ?? m.stage}</span>
              <span>{new Date(m.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}</span>
              <span>{new Date(m.date).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span>
              {simmed && <span className="text-amber-400 font-medium">● simulado</span>}
            </div>

            <div className="flex items-center gap-2 flex-wrap justify-center">
              <span className="text-sm font-medium">{m.homeTeam.flag} {m.homeTeam.name}</span>

              {isEditing ? (
                <div className="flex items-center gap-1">
                  <Input type="number" min="0" className="w-14 h-7 text-center text-sm"
                    value={draft.home}
                    onChange={(e) => setDraft((d) => ({ ...d, home: e.target.value }))} />
                  <span className="text-muted-foreground text-xs">×</span>
                  <Input type="number" min="0" className="w-14 h-7 text-center text-sm"
                    value={draft.away}
                    onChange={(e) => setDraft((d) => ({ ...d, away: e.target.value }))} />
                </div>
              ) : (
                <span className="text-sm font-bold mx-2 min-w-[52px] text-center">
                  {merged.played ? `${merged.homeScore} × ${merged.awayScore}` : "- × -"}
                </span>
              )}

              <span className="text-sm font-medium">{m.awayTeam.name} {m.awayTeam.flag}</span>
            </div>

            <div className="flex items-center gap-1">
              {isEditing ? (
                <>
                  <Button size="sm" className="h-7 gradient-primary text-primary-foreground px-3"
                    onClick={() => confirmEdit(m)}>
                    <Check className="h-3 w-3 mr-1" /> OK
                  </Button>
                  <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => setEditing(null)}>
                    <X className="h-3 w-3" />
                  </Button>
                </>
              ) : (
                <>
                  <Button size="sm" variant="outline" className="h-7 px-3 text-xs"
                    onClick={() => startEdit(m)}>Simular</Button>
                  {simmed && (
                    <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-muted-foreground"
                      onClick={() => clearEdit(m.id)}>Reset</Button>
                  )}
                </>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    );
  };

  // Filter out knockout matches without assigned teams
  const validMatches = matches.filter(m =>
    m.stage === "group" || (m.homeTeam.id !== "tbd" && m.awayTeam.id !== "tbd")
  );
  const groupMatches = validMatches.filter((m) => m.stage === "group");
  const koMatches = validMatches.filter((m) => m.stage !== "group");
  const groupedByGroup = groupMatches.reduce<Record<string, Match[]>>((acc, m) => {
    const k = m.group ?? "?";
    (acc[k] = acc[k] ?? []).push(m);
    return acc;
  }, {});
  const groupedByStage = koMatches.reduce<Record<string, Match[]>>((acc, m) => {
    (acc[m.stage] = acc[m.stage] ?? []).push(m);
    return acc;
  }, {});

  const simCount = Object.keys(simMatches).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold flex items-center gap-3">
            <FlaskConical className="h-8 w-8 text-amber-400" />
            Simulador — Jogos
          </h1>
          <p className="text-muted-foreground mt-1">
            Simule resultados sem alterar os dados reais. {simCount > 0 && <span className="text-amber-400 font-medium">{simCount} jogo(s) simulado(s)</span>}
          </p>
        </div>
        {simCount > 0 && (
          <Button variant="outline" onClick={resetAll} className="text-amber-400 border-amber-400/40">
            <RotateCcw className="h-4 w-4 mr-2" /> Limpar Simulação
          </Button>
        )}
      </div>

      <Tabs defaultValue="groups" className="w-full">
        <TabsList className="glass flex-wrap">
          <TabsTrigger value="groups">Fase de Grupos</TabsTrigger>
          {knockoutStages.map((s) => groupedByStage[s] ? <TabsTrigger key={s} value={s}>{stageLabels[s]}</TabsTrigger> : null)}
        </TabsList>

        <TabsContent value="groups" className="mt-6 space-y-6">
          {Object.entries(groupedByGroup).sort(([a], [b]) => a.localeCompare(b)).map(([group, gms]) => (
            <div key={group}>
              <h3 className="font-heading font-semibold text-xs text-muted-foreground uppercase tracking-widest mb-3">Grupo {group}</h3>
              <div className="space-y-2">{gms.map(renderRow)}</div>
            </div>
          ))}
        </TabsContent>

        {knockoutStages.map((stage) => groupedByStage[stage] ? (
          <TabsContent key={stage} value={stage} className="mt-6">
            <div className="space-y-2">{groupedByStage[stage].map(renderRow)}</div>
          </TabsContent>
        ) : null)}
      </Tabs>
    </div>
  );
}
