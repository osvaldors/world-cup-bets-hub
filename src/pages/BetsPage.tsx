import { useState, useEffect } from "react";
import { useMatches, useParticipants, useTeams, useInvalidate } from "@/hooks/use-bolao-data";
import { fetchBets, upsertBet, fetchSpecialBetByParticipant, upsertSpecialBet, fetchSpecialResults } from "@/lib/supabase-queries";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { stageLabels } from "@/lib/supabase-queries";
import { Bet, Match } from "@/types/bolao";
import { calculateScore, SCORING_RULES } from "@/lib/scoring";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClipboardEdit, Clock, Lock, Check, AlertTriangle, Trophy, CalendarDays, LayoutGrid, Crown, Star, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

const DEADLINE_MINUTES = 30;

type ViewMode = "date" | "group";

function isBetOpen(match: Match): boolean {
  const matchDate = new Date(match.date);
  const deadline = new Date(matchDate.getTime() - DEADLINE_MINUTES * 60 * 1000);
  return !match.played && new Date() < deadline;
}

function getDeadlineLabel(match: Match): string {
  if (match.played) return "Jogo encerrado";
  const matchDate = new Date(match.date);
  const deadline = new Date(matchDate.getTime() - DEADLINE_MINUTES * 60 * 1000);
  const now = new Date();
  if (now >= deadline) return "Prazo encerrado";
  const diff = deadline.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days > 0) return `Falta ${days}d ${hours}h`;
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `Falta ${hours}h ${mins}min`;
}

interface BetFormState {
  [matchId: string]: { homeScore: string; awayScore: string };
}

function groupMatchesByDate(matchList: Match[]): Record<string, Match[]> {
  const sorted = [...matchList].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return sorted.reduce<Record<string, Match[]>>((acc, m) => {
    const d = new Date(m.date);
    const dateKey = d.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(m);
    return acc;
  }, {});
}

function groupMatchesByGroup(matchList: Match[]): Record<string, Match[]> {
  return matchList.reduce<Record<string, Match[]>>((acc, m) => {
    const key = m.group ? `Grupo ${m.group}` : stageLabels[m.stage];
    if (!acc[key]) acc[key] = [];
    acc[key].push(m);
    return acc;
  }, {});
}

