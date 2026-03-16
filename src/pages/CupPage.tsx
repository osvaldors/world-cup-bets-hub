import { Trophy } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GroupTable } from "@/components/GroupTable";
import { CupBracket } from "@/components/CupBracket";
import { CupRounds } from "@/components/CupRounds";
import { cupGroupStandings } from "@/data/mockData";

export default function CupPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-heading text-3xl font-bold flex items-center gap-3">
          <Trophy className="h-8 w-8 text-primary" />
          Copa do Bolão
        </h1>
        <p className="text-muted-foreground mt-1">Fase de grupos, confrontos e mata-mata entre os participantes</p>
      </div>

      <Tabs defaultValue="rounds" className="w-full">
        <TabsList className="glass">
          <TabsTrigger value="rounds">Confrontos</TabsTrigger>
          <TabsTrigger value="groups">Classificação</TabsTrigger>
          <TabsTrigger value="bracket">Chaveamento</TabsTrigger>
        </TabsList>

        <TabsContent value="rounds" className="mt-6">
          <CupRounds />
        </TabsContent>

        <TabsContent value="groups" className="mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(cupGroupStandings).map(([group, standings]) => (
              <GroupTable key={group} group={group} standings={standings} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bracket" className="mt-6">
          <CupBracket />
        </TabsContent>
      </Tabs>
    </div>
  );
}
