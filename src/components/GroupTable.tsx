import { GroupStanding } from "@/types/bolao";

interface GroupTableProps {
  group: string;
  standings: GroupStanding[];
}

export function GroupTable({ group, standings }: GroupTableProps) {
  return (
    <div className="glass rounded-lg overflow-hidden">
      <div className="bg-primary/10 px-4 py-2">
        <h3 className="font-heading font-semibold text-sm">Grupo {group}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-muted-foreground border-b border-border">
              <th className="text-left px-4 py-2">#</th>
              <th className="text-left px-2 py-2">Participante</th>
              <th className="text-center px-2 py-2">P</th>
              <th className="text-center px-2 py-2">V</th>
              <th className="text-center px-2 py-2">E</th>
              <th className="text-center px-2 py-2">D</th>
              <th className="text-center px-2 py-2">SG</th>
              <th className="text-center px-2 py-2 font-bold">Pts</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((s, i) => (
              <tr
                key={s.participant.id}
                className={`border-b border-border/50 last:border-0 transition-colors hover:bg-muted/50 ${
                  i < 2 ? "bg-primary/5" : ""
                }`}
              >
                <td className="px-4 py-2">
                  <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${
                    i < 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    {i + 1}
                  </span>
                </td>
                <td className="px-2 py-2 font-medium">{s.participant.name}</td>
                <td className="text-center px-2 py-2 text-muted-foreground">{s.wins + s.draws + s.losses}</td>
                <td className="text-center px-2 py-2 text-success">{s.wins}</td>
                <td className="text-center px-2 py-2">{s.draws}</td>
                <td className="text-center px-2 py-2 text-destructive">{s.losses}</td>
                <td className="text-center px-2 py-2">{s.goalDifference > 0 ? `+${s.goalDifference}` : s.goalDifference}</td>
                <td className="text-center px-2 py-2 font-bold text-primary">{s.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
