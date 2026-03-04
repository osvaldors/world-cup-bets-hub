import { BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SCORING_RULES } from "@/lib/scoring";

export default function RulesPage() {
  const rules = [
    { ...SCORING_RULES.EXACT, example: "Palpite: 2×1 | Resultado: 2×1" },
    { ...SCORING_RULES.WINNER_GOAL_DIFF, example: "Palpite: 3×1 | Resultado: 2×0 (saldo +2)" },
    { ...SCORING_RULES.WINNER_ONE_SCORE, example: "Palpite: 2×1 | Resultado: 2×0" },
    { ...SCORING_RULES.WINNER, example: "Palpite: 3×0 | Resultado: 1×0" },
    { ...SCORING_RULES.DRAW_NO_EXACT, example: "Palpite: 1×1 | Resultado: 2×2" },
    { ...SCORING_RULES.ONE_SCORE, example: "Palpite: 2×1 | Resultado: 0×1" },
    { ...SCORING_RULES.MISS, example: "Palpite: 2×0 | Resultado: 0×3" },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="font-heading text-3xl font-bold flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-primary" />
          Regras do Bolão
        </h1>
        <p className="text-muted-foreground mt-1">Sistema de pontuação tradicional</p>
      </div>

      <Card className="glass p-6">
        <h2 className="font-heading text-xl font-semibold mb-4">Pontuação por Palpite</h2>
        <div className="space-y-4">
          {rules.map((rule, i) => (
            <div key={i} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <span className={`text-2xl font-heading font-bold min-w-[60px] text-right ${
                rule.points >= 18 ? "text-success" :
                rule.points >= 10 ? "text-primary" :
                rule.points > 0 ? "text-warning" : "text-destructive"
              }`}>
                {rule.points}
              </span>
              <div>
                <p className="font-medium">{rule.label}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{rule.example}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="glass p-6">
        <h2 className="font-heading text-xl font-semibold mb-4">Modos de Jogo</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="font-heading font-semibold text-primary flex items-center gap-2">
              🏆 Modo Copa
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1.5">
              <li>• 4 grupos com 4 participantes cada</li>
              <li>• 2 melhores de cada grupo avançam</li>
              <li>• Mata-mata: quartas, semi e final</li>
              <li>• Confrontos baseados nos pontos do bolão</li>
              <li>• Disputa de 3º lugar</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-heading font-semibold text-primary flex items-center gap-2">
              🛡️ Modo Liga
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1.5">
              <li>• Todos os participantes competem entre si</li>
              <li>• Ranking geral por pontos acumulados</li>
              <li>• Vence quem acumular mais pontos</li>
              <li>• Critério de desempate: placares exatos</li>
              <li>• Classificação atualizada a cada rodada</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
