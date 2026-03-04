import { participants } from "@/data/mockData";
import { Card } from "@/components/ui/card";
import { Shield, Medal } from "lucide-react";
import { motion } from "framer-motion";

export default function LeaguePage() {
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

      {/* Podium */}
      <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto mb-8">
        {[1, 0, 2].map((idx) => {
          const p = sorted[idx];
          const medals = ["🥇", "🥈", "🥉"];
          const heights = ["h-32", "h-40", "h-28"];
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15 }}
              className="flex flex-col items-center"
            >
              <span className="text-3xl mb-2">{medals[idx]}</span>
              <p className="text-sm font-heading font-semibold text-center">{p.name}</p>
              <p className="text-xl font-bold text-primary">{p.leaguePoints}</p>
              <div className={`w-full ${heights[idx]} mt-2 rounded-t-lg ${
                idx === 0 ? "gradient-primary" : "bg-primary/20"
              }`} />
            </motion.div>
          );
        })}
      </div>

      {/* Full table */}
      <Card className="glass overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left px-4 py-3">#</th>
                <th className="text-left px-4 py-3">Participante</th>
                <th className="text-center px-4 py-3">Placares Exatos</th>
                <th className="text-center px-4 py-3">Acertos Vencedor</th>
                <th className="text-center px-4 py-3">Jogos Palpitados</th>
                <th className="text-right px-4 py-3 font-bold">Pontos</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((p, i) => (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-border/50 last:border-0 hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                      i < 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}>
                      {i + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                        {p.avatar}
                      </div>
                      <span className="font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td className="text-center px-4 py-3 text-success">{Math.floor(Math.random() * 4)}</td>
                  <td className="text-center px-4 py-3">{Math.floor(Math.random() * 8) + 2}</td>
                  <td className="text-center px-4 py-3 text-muted-foreground">8</td>
                  <td className="text-right px-4 py-3 font-bold text-primary text-lg">{p.leaguePoints}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
