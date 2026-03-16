import { useSimulator } from "@/contexts/SimulatorContext";
import { GroupTable } from "@/components/GroupTable";
import { FlaskConical, Trophy } from "lucide-react";

export default function SimCupStandingsPage() {
  const { cupGroupStandings } = useSimulator();
  const hasData = Object.keys(cupGroupStandings).length > 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-heading text-3xl font-bold flex items-center gap-3">
          <FlaskConical className="h-7 w-7 text-amber-400" />
          <Trophy className="h-7 w-7 text-primary" />
          Simulador — Classificação Copa
        </h1>
        <p className="text-muted-foreground mt-1">
          Standings calculados automaticamente com base nos resultados simulados
        </p>
      </div>

      {!hasData ? (
        <div className="text-center py-16 text-muted-foreground">
          <Trophy className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>Simule resultados na aba <strong>Jogos</strong> para ver a classificação atualizar aqui.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {Object.entries(cupGroupStandings)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([group, standings]) => (
              <GroupTable key={group} group={group} standings={standings} />
            ))}
        </div>
      )}
    </div>
  );
}
