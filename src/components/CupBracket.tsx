import { CupBracketMatch } from "@/types/bolao";
import { cupBracketMatches } from "@/data/mockData";

function BracketMatchCard({ match }: { match: CupBracketMatch }) {
  return (
    <div className="glass rounded-lg p-3 w-56 space-y-1">
      <div className={`flex items-center justify-between p-1.5 rounded ${
        match.winner?.id === match.participant1?.id ? "bg-primary/10" : ""
      }`}>
        <span className="text-sm font-medium truncate">
          {match.participant1?.name || "A definir"}
        </span>
        <span className="text-sm font-bold ml-2">
          {match.score1 !== undefined ? match.score1 : "-"}
        </span>
      </div>
      <div className={`flex items-center justify-between p-1.5 rounded ${
        match.winner?.id === match.participant2?.id ? "bg-primary/10" : ""
      }`}>
        <span className="text-sm font-medium truncate">
          {match.participant2?.name || "A definir"}
        </span>
        <span className="text-sm font-bold ml-2">
          {match.score2 !== undefined ? match.score2 : "-"}
        </span>
      </div>
    </div>
  );
}

export function CupBracket() {
  const quarters = cupBracketMatches.filter(m => m.stage === "quarter-final");
  const semis = cupBracketMatches.filter(m => m.stage === "semi-final");
  const final = cupBracketMatches.find(m => m.stage === "final");
  const thirdPlace = cupBracketMatches.find(m => m.stage === "third-place");

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[900px] flex items-center gap-8 py-8">
        {/* Quarter-finals */}
        <div className="space-y-4">
          <h3 className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Quartas
          </h3>
          <div className="space-y-6">
            {quarters.map(m => (
              <BracketMatchCard key={m.id} match={m} />
            ))}
          </div>
        </div>

        {/* Connectors */}
        <div className="flex flex-col justify-center gap-24 text-border">
          {[0, 1].map(i => (
            <div key={i} className="w-8 h-24 border-r-2 border-t-2 border-b-2 border-border rounded-r-lg" />
          ))}
        </div>

        {/* Semi-finals */}
        <div className="space-y-4">
          <h3 className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Semifinais
          </h3>
          <div className="space-y-24">
            {semis.map(m => (
              <BracketMatchCard key={m.id} match={m} />
            ))}
          </div>
        </div>

        {/* Connectors */}
        <div className="flex flex-col justify-center">
          <div className="w-8 h-40 border-r-2 border-t-2 border-b-2 border-border rounded-r-lg" />
        </div>

        {/* Final & 3rd place */}
        <div className="space-y-8">
          <div>
            <h3 className="text-xs font-heading font-semibold text-primary uppercase tracking-wider mb-3">
              🏆 Final
            </h3>
            {final && <BracketMatchCard match={final} />}
          </div>
          <div>
            <h3 className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              3º Lugar
            </h3>
            {thirdPlace && <BracketMatchCard match={thirdPlace} />}
          </div>
        </div>
      </div>
    </div>
  );
}
