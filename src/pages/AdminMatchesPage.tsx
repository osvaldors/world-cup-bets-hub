import { useState } from "react";
import { matches, teams, stageLabels } from "@/data/mockData";
import { Match } from "@/types/bolao";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Save, Plus, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminMatchesPage() {
  const [editingMatch, setEditingMatch] = useState<string | null>(null);
  const [scores, setScores] = useState<Record<string, { home: string; away: string }>>({});
  const { toast } = useToast();

  const handleSave = (matchId: string) => {
    toast({
      title: "Resultado salvo!",
      description: `Placar atualizado com sucesso.`,
    });
    setEditingMatch(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold flex items-center gap-3">
            <Calendar className="h-8 w-8 text-primary" />
            Gerenciar Jogos
          </h1>
          <p className="text-muted-foreground mt-1">Cadastre resultados e gerencie partidas</p>
        </div>
        <Button className="gradient-primary text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" /> Novo Jogo
        </Button>
      </div>

      <div className="space-y-3">
        {matches.map((match) => (
          <Card key={match.id} className="glass p-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                  {stageLabels[match.stage]}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(match.date).toLocaleDateString("pt-BR")}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{match.homeTeam.flag} {match.homeTeam.name}</span>
                
                {editingMatch === match.id ? (
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      min="0"
                      className="w-14 h-8 text-center"
                      value={scores[match.id]?.home ?? match.homeScore ?? ""}
                      onChange={(e) => setScores(s => ({
                        ...s,
                        [match.id]: { ...s[match.id], home: e.target.value, away: s[match.id]?.away ?? "" }
                      }))}
                    />
                    <span className="text-muted-foreground text-xs">×</span>
                    <Input
                      type="number"
                      min="0"
                      className="w-14 h-8 text-center"
                      value={scores[match.id]?.away ?? match.awayScore ?? ""}
                      onChange={(e) => setScores(s => ({
                        ...s,
                        [match.id]: { ...s[match.id], away: e.target.value, home: s[match.id]?.home ?? "" }
                      }))}
                    />
                  </div>
                ) : (
                  <span className="text-sm font-bold mx-2">
                    {match.played ? `${match.homeScore} × ${match.awayScore}` : "- × -"}
                  </span>
                )}

                <span className="text-sm font-medium">{match.awayTeam.name} {match.awayTeam.flag}</span>
              </div>

              <div className="flex items-center gap-2">
                {editingMatch === match.id ? (
                  <Button size="sm" onClick={() => handleSave(match.id)} className="gradient-primary text-primary-foreground">
                    <Check className="h-4 w-4 mr-1" /> Salvar
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => setEditingMatch(match.id)}>
                    Editar
                  </Button>
                )}
                {match.played && (
                  <span className="text-xs text-success font-medium">✓ Encerrado</span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
