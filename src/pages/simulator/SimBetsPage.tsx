import { useState } from "react";
import { useSimulator } from "@/contexts/SimulatorContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FlaskConical, ClipboardEdit, Search, Check, X } from "lucide-react";
import { stageLabels } from "@/lib/supabase-queries";
import { motion } from "framer-motion";

export default function SimBetsPage() {
  const { participants, mergedMatches, mergedBets, setSimBet } = useSimulator();
  const [selectedPart, setSelectedPart] = useState<string>("");
  const [stageFilter, setStageFilter] = useState<string>("all");
  
  // Local edit state
  const [editing, setEditing] = useState<string | null>(null); // matchId
  const [draft, setDraft] = useState({ home: "", away: "" });

  const activeParticipant = participants.find(p => p.id === selectedPart);
  
  const filteredMatches = mergedMatches.filter(m => stageFilter === "all" || m.stage === stageFilter);

  const startEdit = (matchId: string, currentHome: number, currentAway: number) => {
    setEditing(matchId);
    setDraft({ home: currentHome.toString(), away: currentAway.toString() });
  };

  const saveEdit = (matchId: string) => {
    if (!selectedPart) return;
    const h = parseInt(draft.home);
    const a = parseInt(draft.away);
    if (!isNaN(h) && !isNaN(a)) {
      setSimBet(matchId, selectedPart, h, a);
    }
    setEditing(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-heading text-3xl font-bold flex items-center gap-3">
          <FlaskConical className="h-7 w-7 text-amber-400" />
          <ClipboardEdit className="h-7 w-7 text-primary" />
          Simulador — Palpites
        </h1>
        <p className="text-muted-foreground mt-1">
          Simule alterações nos palpites dos participantes para ver o impacto na pontuação
        </p>
      </div>

      <div className="flex flex-wrap gap-4 glass p-4 rounded-xl">
        <div className="space-y-1.5 flex-1 min-w-[240px]">
          <label className="text-xs font-medium text-muted-foreground ml-1">Participante</label>
          <Select value={selectedPart} onValueChange={setSelectedPart}>
            <SelectTrigger className="glass border-primary/20">
              <SelectValue placeholder="Selecione um participante para simular" />
            </SelectTrigger>
            <SelectContent>
              {participants.map(p => (
                <SelectItem key={p.id} value={p.id}>{p.avatar} {p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5 w-48">
          <label className="text-xs font-medium text-muted-foreground ml-1">Fase</label>
          <Select value={stageFilter} onValueChange={setStageFilter}>
            <SelectTrigger className="glass border-primary/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Fases</SelectItem>
              {Array.from(new Set(mergedMatches.map(m => m.stage))).map(s => (
                <SelectItem key={s} value={s}>{stageLabels[s] || s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {!selectedPart ? (
        <div className="text-center py-20 bg-muted/20 rounded-2xl border-2 border-dashed border-border">
          <Search className="h-10 w-10 mx-auto mb-4 text-muted-foreground/40" />
          <p className="text-muted-foreground">Selecione um participante acima para começar a simular palpites</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filteredMatches.map((m, i) => {
            const bet = mergedBets.find(b => b.matchId === m.id && b.participantId === selectedPart);
            const isEditing = editing === m.id;
            const currentHome = bet?.homeScore ?? 0;
            const currentAway = bet?.awayScore ?? 0;

            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
              >
                <Card className="glass p-3 flex items-center justify-between gap-4 border-border/40 transition-colors hover:border-primary/30">
                  <div className="flex flex-col gap-0.5 min-w-[120px]">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">
                      {stageLabels[m.stage] || m.stage}
                    </span>
                    <span className="text-xs text-muted-foreground/80">
                      {new Date(m.date).toLocaleDateString("pt-BR", { day: '2-digit', month: '2-digit' })}
                    </span>
                  </div>

                  <div className="flex-1 flex items-center justify-center gap-3">
                    <div className="flex items-center gap-2 flex-1 justify-end">
                      <span className="text-sm font-medium hidden sm:inline">{m.homeTeam.name}</span>
                      <span className="text-lg">{m.homeTeam.flag}</span>
                    </div>

                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <Input 
                          type="number" 
                          className="w-12 h-8 text-center text-sm p-1 border-primary/40 focus:ring-primary/20"
                          value={draft.home}
                          onChange={e => setDraft(d => ({ ...d, home: e.target.value }))}
                        />
                        <span className="text-muted-foreground">×</span>
                        <Input 
                          type="number" 
                          className="w-12 h-8 text-center text-sm p-1 border-primary/40 focus:ring-primary/20"
                          value={draft.away}
                          onChange={e => setDraft(d => ({ ...d, away: e.target.value }))}
                        />
                      </div>
                    ) : (
                      <div className="bg-primary/5 border border-primary/20 rounded-lg px-3 py-1.5 flex items-center gap-2">
                        <span className="text-xl font-black text-primary drop-shadow-sm">{currentHome}</span>
                        <span className="text-muted-foreground/30 font-bold">×</span>
                        <span className="text-xl font-black text-primary drop-shadow-sm">{currentAway}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 flex-1 justify-start">
                      <span className="text-lg">{m.awayTeam.flag}</span>
                      <span className="text-sm font-medium hidden sm:inline">{m.awayTeam.name}</span>
                    </div>
                  </div>

                  <div className="min-w-[80px] flex justify-end">
                    {isEditing ? (
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-success hover:bg-success/10" onClick={() => saveEdit(m.id)}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => setEditing(null)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs hover:text-primary transition-colors h-8"
                        onClick={() => startEdit(m.id, currentHome, currentAway)}
                      >
                        <ClipboardEdit className="h-3.5 w-3.5 mr-1.5 opacity-60" />
                        Alterar
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
