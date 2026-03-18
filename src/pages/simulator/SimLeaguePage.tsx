import { useSimulator } from "@/contexts/SimulatorContext";
import { Card } from "@/components/ui/card";
import { FlaskConical, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function SimLeaguePage() {
  const { leagueStandings, participants } = useSimulator();

  if (participants.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        Carregando participantes...
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-heading text-3xl font-bold flex items-center gap-3">
          <FlaskConical className="h-7 w-7 text-amber-400" />
          <Shield className="h-7 w-7 text-primary" />
          Simulador — Classificação Liga
        </h1>
        <p className="text-muted-foreground mt-1">
          Ranking geral calculado automaticamente com base nos palpites e resultados simulados
        </p>
      </div>

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
              {leagueStandings.map((p, i) => (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0, x: -10 }}
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
                    <span className={`font-bold text-lg ${p.simPoints > 0 ? "text-primary" : "text-muted-foreground"}`}>
                      {p.simPoints}
                    </span>
                  </td>
                  <td className="text-center px-2 py-3">
                    <span className="text-green-500 font-semibold">—</span>
                  </td>
                  <td className="text-center px-2 py-3">
                    <span className="text-emerald-400">—</span>
                  </td>
                  <td className="text-center px-2 py-3">
                    <span className="text-blue-400">—</span>
                  </td>
                  <td className="text-center px-2 py-3">
                    <span className="text-cyan-400">—</span>
                  </td>
                  <td className="text-center px-2 py-3">
                    <span className="text-amber-400">—</span>
                  </td>
                  <td className="text-center px-2 py-3">
                    <span className="text-purple-400">—</span>
                  </td>
                  <td className="text-center px-2 py-3">
                    <span className="text-red-400">—</span>
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