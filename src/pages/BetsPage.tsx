import { useState } from "react";
import { useMatches, useParticipants, useInvalidate } from "@/hooks/use-bolao-data";
import { fetchBets, upsertBet } from "@/lib/supabase-queries";
import { stageLabels } from "@/lib/supabase-queries";
import { Bet, Match } from "@/types/bolao";
import { calculateScore } from "@/lib/scoring";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClipboardEdit, Clock, Lock, Check, AlertTriangle, Trophy, CalendarDays, LayoutGrid } from "lucide-react";
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
  const { data: matches = [] } = useMatches();
  const { data: participants = [] } = useParticipants();
  const [selectedParticipant, setSelectedParticipant] = useState<string>("");
  const [viewMode, setViewMode] = useState<ViewMode>("date");
  const invalidate = useInvalidate();

  const { data: bets = [], refetch: refetchBets } = useQuery({
    queryKey: ["bets", selectedParticipant],
    queryFn: () => (selectedParticipant ? fetchBets(selectedParticipant) : Promise.resolve([])),
    enabled: !!selectedParticipant,
  });

  const [formState, setFormState] = useState<BetFormState>({});

  // Set first participant when loaded
  if (participants.length > 0 && !selectedParticipant) {
    setSelectedParticipant(participants[0].id);
  }

  const handleParticipantChange = (participantId: string) => {
    setSelectedParticipant(participantId);
    setFormState({});
  };

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

  const handleSaveBet = async (matchId: string) => {
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
    try {
      await upsertBet(matchId, selectedParticipant, parseInt(form.homeScore), parseInt(form.awayScore));
      toast.success("Palpite salvo!");
      refetchBets();
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

  const currentParticipant = participants.find((p) => p.id === selectedParticipant);

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
          <label className="text-sm font-medium text-muted-foreground shrink-0">Participante:</label>
          <Select value={selectedParticipant} onValueChange={handleParticipantChange}>
            <SelectTrigger className="w-full sm:w-64"><SelectValue placeholder="Selecione" /></SelectTrigger>
            <SelectContent>
              {participants.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
          {currentParticipant && playedMatches.length > 0 && (
            <span className="text-sm text-success font-semibold flex items-center gap-1">
              <Trophy className="h-3.5 w-3.5" /> {totalPointsFromBets} pts
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
          <TabsTrigger value="played">Encerrados ({playedMatches.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6 space-y-8">
          {renderMatchGrid(groupedUpcoming, "upcoming")}
        </TabsContent>

        <TabsContent value="played" className="mt-6 space-y-8">
          {renderMatchGrid(groupedPlayed, "played")}
        </TabsContent>
      </Tabs>
    </div>
  );
}
function BetCard({ match, open, saved, homeScore, awayScore, onScoreChange, onSave }: {
  match: Match; open: boolean; saved: boolean; homeScore: string; awayScore: string;
  onScoreChange: (field: "homeScore" | "awayScore", val: string) => void; onSave: () => void;
}) {
  return (
    <Card className={`glass p-4 transition-all ${open ? "hover:border-primary/30" : "opacity-70"}`}>
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
        {saved && <span className="text-xs text-success flex items-center gap-1"><Check className="h-3.5 w-3.5" /> Salvo</span>}
        <Button size="sm" onClick={onSave} disabled={!open}>{saved ? "Atualizar" : "Salvar"} Palpite</Button>
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
