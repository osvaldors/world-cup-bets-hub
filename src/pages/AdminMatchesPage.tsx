import { useState } from "react";
import { matches, teams, stageLabels } from "@/data/mockData";
import { Match } from "@/types/bolao";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Save, Plus, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const knockoutStages = ["round-of-32", "round-of-16", "quarter-final", "semi-final", "third-place", "final"];

export default function AdminMatchesPage() {
  const [editingMatch, setEditingMatch] = useState<string | null>(null);
  const [scores, setScores] = useState<Record<string, { home: string; away: string }>>({});
  const [teamEdits, setTeamEdits] = useState<Record<string, { home: string; away: string }>>({});
  const { toast } = useToast();

  const handleSave = (matchId: string) => {
    toast({
      title: "Resultado salvo!",
      description: `Placar atualizado com sucesso.`,
    });
    setEditingMatch(null);
  };

  const startEditing = (match: Match) => {
    setEditingMatch(match.id);
    setScores((s) => ({
      ...s,
      [match.id]: {
        home: match.homeScore?.toString() ?? "",
        away: match.awayScore?.toString() ?? "",
      },
    }));
    if (knockoutStages.includes(match.stage)) {
      setTeamEdits((s) => ({
        ...s,
        [match.id]: {
          home: match.homeTeam.id,
          away: match.awayTeam.id,
        },
      }));
    }
  };

  const stages = [...new Set(matches.map((m) => m.stage))];
  const groupMatches = matches.filter((m) => m.stage === "group");
  const koMatches = matches.filter((m) => m.stage !== "group");

  // Group group-stage by group letter
  const groupedByGroup = groupMatches.reduce<Record<string, Match[]>>((acc, m) => {
    const key = m.group ?? "?";
    if (!acc[key]) acc[key] = [];
    acc[key].push(m);
    return acc;
  }, {});

  // Group knockout by stage
  const groupedByStage = koMatches.reduce<Record<string, Match[]>>((acc, m) => {
    const key = m.stage;
    if (!acc[key]) acc[key] = [];
    acc[key].push(m);
    return acc;
  }, {});

  const isKnockout = (stage: string) => knockoutStages.includes(stage);

  const renderMatchRow = (match: Match) => {
    const editing = editingMatch === match.id;
    const ko = isKnockout(match.stage);

    return (
      <Card key={match.id} className="glass p-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
              {stageLabels[match.stage]}
            </span>
            <span className="text-xs text-muted-foreground">
              {new Date(match.date).toLocaleDateString("pt-BR")}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-center">
            {/* Home team */}
            {editing && ko ? (
              <Select
                value={teamEdits[match.id]?.home ?? match.homeTeam.id}
                onValueChange={(v) =>
                  setTeamEdits((s) => ({
                    ...s,
                    [match.id]: { ...s[match.id], home: v, away: s[match.id]?.away ?? match.awayTeam.id },
                  }))
                }
              >
                <SelectTrigger className="w-40 h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.flag} {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <span className="text-sm font-medium">
                {match.homeTeam.flag} {match.homeTeam.name}
              </span>
            )}

            {/* Score */}
            {editing ? (
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  min="0"
                  className="w-14 h-8 text-center"
                  value={scores[match.id]?.home ?? ""}
                  onChange={(e) =>
                    setScores((s) => ({
                      ...s,
                      [match.id]: { ...s[match.id], home: e.target.value, away: s[match.id]?.away ?? "" },
                    }))
                  }
                />
                <span className="text-muted-foreground text-xs">×</span>
                <Input
                  type="number"
                  min="0"
                  className="w-14 h-8 text-center"
                  value={scores[match.id]?.away ?? ""}
                  onChange={(e) =>
                    setScores((s) => ({
                      ...s,
                      [match.id]: { ...s[match.id], away: e.target.value, home: s[match.id]?.home ?? "" },
                    }))
                  }
                />
              </div>
            ) : (
              <span className="text-sm font-bold mx-2">
                {match.played ? `${match.homeScore} × ${match.awayScore}` : "- × -"}
              </span>
            )}

            {/* Away team */}
            {editing && ko ? (
              <Select
                value={teamEdits[match.id]?.away ?? match.awayTeam.id}
                onValueChange={(v) =>
                  setTeamEdits((s) => ({
                    ...s,
                    [match.id]: { ...s[match.id], away: v, home: s[match.id]?.home ?? match.homeTeam.id },
                  }))
                }
              >
                <SelectTrigger className="w-40 h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.flag} {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <span className="text-sm font-medium">
                {match.awayTeam.name} {match.awayTeam.flag}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {editing ? (
              <Button
                size="sm"
                onClick={() => handleSave(match.id)}
                className="gradient-primary text-primary-foreground"
              >
                <Check className="h-4 w-4 mr-1" /> Salvar
              </Button>
            ) : (
              <Button size="sm" variant="outline" onClick={() => startEditing(match)}>
                Editar
              </Button>
            )}
            {match.played && <span className="text-xs text-success font-medium">✓ Encerrado</span>}
          </div>
        </div>
      </Card>
    );
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

      <Tabs defaultValue="groups" className="w-full">
        <TabsList className="glass flex-wrap">
          <TabsTrigger value="groups">Fase de Grupos</TabsTrigger>
          {knockoutStages.map((s) =>
            groupedByStage[s] ? (
              <TabsTrigger key={s} value={s}>
                {stageLabels[s]}
              </TabsTrigger>
            ) : null
          )}
        </TabsList>

        <TabsContent value="groups" className="mt-6 space-y-6">
          {Object.entries(groupedByGroup)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([group, gMatches]) => (
              <div key={group}>
                <h3 className="font-heading font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">
                  Grupo {group}
                </h3>
                <div className="space-y-2">{gMatches.map(renderMatchRow)}</div>
              </div>
            ))}
        </TabsContent>

        {knockoutStages.map((stage) =>
          groupedByStage[stage] ? (
            <TabsContent key={stage} value={stage} className="mt-6">
              <div className="space-y-2">{groupedByStage[stage].map(renderMatchRow)}</div>
            </TabsContent>
          ) : null
        )}
      </Tabs>
    </div>
  );
}
