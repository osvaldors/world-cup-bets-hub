import { MatchCard } from "@/components/MatchCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "lucide-react";
import { useMatches } from "@/hooks/use-bolao-data";
import { stageLabels } from "@/lib/supabase-queries";

export default function MatchesPage() {
  const { data: allMatches = [], isLoading } = useMatches();

  // Filter out knockout matches without assigned teams
  const matches = allMatches.filter(m =>
    m.stage === "group" || (m.homeTeam.id !== "tbd" && m.awayTeam.id !== "tbd")
  );

  if (isLoading) {
    return <div className="flex items-center justify-center py-20 text-muted-foreground">Carregando...</div>;
  }

  const stages = [...new Set(matches.map(m => m.stage))];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-heading text-3xl font-bold flex items-center gap-3">
          <Calendar className="h-8 w-8 text-primary" />
          Jogos
        </h1>
        <p className="text-muted-foreground mt-1">Todos os jogos da Copa do Mundo 2026</p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="glass flex-wrap">
          <TabsTrigger value="all">Todos</TabsTrigger>
          {stages.map(s => (
            <TabsTrigger key={s} value={s}>{stageLabels[s] || s}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matches.map(m => <MatchCard key={m.id} match={m} />)}
          </div>
        </TabsContent>

        {stages.map(stage => (
          <TabsContent key={stage} value={stage} className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {matches.filter(m => m.stage === stage).map(m => (
                <MatchCard key={m.id} match={m} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
