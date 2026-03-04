import { useState } from "react";
import { matches, participants, sampleBets, stageLabels } from "@/data/mockData";
import { Bet, Match } from "@/types/bolao";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClipboardEdit, Clock, Lock, Check, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const DEADLINE_MINUTES = 30;

function isBetOpen(match: Match): boolean {
  const matchDate = new Date(match.date + "T15:00:00");
  const deadline = new Date(matchDate.getTime() - DEADLINE_MINUTES * 60 * 1000);
  return !match.played && new Date() < deadline;
}

function getDeadlineLabel(match: Match): string {
  if (match.played) return "Jogo encerrado";
  const matchDate = new Date(match.date + "T15:00:00");
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

export default function BetsPage() {
  const [selectedParticipant, setSelectedParticipant] = useState(participants[0].id);
  const [bets, setBets] = useState<Bet[]>([...sampleBets]);
  const [formState, setFormState] = useState<BetFormState>(() => {
    const state: BetFormState = {};
    matches.forEach((m) => {
      const existing = sampleBets.find(
        (b) => b.matchId === m.id && b.participantId === participants[0].id
      );
      state[m.id] = {
        homeScore: existing ? String(existing.homeScore) : "",
        awayScore: existing ? String(existing.awayScore) : "",
      };
    });
    return state;
  });

  const handleParticipantChange = (participantId: string) => {
    setSelectedParticipant(participantId);
    const state: BetFormState = {};
    matches.forEach((m) => {
      const existing = bets.find(
        (b) => b.matchId === m.id && b.participantId === participantId
      );
      state[m.id] = {
        homeScore: existing ? String(existing.homeScore) : "",
        awayScore: existing ? String(existing.awayScore) : "",
      };
    });
    setFormState(state);
  };

  const handleScoreChange = (matchId: string, field: "homeScore" | "awayScore", value: string) => {
    if (value !== "" && (!/^\d+$/.test(value) || parseInt(value) > 99)) return;
    setFormState((prev) => ({
      ...prev,
      [matchId]: { ...prev[matchId], [field]: value },
    }));
  };

  const handleSaveBet = (matchId: string) => {
    const match = matches.find((m) => m.id === matchId);
    if (!match || !isBetOpen(match)) {
      toast.error("Prazo encerrado para este jogo!");
      return;
    }
    const { homeScore, awayScore } = formState[matchId];
    if (homeScore === "" || awayScore === "") {
      toast.error("Preencha ambos os placares!");
      return;
    }
    const existingIdx = bets.findIndex(
      (b) => b.matchId === matchId && b.participantId === selectedParticipant
    );
    const newBet: Bet = {
      id: `bet-${matchId}-${selectedParticipant}`,
      matchId,
      participantId: selectedParticipant,
      homeScore: parseInt(homeScore),
      awayScore: parseInt(awayScore),
    };
    if (existingIdx >= 0) {
      const updated = [...bets];
      updated[existingIdx] = newBet;
      setBets(updated);
      toast.success("Palpite atualizado!");
    } else {
      setBets([...bets, newBet]);
      toast.success("Palpite registrado!");
    }
  };

  const hasBet = (matchId: string) =>
    bets.some((b) => b.matchId === matchId && b.participantId === selectedParticipant);

  const upcomingMatches = matches.filter((m) => !m.played);
  const playedMatches = matches.filter((m) => m.played);

  const currentParticipant = participants.find((p) => p.id === selectedParticipant);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-heading text-3xl font-bold flex items-center gap-3">
          <ClipboardEdit className="h-8 w-8 text-primary" />
          Palpites
        </h1>
        <p className="text-muted-foreground mt-1">
          Registre seus palpites até 30 minutos antes de cada jogo
        </p>
      </div>

      {/* Participant selector */}
      <Card className="glass p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <label className="text-sm font-medium text-muted-foreground shrink-0">Participante:</label>
          <Select value={selectedParticipant} onValueChange={handleParticipantChange}>
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {participants.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {currentParticipant && (
            <span className="text-sm text-primary font-semibold">
              {currentParticipant.totalPoints} pts
            </span>
          )}
        </div>
      </Card>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="glass">
          <TabsTrigger value="upcoming">A Jogar ({upcomingMatches.length})</TabsTrigger>
          <TabsTrigger value="played">Encerrados ({playedMatches.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          {upcomingMatches.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Nenhum jogo pendente</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {upcomingMatches.map((match, i) => {
                const open = isBetOpen(match);
                const saved = hasBet(match.id);
                return (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
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
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="played" className="mt-6">
          <div className="grid md:grid-cols-2 gap-4">
            {playedMatches.map((match, i) => {
              const bet = bets.find(
                (b) => b.matchId === match.id && b.participantId === selectedParticipant
              );
              return (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <PlayedBetCard match={match} bet={bet} />
                </motion.div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function BetCard({
  match,
  open,
  saved,
  homeScore,
  awayScore,
  onScoreChange,
  onSave,
}: {
  match: Match;
  open: boolean;
  saved: boolean;
  homeScore: string;
  awayScore: string;
  onScoreChange: (field: "homeScore" | "awayScore", val: string) => void;
  onSave: () => void;
}) {
  return (
    <Card className={`glass p-4 transition-all ${open ? "hover:border-primary/30" : "opacity-70"}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {new Date(match.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
          </span>
          {match.group && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
              Grupo {match.group}
            </span>
          )}
          {match.stage !== "group" && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
              {stageLabels[match.stage]}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {open ? (
            <>
              <Clock className="h-3.5 w-3.5 text-warning" />
              <span className="text-xs text-warning font-medium">{getDeadlineLabel(match)}</span>
            </>
          ) : (
            <>
              <Lock className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Bloqueado</span>
            </>
          )}
        </div>
      </div>

      {/* Teams + Inputs */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-xl">{match.homeTeam.flag}</span>
          <span className="text-sm font-medium truncate">{match.homeTeam.name}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Input
            type="text"
            inputMode="numeric"
            className="w-12 h-10 text-center text-lg font-bold p-0"
            value={homeScore}
            onChange={(e) => onScoreChange("homeScore", e.target.value)}
            disabled={!open}
            maxLength={2}
          />
          <span className="text-muted-foreground text-sm font-bold">×</span>
          <Input
            type="text"
            inputMode="numeric"
            className="w-12 h-10 text-center text-lg font-bold p-0"
            value={awayScore}
            onChange={(e) => onScoreChange("awayScore", e.target.value)}
            disabled={!open}
            maxLength={2}
          />
        </div>
        <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
          <span className="text-sm font-medium truncate">{match.awayTeam.name}</span>
          <span className="text-xl">{match.awayTeam.flag}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-3 flex items-center justify-end gap-2">
        {saved && (
          <span className="text-xs text-success flex items-center gap-1">
            <Check className="h-3.5 w-3.5" /> Salvo
          </span>
        )}
        <Button size="sm" onClick={onSave} disabled={!open}>
          {saved ? "Atualizar" : "Salvar"} Palpite
        </Button>
      </div>
    </Card>
  );
}

function PlayedBetCard({ match, bet }: { match: Match; bet?: Bet }) {
  const isExact =
    bet && match.homeScore === bet.homeScore && match.awayScore === bet.awayScore;

  return (
    <Card className="glass p-4 opacity-90">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-muted-foreground">
          {new Date(match.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
        </span>
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-success/10 text-success">
          Encerrado
        </span>
      </div>

      {/* Result */}
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

      {/* User bet */}
      <div className={`mt-3 p-2 rounded-lg text-sm flex items-center justify-between ${
        bet
          ? isExact
            ? "bg-success/10 border border-success/20"
            : "bg-muted"
          : "bg-destructive/10 border border-destructive/20"
      }`}>
        {bet ? (
          <>
            <span className="text-muted-foreground">Seu palpite:</span>
            <span className="font-bold">
              {bet.homeScore} × {bet.awayScore}
              {isExact && <span className="ml-2 text-success">🎯 Exato!</span>}
            </span>
          </>
        ) : (
          <span className="flex items-center gap-1.5 text-destructive">
            <AlertTriangle className="h-3.5 w-3.5" />
            Sem palpite registrado
          </span>
        )}
      </div>
    </Card>
  );
}
