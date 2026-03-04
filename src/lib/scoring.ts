import { ScoringResult } from "@/types/bolao";

export const SCORING_RULES = {
  EXACT: { points: 25, label: "Placar Exato", color: "success" },
  WINNER_GOAL_DIFF: { points: 18, label: "Vencedor + Saldo", color: "primary" },
  WINNER_ONE_SCORE: { points: 15, label: "Vencedor + Gols de 1 Time", color: "primary" },
  WINNER: { points: 10, label: "Acertou Vencedor", color: "warning" },
  DRAW_NO_EXACT: { points: 15, label: "Acertou Empate", color: "primary" },
  ONE_SCORE: { points: 3, label: "Acertou Gols de 1 Time", color: "muted" },
  MISS: { points: 0, label: "Errou", color: "destructive" },
};

export function calculateScore(
  betHome: number,
  betAway: number,
  actualHome: number,
  actualAway: number
): ScoringResult {
  // Exact score
  if (betHome === actualHome && betAway === actualAway) {
    return SCORING_RULES.EXACT;
  }

  const betResult = Math.sign(betHome - betAway);
  const actualResult = Math.sign(actualHome - actualAway);
  const betDiff = betHome - betAway;
  const actualDiff = actualHome - actualAway;

  // Draw correct but not exact
  if (betResult === 0 && actualResult === 0) {
    return SCORING_RULES.DRAW_NO_EXACT;
  }

  // Winner correct
  if (betResult === actualResult) {
    // Winner + goal difference
    if (betDiff === actualDiff) {
      return SCORING_RULES.WINNER_GOAL_DIFF;
    }
    // Winner + one score correct
    if (betHome === actualHome || betAway === actualAway) {
      return SCORING_RULES.WINNER_ONE_SCORE;
    }
    return SCORING_RULES.WINNER;
  }

  // One score correct
  if (betHome === actualHome || betAway === actualAway) {
    return SCORING_RULES.ONE_SCORE;
  }

  return SCORING_RULES.MISS;
}