export default function BetsPage() {
  const { user, participantId, participant: authParticipant } = useAuth();
  const { data: matches = [] } = useMatches();
  const { data: participants = [] } = useParticipants();
  const { data: teams = [] } = useTeams();
  const [viewMode, setViewMode] = useState<ViewMode>("date");
  const invalidate = useInvalidate();

  const { data: bets = [], refetch: refetchBets } = useQuery({
    queryKey: ["bets", participantId],
    queryFn: () => (participantId ? fetchBets(participantId) : Promise.resolve([])),
    enabled: !!participantId,
  });

  const { data: specialBet, refetch: refetchSpecialBet } = useQuery({
    queryKey: ["special-bet", participantId],
    queryFn: () => (participantId ? fetchSpecialBetByParticipant(participantId) : Promise.resolve(null)),
    enabled: !!participantId,
  });

  const { data: specialResults } = useQuery({
    queryKey: ["special-results"],
    queryFn: fetchSpecialResults,
  });

  // Bloqueio fixo: 28/06/2026 às 16:00 BRT (19:00 UTC)
  const SPECIAL_BET_DEADLINE = new Date("2026-06-28T19:00:00Z");
  const groupStageFinished = new Date() >= SPECIAL_BET_DEADLINE;

  const [formState, setFormState] = useState<BetFormState>({});
  const [championTeamId, setChampionTeamId] = useState<string>("");
  const [topScorerName, setTopScorerName] = useState<string>("");

  // Sync special bet form when data loads
  useEffect(() => {
    if (specialBet) {
      setChampionTeamId(specialBet.champion_team_id || "");
      setTopScorerName(specialBet.top_scorer_name || "");
    } else {
      setChampionTeamId("");
      setTopScorerName("");
    }
  }, [specialBet]);

  // Update form state when bets load
  const initFormFromBets = () => {
    if (Object.keys(formState).length === 0 && bets.length > 0) {
      const state: BetFormState = {};
      bets.forEach((b) => {
        state[b.matchId] = { homeScore: String(b.homeScore), awayScore: String(b.awayScore) };
      });
      setFormState(state);
    }
  };
  initFormFromBets();

  const handleScoreChange = (matchId: string, field: "homeScore" | "awayScore", value: string) => {
    if (value !== "" && (!/^\d+$/.test(value) || parseInt(value) > 99)) return;
    setFormState((prev) => ({
      ...prev,
      [matchId]: { ...prev[matchId], [field]: value },
    }));
  };

  const [savingMatchId, setSavingMatchId] = useState<string | null>(null);

  const handleSaveBet = async (matchId: string) => {
    let currentParticipantId = participantId;
    console.log("handleSaveBet - Start", { participantId, userId: user?.id });

    if (!currentParticipantId && user) {
      // Try to fetch manually as fallback
      const { data, error } = await supabase.from('profiles').select('participant_id').eq('user_id', user.id).maybeSingle();
      console.log("handleSaveBet - Manual Fetch Result", { data, error });
      if (data?.participant_id) currentParticipantId = data.participant_id;
    }

    if (!currentParticipantId) {
      toast.error(`Erro: Seu perfil não possui um participante vinculado. (User: ${user?.id})`);
      return;
    }

    const match = matches.find((m) => m.id === matchId);
    if (!match || !isBetOpen(match)) {
      toast.error("Prazo encerrado para este jogo!");
      return;
    }
    const form = formState[matchId];
    if (!form || form.homeScore === "" || form.awayScore === "") {
      toast.error("Preencha ambos os placares!");
      return;
    }
    
    setSavingMatchId(matchId);
    try {
      await upsertBet(matchId, currentParticipantId, parseInt(form.homeScore), parseInt(form.awayScore));
      toast.success("Palpite para " + match.homeTeam.name + " x " + match.awayTeam.name + " salvo com sucesso!");
      refetchBets();
      invalidate("participants-with-points");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSavingMatchId(null);
    }
  };

  const handleSaveSpecialBet = async () => {
    if (!participantId) return;
    if (groupStageFinished) {
      toast.error("Prazo encerrado! A fase eliminatória já começou.");
      return;
    }
    if (!championTeamId && !topScorerName) {
      toast.error("Preencha pelo menos um palpite especial!");
      return;
    }
    try {
      await upsertSpecialBet(
        participantId,
        championTeamId || null,
        topScorerName || null
      );
      toast.success("Palpites especiais salvos!");
      refetchSpecialBet();
      invalidate("participants-with-points");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const hasBet = (matchId: string) => bets.some((b) => b.matchId === matchId);

  const upcomingMatches = matches.filter((m) => !m.played);
  const playedMatches = matches.filter((m) => m.played);

  const totalPointsFromBets = playedMatches.reduce((sum, match) => {
    const bet = bets.find(b => b.matchId === match.id);
    if (!bet || match.homeScore === undefined || match.awayScore === undefined) return sum;
    const result = calculateScore(bet.homeScore, bet.awayScore, match.homeScore, match.awayScore);
    return sum + result.points;
  }, 0);

  // Calculate special bet points
  let specialPoints = 0;
  if (specialBet && specialResults) {
    if (specialResults.champion_team_id && specialBet.champion_team_id === specialResults.champion_team_id) {
      specialPoints += SCORING_RULES.CHAMPION.points;
    }
    if (specialResults.top_scorer_name && specialBet.top_scorer_name &&
        specialResults.top_scorer_name.toLowerCase().trim() === specialBet.top_scorer_name.toLowerCase().trim()) {
      specialPoints += SCORING_RULES.TOP_SCORER.points;
    }
  }

  const currentParticipant = authParticipant;
  const participantName = currentParticipant?.name || user?.user_metadata?.display_name || user?.email?.split('@')[0] || "Aguardando...";

  const groupedUpcoming = viewMode === "date" ? groupMatchesByDate(upcomingMatches) : groupMatchesByGroup(upcomingMatches);
  const groupedPlayed = viewMode === "date" ? groupMatchesByDate(playedMatches) : groupMatchesByGroup(playedMatches);

  const renderMatchGrid = (grouped: Record<string, Match[]>, type: "upcoming" | "played") => {
    if (Object.keys(grouped).length === 0) {
      return <p className="text-muted-foreground text-center py-8">{type === "upcoming" ? "Nenhum jogo pendente" : "Nenhum jogo encerrado ainda"}</p>;
    }

    return Object.entries(grouped).map(([label, sectionMatches]) => (
      <div key={label}>
        <h3 className="font-heading font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">{label}</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {sectionMatches.map((match, i) => {
            if (type === "upcoming") {
              const open = isBetOpen(match);
              const saved = hasBet(match.id);
              return (
                <motion.div key={match.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                  <BetCard
                    match={match}
                    open={open}
                    saved={saved}
                    homeScore={formState[match.id]?.homeScore ?? ""}
                    awayScore={formState[match.id]?.awayScore ?? ""}
                    onScoreChange={(field, val) => handleScoreChange(match.id, field, val)}
                    onSave={() => handleSaveBet(match.id)}
                    isSaving={savingMatchId === match.id}
                  />
                </motion.div>
              );
            } else {
              const bet = bets.find((b) => b.matchId === match.id);
              return (
                <motion.div key={match.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <PlayedBetCard match={match} bet={bet} />
                </motion.div>
              );
            }
          })}
        </div>
      </div>
    ));
  };

  const selectedTeam = teams.find(t => t.id === championTeamId);

  const matchIdsWithBets = new Set(bets.map((b) => b.matchId));
  const bettedUpcomingMatches = upcomingMatches.filter((m) => matchIdsWithBets.has(m.id));
  const groupedBetted = viewMode === "date" ? groupMatchesByDate(bettedUpcomingMatches) : groupMatchesByGroup(bettedUpcomingMatches);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-heading text-3xl font-bold flex items-center gap-3">
          <ClipboardEdit className="h-8 w-8 text-primary" />
          Palpites
        </h1>
        <p className="text-muted-foreground mt-1">Registre seus palpites até 30 minutos antes de cada jogo</p>
      </div>

      <Card className="glass p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-muted-foreground shrink-0">Participante:</label>
            <span className="text-sm font-bold text-primary">{participantName}</span>
          </div>
          {currentParticipant && playedMatches.length > 0 && (
            <span className="text-sm text-success font-semibold flex items-center gap-1">
              <Trophy className="h-3.5 w-3.5" /> {totalPointsFromBets + specialPoints} pts
            </span>
          )}
          <div className="sm:ml-auto flex items-center gap-1 bg-muted rounded-md p-1">
            <Button
              size="sm"
              variant={viewMode === "date" ? "default" : "ghost"}
              className="h-7 px-2.5 text-xs gap-1.5"
              onClick={() => setViewMode("date")}
            >
              <CalendarDays className="h-3.5 w-3.5" /> Por Data
            </Button>
            <Button
              size="sm"
              variant={viewMode === "group" ? "default" : "ghost"}
              className="h-7 px-2.5 text-xs gap-1.5"
              onClick={() => setViewMode("group")}
            >
              <LayoutGrid className="h-3.5 w-3.5" /> Por Grupo
            </Button>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="glass">
          <TabsTrigger value="upcoming">A Jogar ({upcomingMatches.length})</TabsTrigger>
          <TabsTrigger value="betted" className="gap-1.5">
            <Check className="h-3.5 w-3.5" /> Palpitados ({bettedUpcomingMatches.length})
          </TabsTrigger>
          <TabsTrigger value="played">Encerrados ({playedMatches.length})</TabsTrigger>
          <TabsTrigger value="special" className="gap-1.5">
            <Crown className="h-3.5 w-3.5" /> Especiais
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6 space-y-8">
          {renderMatchGrid(groupedUpcoming, "upcoming")}
        </TabsContent>

        <TabsContent value="betted" className="mt-6 space-y-8">
          {renderMatchGrid(groupedBetted, "upcoming")}
        </TabsContent>

        <TabsContent value="played" className="mt-6 space-y-8">
          {renderMatchGrid(groupedPlayed, "played")}
        </TabsContent>

        <TabsContent value="special" className="mt-6">
          <div className="max-w-xl space-y-6">
            <Card className={`glass p-6 transition-all ${groupStageFinished ? "opacity-70" : ""}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-lg font-semibold flex items-center gap-2">
                  <Crown className="h-5 w-5 text-warning" /> Palpites Especiais
                </h3>
                {groupStageFinished ? (
                  <span className="text-xs text-destructive flex items-center gap-1">
                    <Lock className="h-3.5 w-3.5" /> Prazo encerrado
                  </span>
                ) : (
                  <span className="text-xs text-success flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> Aberto até início dos 16 avos
                  </span>
                )}
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-primary" />
                    Seleção Campeã
                    <span className="text-xs text-success font-bold ml-auto">+{SCORING_RULES.CHAMPION.points} pts</span>
                  </label>
                  <Select value={championTeamId} onValueChange={setChampionTeamId} disabled={groupStageFinished}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a seleção campeã">
                        {selectedTeam ? (
                          <span className="flex items-center gap-2">
                            <span>{selectedTeam.flag}</span> {selectedTeam.name}
                          </span>
                        ) : undefined}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          <span className="flex items-center gap-2">
                            <span>{t.flag}</span> {t.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {specialBet?.champion_team_id && specialResults?.champion_team_id && (
                    <div className={`text-xs p-2 rounded ${
                      specialBet.champion_team_id === specialResults.champion_team_id
                        ? "bg-success/10 text-success"
                        : "bg-destructive/10 text-destructive"
                    }`}>
                      {specialBet.champion_team_id === specialResults.champion_team_id
                        ? `✅ Acertou! +${SCORING_RULES.CHAMPION.points} pts`
                        : "❌ Errou o campeão"}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Star className="h-4 w-4 text-warning" />
                    Artilheiro da Copa
                    <span className="text-xs text-success font-bold ml-auto">+{SCORING_RULES.TOP_SCORER.points} pts</span>
                  </label>
                  <Input
                    placeholder="Nome do jogador artilheiro"
                    value={topScorerName}
                    onChange={(e) => setTopScorerName(e.target.value)}
                    disabled={groupStageFinished}
                  />
                  {specialBet?.top_scorer_name && specialResults?.top_scorer_name && (
                    <div className={`text-xs p-2 rounded ${
                      specialResults.top_scorer_name.toLowerCase().trim() === specialBet.top_scorer_name.toLowerCase().trim()
                        ? "bg-success/10 text-success"
                        : "bg-destructive/10 text-destructive"
                    }`}>
                      {specialResults.top_scorer_name.toLowerCase().trim() === specialBet.top_scorer_name.toLowerCase().trim()
                        ? `✅ Acertou! +${SCORING_RULES.TOP_SCORER.points} pts`
                        : `❌ Errou o artilheiro (resultado: ${specialResults.top_scorer_name})`}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 flex items-center justify-end gap-2">
                {specialBet && (
                  <span className="text-xs text-success flex items-center gap-1">
                    <Check className="h-3.5 w-3.5" /> Palpite registrado
                  </span>
                )}
                <Button onClick={handleSaveSpecialBet} disabled={groupStageFinished}>
                  {specialBet ? "Atualizar" : "Salvar"} Palpites Especiais
                </Button>
              </div>
            </Card>

            <div className="p-3 rounded-lg bg-muted/50 border border-border text-sm text-muted-foreground">
              <p><strong>ℹ️ Regras dos palpites especiais:</strong></p>
              <ul className="mt-1.5 space-y-1 text-xs">
                <li>• Cada acerto vale <strong>20 pontos</strong></li>
                <li>• Prazo: até antes do início dos 16 avos de final</li>
                <li>• <strong>Modo Liga:</strong> pontos somam para todos</li>
                <li>• <strong>Modo Copa:</strong> pontos contam apenas para quem chegar à final</li>
              </ul>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function BetCard({ match, open, saved, homeScore, awayScore, onScoreChange, onSave, isSaving }: {
  match: Match; open: boolean; saved: boolean; homeScore: string; awayScore: string;
  onScoreChange: (field: "homeScore" | "awayScore", val: string) => void; onSave: () => void;
  isSaving?: boolean;
}) {
  return (
    <Card className={`glass p-4 transition-all ${open ? "hover:border-primary/30" : "opacity-70"} ${isSaving ? "ring-2 ring-primary/20" : ""}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{new Date(match.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}</span>
          {match.group && <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">Grupo {match.group}</span>}
          {match.stage !== "group" && <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">{stageLabels[match.stage]}</span>}
        </div>
        <div className="flex items-center gap-1.5">
          {open ? (
            <><Clock className="h-3.5 w-3.5 text-warning" /><span className="text-xs text-warning font-medium">{getDeadlineLabel(match)}</span></>
          ) : (
            <><Lock className="h-3.5 w-3.5 text-muted-foreground" /><span className="text-xs text-muted-foreground">Bloqueado</span></>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-xl">{match.homeTeam.flag}</span>
          <span className="text-sm font-medium truncate">{match.homeTeam.name}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Input type="text" inputMode="numeric" className="w-12 h-10 text-center text-lg font-bold p-0" value={homeScore} onChange={(e) => onScoreChange("homeScore", e.target.value)} disabled={!open} maxLength={2} />
          <span className="text-muted-foreground text-sm font-bold">×</span>
          <Input type="text" inputMode="numeric" className="w-12 h-10 text-center text-lg font-bold p-0" value={awayScore} onChange={(e) => onScoreChange("awayScore", e.target.value)} disabled={!open} maxLength={2} />
        </div>
        <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
          <span className="text-sm font-medium truncate">{match.awayTeam.name}</span>
          <span className="text-xl">{match.awayTeam.flag}</span>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-end gap-2">
        {saved && !isSaving && <span className="text-xs text-success flex items-center gap-1"><Check className="h-3.5 w-3.5" /> Salvo</span>}
        <Button size="sm" onClick={onSave} disabled={!open || isSaving}>
          {isSaving ? (
            <><Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> Salvando...</>
          ) : (
            <>{saved ? "Atualizar" : "Salvar"} Palpite</>
          )}
        </Button>
      </div>
    </Card>
  );
}

function getScoreColorClass(color: string): string {
  switch (color) {
    case "success": return "bg-success/10 border-success/20 text-success";
    case "primary": return "bg-primary/10 border-primary/20 text-primary";
    case "warning": return "bg-warning/10 border-warning/20 text-warning";
    case "muted": return "bg-muted border-border text-muted-foreground";
    case "destructive": return "bg-destructive/10 border-destructive/20 text-destructive";
    default: return "bg-muted";
  }
}

function PlayedBetCard({ match, bet }: { match: Match; bet?: Bet }) {
  const scoringResult = bet && match.homeScore !== undefined && match.awayScore !== undefined
    ? calculateScore(bet.homeScore, bet.awayScore, match.homeScore, match.awayScore)
    : null;

  return (
    <Card className="glass p-4 opacity-90">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{new Date(match.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}</span>
          {match.group && <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">Grupo {match.group}</span>}
        </div>
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-success/10 text-success">Encerrado</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-xl">{match.homeTeam.flag}</span>
          <span className="text-sm font-medium truncate">{match.homeTeam.name}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-lg font-bold min-w-[24px] text-center">{match.homeScore}</span>
          <span className="text-muted-foreground text-xs">×</span>
          <span className="text-lg font-bold min-w-[24px] text-center">{match.awayScore}</span>
        </div>
        <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
          <span className="text-sm font-medium truncate">{match.awayTeam.name}</span>
          <span className="text-xl">{match.awayTeam.flag}</span>
        </div>
      </div>
      <div className={`mt-3 p-2.5 rounded-lg text-sm border ${bet ? scoringResult ? getScoreColorClass(scoringResult.color) : "bg-muted" : "bg-destructive/10 border-destructive/20"}`}>
        {bet ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Palpite:</span>
              <span className="font-bold">{bet.homeScore} × {bet.awayScore}</span>
            </div>
            {scoringResult && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium px-2 py-0.5 rounded-full border bg-background/50">{scoringResult.label}</span>
                <span className="font-bold text-lg">+{scoringResult.points}</span>
              </div>
            )}
          </div>
        ) : (
          <span className="flex items-center gap-1.5 text-destructive">
            <AlertTriangle className="h-3.5 w-3.5" /> Sem palpite registrado — 0 pts
          </span>
        )}
      </div>
    </Card>
  );
}
