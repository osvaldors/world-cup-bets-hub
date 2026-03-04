import { Match } from "@/types/bolao";
import { Card } from "./ui/card";

interface MatchCardProps {
  match: Match;
  compact?: boolean;
}

export function MatchCard({ match, compact }: MatchCardProps) {
  const isLive = false;
  
  return (
    <Card className={`glass overflow-hidden transition-all hover:border-primary/30 ${compact ? "p-3" : "p-4"}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground">
          {new Date(match.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
        </span>
        {match.played ? (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-success/10 text-success">
            Encerrado
          </span>
        ) : (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
            A jogar
          </span>
        )}
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-xl">{match.homeTeam.flag}</span>
          <span className={`text-sm font-medium truncate ${compact ? "" : ""}`}>{match.homeTeam.name}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <span className={`text-lg font-bold min-w-[24px] text-center ${match.played ? "" : "text-muted-foreground"}`}>
            {match.played ? match.homeScore : "-"}
          </span>
          <span className="text-muted-foreground text-xs">×</span>
          <span className={`text-lg font-bold min-w-[24px] text-center ${match.played ? "" : "text-muted-foreground"}`}>
            {match.played ? match.awayScore : "-"}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
          <span className={`text-sm font-medium truncate ${compact ? "" : ""}`}>{match.awayTeam.name}</span>
          <span className="text-xl">{match.awayTeam.flag}</span>
        </div>
      </div>
      {match.group && (
        <div className="mt-2 text-xs text-muted-foreground text-center">
          Grupo {match.group}
        </div>
      )}
    </Card>
  );
}
