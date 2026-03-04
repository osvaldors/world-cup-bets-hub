import { Team, Match, Participant, Bet, GroupStanding, CupBracketMatch } from "@/types/bolao";

export const teams: Team[] = [
  { id: "bra", name: "Brasil", flag: "🇧🇷", group: "A" },
  { id: "ger", name: "Alemanha", flag: "🇩🇪", group: "A" },
  { id: "jpn", name: "Japão", flag: "🇯🇵", group: "A" },
  { id: "can", name: "Canadá", flag: "🇨🇦", group: "A" },
  { id: "arg", name: "Argentina", flag: "🇦🇷", group: "B" },
  { id: "esp", name: "Espanha", flag: "🇪🇸", group: "B" },
  { id: "nig", name: "Nigéria", flag: "🇳🇬", group: "B" },
  { id: "aus", name: "Austrália", flag: "🇦🇺", group: "B" },
  { id: "fra", name: "França", flag: "🇫🇷", group: "C" },
  { id: "eng", name: "Inglaterra", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", group: "C" },
  { id: "mex", name: "México", flag: "🇲🇽", group: "C" },
  { id: "kor", name: "Coreia do Sul", flag: "🇰🇷", group: "C" },
  { id: "por", name: "Portugal", flag: "🇵🇹", group: "D" },
  { id: "ned", name: "Holanda", flag: "🇳🇱", group: "D" },
  { id: "usa", name: "EUA", flag: "🇺🇸", group: "D" },
  { id: "sen", name: "Senegal", flag: "🇸🇳", group: "D" },
  { id: "uru", name: "Uruguai", flag: "🇺🇾", group: "E" },
  { id: "cro", name: "Croácia", flag: "🇭🇷", group: "E" },
  { id: "mar", name: "Marrocos", flag: "🇲🇦", group: "E" },
  { id: "pol", name: "Polônia", flag: "🇵🇱", group: "E" },
  { id: "bel", name: "Bélgica", flag: "🇧🇪", group: "F" },
  { id: "col", name: "Colômbia", flag: "🇨🇴", group: "F" },
  { id: "cmr", name: "Camarões", flag: "🇨🇲", group: "F" },
  { id: "srb", name: "Sérvia", flag: "🇷🇸", group: "F" },
  { id: "swi", name: "Suíça", flag: "🇨🇭", group: "G" },
  { id: "den", name: "Dinamarca", flag: "🇩🇰", group: "G" },
  { id: "crc", name: "Costa Rica", flag: "🇨🇷", group: "G" },
  { id: "tun", name: "Tunísia", flag: "🇹🇳", group: "G" },
  { id: "chi", name: "Chile", flag: "🇨🇱", group: "H" },
  { id: "ita", name: "Itália", flag: "🇮🇹", group: "H" },
  { id: "gha", name: "Gana", flag: "🇬🇭", group: "H" },
  { id: "irn", name: "Irã", flag: "🇮🇷", group: "H" },
];

export const matches: Match[] = [
  // Group A
  { id: "m1", homeTeam: teams[0], awayTeam: teams[1], homeScore: 2, awayScore: 1, date: "2026-06-11", stage: "group", group: "A", played: true },
  { id: "m2", homeTeam: teams[2], awayTeam: teams[3], homeScore: 0, awayScore: 0, date: "2026-06-11", stage: "group", group: "A", played: true },
  { id: "m3", homeTeam: teams[0], awayTeam: teams[2], homeScore: 3, awayScore: 1, date: "2026-06-15", stage: "group", group: "A", played: true },
  { id: "m4", homeTeam: teams[1], awayTeam: teams[3], homeScore: 4, awayScore: 0, date: "2026-06-15", stage: "group", group: "A", played: true },
  { id: "m5", homeTeam: teams[0], awayTeam: teams[3], date: "2026-06-19", stage: "group", group: "A", played: false },
  { id: "m6", homeTeam: teams[1], awayTeam: teams[2], date: "2026-06-19", stage: "group", group: "A", played: false },
  // Group B
  { id: "m7", homeTeam: teams[4], awayTeam: teams[5], homeScore: 1, awayScore: 1, date: "2026-06-12", stage: "group", group: "B", played: true },
  { id: "m8", homeTeam: teams[6], awayTeam: teams[7], homeScore: 2, awayScore: 0, date: "2026-06-12", stage: "group", group: "B", played: true },
  { id: "m9", homeTeam: teams[4], awayTeam: teams[6], date: "2026-06-16", stage: "group", group: "B", played: false },
  { id: "m10", homeTeam: teams[5], awayTeam: teams[7], date: "2026-06-16", stage: "group", group: "B", played: false },
  // Knockout
  { id: "r16-1", homeTeam: teams[0], awayTeam: teams[5], homeScore: 2, awayScore: 0, date: "2026-06-28", stage: "round-of-16", played: true },
  { id: "r16-2", homeTeam: teams[4], awayTeam: teams[1], homeScore: 3, awayScore: 1, date: "2026-06-28", stage: "round-of-16", played: true },
  { id: "r16-3", homeTeam: teams[8], awayTeam: teams[13], date: "2026-06-29", stage: "round-of-16", played: false },
  { id: "r16-4", homeTeam: teams[12], awayTeam: teams[9], date: "2026-06-29", stage: "round-of-16", played: false },
  { id: "qf-1", homeTeam: teams[0], awayTeam: teams[4], date: "2026-07-04", stage: "quarter-final", played: false },
  { id: "sf-1", homeTeam: teams[0], awayTeam: teams[8], date: "2026-07-08", stage: "semi-final", played: false },
  { id: "final", homeTeam: teams[0], awayTeam: teams[4], date: "2026-07-13", stage: "final", played: false },
];

export const participants: Participant[] = [
  { id: "p1", name: "Carlos Silva", avatar: "CS", totalPoints: 145, leaguePoints: 145, cupGroup: "A", cupEliminated: false },
  { id: "p2", name: "Ana Souza", avatar: "AS", totalPoints: 132, leaguePoints: 132, cupGroup: "A", cupEliminated: false },
  { id: "p3", name: "Pedro Santos", avatar: "PS", totalPoints: 128, leaguePoints: 128, cupGroup: "A", cupEliminated: false },
  { id: "p4", name: "Maria Costa", avatar: "MC", totalPoints: 118, leaguePoints: 118, cupGroup: "A", cupEliminated: true },
  { id: "p5", name: "João Oliveira", avatar: "JO", totalPoints: 155, leaguePoints: 155, cupGroup: "B", cupEliminated: false },
  { id: "p6", name: "Lucia Ferreira", avatar: "LF", totalPoints: 140, leaguePoints: 140, cupGroup: "B", cupEliminated: false },
  { id: "p7", name: "Rafael Lima", avatar: "RL", totalPoints: 112, leaguePoints: 112, cupGroup: "B", cupEliminated: false },
  { id: "p8", name: "Fernanda Alves", avatar: "FA", totalPoints: 98, leaguePoints: 98, cupGroup: "B", cupEliminated: true },
  { id: "p9", name: "Bruno Martins", avatar: "BM", totalPoints: 136, leaguePoints: 136, cupGroup: "C", cupEliminated: false },
  { id: "p10", name: "Camila Rocha", avatar: "CR", totalPoints: 125, leaguePoints: 125, cupGroup: "C", cupEliminated: false },
  { id: "p11", name: "Diego Pereira", avatar: "DP", totalPoints: 110, leaguePoints: 110, cupGroup: "C", cupEliminated: true },
  { id: "p12", name: "Isabela Nunes", avatar: "IN", totalPoints: 102, leaguePoints: 102, cupGroup: "C", cupEliminated: true },
  { id: "p13", name: "Gustavo Ribeiro", avatar: "GR", totalPoints: 148, leaguePoints: 148, cupGroup: "D", cupEliminated: false },
  { id: "p14", name: "Tatiana Mendes", avatar: "TM", totalPoints: 130, leaguePoints: 130, cupGroup: "D", cupEliminated: false },
  { id: "p15", name: "Lucas Cardoso", avatar: "LC", totalPoints: 115, leaguePoints: 115, cupGroup: "D", cupEliminated: true },
  { id: "p16", name: "Renata Barbosa", avatar: "RB", totalPoints: 95, leaguePoints: 95, cupGroup: "D", cupEliminated: true },
];

export const sampleBets: Bet[] = [
  { id: "b1", matchId: "m1", participantId: "p1", homeScore: 2, awayScore: 1 },
  { id: "b2", matchId: "m1", participantId: "p2", homeScore: 1, awayScore: 0 },
  { id: "b3", matchId: "m1", participantId: "p5", homeScore: 3, awayScore: 1 },
  { id: "b4", matchId: "m2", participantId: "p1", homeScore: 1, awayScore: 1 },
  { id: "b5", matchId: "m2", participantId: "p2", homeScore: 0, awayScore: 0 },
];

export const cupGroupStandings: Record<string, GroupStanding[]> = {
  A: [
    { participant: participants[0], points: 7, wins: 2, draws: 1, losses: 0, goalsFor: 8, goalsAgainst: 3, goalDifference: 5 },
    { participant: participants[1], points: 5, wins: 1, draws: 2, losses: 0, goalsFor: 5, goalsAgainst: 3, goalDifference: 2 },
    { participant: participants[2], points: 3, wins: 1, draws: 0, losses: 2, goalsFor: 4, goalsAgainst: 6, goalDifference: -2 },
    { participant: participants[3], points: 1, wins: 0, draws: 1, losses: 2, goalsFor: 2, goalsAgainst: 7, goalDifference: -5 },
  ],
  B: [
    { participant: participants[4], points: 9, wins: 3, draws: 0, losses: 0, goalsFor: 9, goalsAgainst: 2, goalDifference: 7 },
    { participant: participants[5], points: 6, wins: 2, draws: 0, losses: 1, goalsFor: 6, goalsAgainst: 4, goalDifference: 2 },
    { participant: participants[6], points: 3, wins: 1, draws: 0, losses: 2, goalsFor: 3, goalsAgainst: 5, goalDifference: -2 },
    { participant: participants[7], points: 0, wins: 0, draws: 0, losses: 3, goalsFor: 1, goalsAgainst: 8, goalDifference: -7 },
  ],
  C: [
    { participant: participants[8], points: 7, wins: 2, draws: 1, losses: 0, goalsFor: 7, goalsAgainst: 3, goalDifference: 4 },
    { participant: participants[9], points: 4, wins: 1, draws: 1, losses: 1, goalsFor: 4, goalsAgainst: 4, goalDifference: 0 },
    { participant: participants[10], points: 3, wins: 1, draws: 0, losses: 2, goalsFor: 3, goalsAgainst: 5, goalDifference: -2 },
    { participant: participants[11], points: 2, wins: 0, draws: 2, losses: 1, goalsFor: 2, goalsAgainst: 4, goalDifference: -2 },
  ],
  D: [
    { participant: participants[12], points: 7, wins: 2, draws: 1, losses: 0, goalsFor: 8, goalsAgainst: 2, goalDifference: 6 },
    { participant: participants[13], points: 5, wins: 1, draws: 2, losses: 0, goalsFor: 5, goalsAgainst: 3, goalDifference: 2 },
    { participant: participants[14], points: 3, wins: 1, draws: 0, losses: 2, goalsFor: 3, goalsAgainst: 6, goalDifference: -3 },
    { participant: participants[15], points: 1, wins: 0, draws: 1, losses: 2, goalsFor: 2, goalsAgainst: 7, goalDifference: -5 },
  ],
};

export const cupBracketMatches: CupBracketMatch[] = [
  // Quarter-finals
  { id: "cb-qf1", stage: "quarter-final", participant1: participants[0], participant2: participants[5], score1: 3, score2: 1, winner: participants[0] },
  { id: "cb-qf2", stage: "quarter-final", participant1: participants[4], participant2: participants[1], score1: 2, score2: 2, winner: participants[4] },
  { id: "cb-qf3", stage: "quarter-final", participant1: participants[8], participant2: participants[13], score1: undefined, score2: undefined },
  { id: "cb-qf4", stage: "quarter-final", participant1: participants[12], participant2: participants[9], score1: undefined, score2: undefined },
  // Semi-finals
  { id: "cb-sf1", stage: "semi-final", participant1: participants[0], participant2: participants[4] },
  { id: "cb-sf2", stage: "semi-final" },
  // Final
  { id: "cb-final", stage: "final" },
  // Third place
  { id: "cb-3rd", stage: "third-place" },
];

export const stageLabels: Record<string, string> = {
  'group': 'Fase de Grupos',
  'round-of-16': 'Oitavas de Final',
  'quarter-final': 'Quartas de Final',
  'semi-final': 'Semifinal',
  'third-place': 'Disputa 3º Lugar',
  'final': 'Final',
};
