import { Trophy, Shield, Users, Calendar, TrendingUp, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { participants, matches } from "@/data/mockData";
import { MatchCard } from "@/components/MatchCard";
import { motion } from "framer-motion";

export default function Dashboard() {
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-heading text-3xl font-bold mb-1">
          <span className="text-gradient">Bolão</span> Copa do Mundo 2026
        </h1>
        <p className="text-muted-foreground">Acompanhe seus palpites e classificação</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
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

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Top 5 */}
        <Card className="glass p-5 lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <Star className="h-5 w-5 text-primary" />
            <h2 className="font-heading font-semibold">Top 5 - Liga</h2>
          </div>
          <div className="space-y-3">
            {topParticipants.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  i === 0 ? "bg-primary text-primary-foreground" :
                  i === 1 ? "bg-primary/60 text-primary-foreground" :
                  i === 2 ? "bg-primary/30 text-foreground" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                </div>
                <span className="text-sm font-bold text-primary">{p.totalPoints} pts</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Matches */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="font-heading font-semibold flex items-center gap-2">
            <Trophy className="h-5 w-5 text-success" /> Últimos Jogos
          </h2>
          {recentMatches.length === 0 ? (
            <p className="text-muted-foreground text-sm">Nenhum jogo encerrado ainda</p>
          ) : (
            <div className="space-y-2">
              {recentMatches.map(m => (
                <MatchCard key={m.id} match={m} compact />
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Matches */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="font-heading font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-warning" /> Próximos Jogos
          </h2>
          <div className="space-y-2">
            {upcomingMatches.map(m => (
              <MatchCard key={m.id} match={m} compact />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
