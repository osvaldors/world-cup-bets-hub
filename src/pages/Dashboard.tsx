import { Trophy, Shield, Users, Calendar, TrendingUp, Star, Medal } from "lucide-react";
import { Card } from "@/components/ui/card";
import { MatchCard } from "@/components/MatchCard";
import { motion } from "framer-motion";
import { useMatches, useParticipantsWithPoints, useCupGroupStandings } from "@/hooks/use-bolao-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Dashboard() {
  const { data: matches = [], isLoading: loadingMatches } = useMatches();
  const { data: participants = [], isLoading: loadingParticipants } = useParticipantsWithPoints();
  const { data: cupGroupStandings = {}, isLoading: loadingCup } = useCupGroupStandings();

  if (loadingMatches || loadingParticipants) {
    return <div className="flex items-center justify-center py-20 text-muted-foreground">Carregando...</div>;
  }

  const playedCount = matches.filter(m => m.played).length;
  const pendingCount = matches.filter(m => !m.played).length;
  const topByLeague = [...participants].sort((a, b) => b.leaguePoints - a.leaguePoints);

  const stats = [
    { label: "Participantes", value: String(participants.length), icon: Users, color: "text-primary" },
    { label: "Jogos Realizados", value: String(playedCount), icon: Calendar, color: "text-success" },
    { label: "Jogos Restantes", value: String(pendingCount), icon: Calendar, color: "text-warning" },
    { label: "Líder Liga", value: topByLeague[0]?.name.split(" ")[0] ?? "-", icon: TrendingUp, color: "text-primary" },
  ];

  const topParticipants = topByLeague.slice(0, 5);
  const recentMatches = matches.filter(m => m.played).slice(-4);
  const upcomingMatches = matches.filter(m => !m.played).slice(0, 4);

  // Top 2 per cup group, sorted A→D
  const sortedCupGroups = Object.entries(cupGroupStandings)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([group, standings]) => ({ group, top2: standings.slice(0, 2) }))
    .filter(({ top2 }) => top2.length > 0);

  const hasCupStandings = !loadingCup && sortedCupGroups.length > 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-heading text-3xl font-bold mb-1">
          <span className="text-gradient">Bolão</span> Copa do Mundo 2026
        </h1>
        <p className="text-muted-foreground">Acompanhe seus palpites e classificação</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="glass p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-primary/10 ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-heading font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Copa do Bolão — Classificados por grupo */}
      {hasCupStandings && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="glass p-5">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="h-5 w-5 text-primary" />
              <h2 className="font-heading font-semibold">Copa do Bolão — Classificados</h2>
              <span className="ml-auto text-xs text-muted-foreground">Top 2 por grupo</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {sortedCupGroups.map(({ group, top2 }, gi) => (
                <motion.div
                  key={group}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: gi * 0.08 }}
                  className="rounded-lg border border-border/60 overflow-hidden"
                >
                  {/* Group header */}
                  <div className="bg-primary/10 px-3 py-1.5 flex items-center gap-1.5">
                    <span className="text-[10px] font-heading font-bold text-primary uppercase tracking-widest">
                      Grupo {group}
                    </span>
                  </div>

                  {/* Ranked participants */}
                  <div className="divide-y divide-border/40">
                    {top2.map((s, i) => (
                      <div key={s.participant.id} className={`flex items-center gap-2 px-3 py-2 ${i === 0 ? "bg-primary/5" : ""}`}>
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                          i === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}>
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{s.participant.name}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {s.wins}V {s.draws}E {s.losses}D
                          </p>
                        </div>
                        <span className="text-sm font-bold text-primary shrink-0">{s.points}<span className="text-[10px] text-muted-foreground font-normal">pt</span></span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="glass p-5 lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <Star className="h-5 w-5 text-primary" />
            <h2 className="font-heading font-semibold">Top 5 - Liga</h2>
          </div>
          <div className="space-y-3">
            {topParticipants.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                  i === 0 ? "bg-primary text-primary-foreground" :
                  i === 1 ? "bg-primary/60 text-primary-foreground" :
                  i === 2 ? "bg-primary/30 text-foreground" :
                  "bg-muted text-muted-foreground"
                }`}>{i + 1}</span>
                <Avatar className="h-7 w-7 border border-border shrink-0">
                  <AvatarImage src={p.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                    {p.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                </div>
                <span className="text-sm font-bold text-primary">{p.totalPoints} pts</span>
              </div>
            ))}
          </div>
        </Card>

        <div className="lg:col-span-1 space-y-3">
          <h2 className="font-heading font-semibold flex items-center gap-2">
            <Trophy className="h-5 w-5 text-success" /> Últimos Jogos
          </h2>
          {recentMatches.length === 0 ? (
            <p className="text-muted-foreground text-sm">Nenhum jogo encerrado ainda</p>
          ) : (
            <div className="space-y-2">
              {recentMatches.map(m => <MatchCard key={m.id} match={m} compact />)}
            </div>
          )}
        </div>

        <div className="lg:col-span-1 space-y-3">
          <h2 className="font-heading font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-warning" /> Próximos Jogos
          </h2>
          <div className="space-y-2">
            {upcomingMatches.map(m => <MatchCard key={m.id} match={m} compact />)}
          </div>
        </div>
      </div>
    </div>
  );
}
