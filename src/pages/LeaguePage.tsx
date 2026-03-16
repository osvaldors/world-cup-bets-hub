import { Card } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useParticipantsWithPoints } from "@/hooks/use-bolao-data";

export default function LeaguePage() {
  const { data: participants = [], isLoading } = useParticipantsWithPoints();

  if (isLoading) {
    return <div className="flex items-center justify-center py-20 text-muted-foreground">Carregando...</div>;
  }

  const sorted = [...participants].sort((a, b) => b.leaguePoints - a.leaguePoints);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-heading text-3xl font-bold flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          Classificação da Liga
        </h1>
        <p className="text-muted-foreground mt-1">Ranking geral por pontos acumulados em todos os jogos</p>
      </div>

      {sorted.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto mb-8">
          {[1, 0, 2].map((idx) => {
            const p = sorted[idx];
            if (!p) return null;
            const medals = ["🥇", "🥈", "🥉"];
            const heights = ["h-32", "h-40", "h-28"];
            return (
              <motion.div key={p.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.15 }} className="flex flex-col items-center">
                <span className="text-3xl mb-2">{medals[idx]}</span>
                <p className="text-sm font-heading font-semibold text-center">{p.name}</p>
                <p className="text-xl font-bold text-primary">{p.leaguePoints}</p>
                <div className={`w-full ${heights[idx]} mt-2 rounded-t-lg ${idx === 0 ? "gradient-primary" : "bg-primary/20"}`} />
              </motion.div>
            );
          })}
        </div>
      )}

      <Card className="glass overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-muted-foreground border-b border-border bg-muted/30">
                <th className="text-left px-3 py-3">#</th>
                <th className="text-left px-3 py-3">Participante</th>
                <th className="text-center px-3 py-3 font-bold bg-primary/10">Pontos</th>
                <th className="text-center px-2 py-3" title="Placar Exato">Exato</th>
                <th className="text-center px-2 py-3" title="Vencedor + Saldo">V+Saldo</th>
                <th className="text-center px-2 py-3" title="Vencedor + Gols de 1 Time">V+Gols</th>
                <th className="text-center px-2 py-3" title="Acertou Vencedor">Vencedor</th>
                <th className="text-center px-2 py-3" title="Acertou Empate">Empate</th>
                <th className="text-center px-2 py-3" title="Acertou Gols de 1 Time">Gols</th>
                <th className="text-center px-2 py-3 text-red-400" title="Errou">Erros</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((p, i) => (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`border-b border-border/50 last:border-0 transition-colors hover:bg-muted/40 ${i === 0 ? "bg-yellow-400/5" : i === 1 ? "bg-slate-400/5" : i === 2 ? "bg-amber-700/5" : ""
                    }`}
                >
                  <td className="px-3 py-3">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${i === 0 ? "bg-yellow-400 text-yellow-900" :
                        i === 1 ? "bg-slate-400 text-slate-900" :
                          i === 2 ? "bg-amber-700 text-white" :
                            "bg-muted text-muted-foreground"
                      }`}>
                      {i + 1}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{p.avatar}</span>
                      <span className="font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td className="text-center px-3 py-3 bg-primary/5">
                    <span className={`font-bold text-lg ${p.leaguePoints > 0 ? "text-primary" : "text-muted-foreground"}`}>
                      {p.leaguePoints}
                    </span>
                  </td>
                  <td className="text-center px-2 py-3">
                    <span className="text-green-500 font-semibold">{p.stats?.exactScore || 0}</span>
                  </td>
                  <td className="text-center px-2 py-3">
                    <span className="text-emerald-400">{p.stats?.winnerAndBalance || 0}</span>
                  </td>
                  <td className="text-center px-2 py-3">
                    <span className="text-blue-400">{p.stats?.winnerAndGoals || 0}</span>
                  </td>
                  <td className="text-center px-2 py-3">
                    <span className="text-cyan-400">{p.stats?.correctWinner || 0}</span>
                  </td>
                  <td className="text-center px-2 py-3">
                    <span className="text-amber-400">{p.stats?.correctDraw || 0}</span>
                  </td>
                  <td className="text-center px-2 py-3">
                    <span className="text-purple-400">{p.stats?.correctGoals || 0}</span>
                  </td>
                  <td className="text-center px-2 py-3">
                    <span className="text-red-400">{p.stats?.incorrect || 0}</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}