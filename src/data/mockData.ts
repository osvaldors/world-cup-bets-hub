import { Team, Match, Participant, Bet, GroupStanding, CupBracketMatch } from "@/types/bolao";

// ========================
// 48 TEAMS - FIFA World Cup 2026
// ========================
export const teams: Team[] = [
  // Group A
  { id: "mex", name: "México", flag: "🇲🇽", group: "A" },
  { id: "rsa", name: "África do Sul", flag: "🇿🇦", group: "A" },
  { id: "kor", name: "Coreia do Sul", flag: "🇰🇷", group: "A" },
  { id: "ue_d", name: "UEFA Path D", flag: "🏳️", group: "A" },
  // Group B
  { id: "can", name: "Canadá", flag: "🇨🇦", group: "B" },
  { id: "ue_a", name: "UEFA Path A", flag: "🏳️", group: "B" },
  { id: "qat", name: "Catar", flag: "🇶🇦", group: "B" },
  { id: "sui", name: "Suíça", flag: "🇨🇭", group: "B" },
  // Group C
  { id: "bra", name: "Brasil", flag: "🇧🇷", group: "C" },
  { id: "mar", name: "Marrocos", flag: "🇲🇦", group: "C" },
  { id: "hai", name: "Haiti", flag: "🇭🇹", group: "C" },
  { id: "sco", name: "Escócia", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", group: "C" },
  // Group D
  { id: "usa", name: "EUA", flag: "🇺🇸", group: "D" },
  { id: "par", name: "Paraguai", flag: "🇵🇾", group: "D" },
  { id: "aus", name: "Austrália", flag: "🇦🇺", group: "D" },
  { id: "ue_c", name: "UEFA Path C", flag: "🏳️", group: "D" },
  // Group E
  { id: "ger", name: "Alemanha", flag: "🇩🇪", group: "E" },
  { id: "cur", name: "Curaçao", flag: "🇨🇼", group: "E" },
  { id: "civ", name: "Costa do Marfim", flag: "🇨🇮", group: "E" },
  { id: "ecu", name: "Equador", flag: "🇪🇨", group: "E" },
  // Group F
  { id: "ned", name: "Holanda", flag: "🇳🇱", group: "F" },
  { id: "jpn", name: "Japão", flag: "🇯🇵", group: "F" },
  { id: "ue_b", name: "UEFA Path B", flag: "🏳️", group: "F" },
  { id: "tun", name: "Tunísia", flag: "🇹🇳", group: "F" },
  // Group G
  { id: "bel", name: "Bélgica", flag: "🇧🇪", group: "G" },
  { id: "egy", name: "Egito", flag: "🇪🇬", group: "G" },
  { id: "irn", name: "Irã", flag: "🇮🇷", group: "G" },
  { id: "nzl", name: "Nova Zelândia", flag: "🇳🇿", group: "G" },
  // Group H
  { id: "esp", name: "Espanha", flag: "🇪🇸", group: "H" },
  { id: "cpv", name: "Cabo Verde", flag: "🇨🇻", group: "H" },
  { id: "ksa", name: "Arábia Saudita", flag: "🇸🇦", group: "H" },
  { id: "uru", name: "Uruguai", flag: "🇺🇾", group: "H" },
  // Group I
  { id: "fra", name: "França", flag: "🇫🇷", group: "I" },
  { id: "sen", name: "Senegal", flag: "🇸🇳", group: "I" },
  { id: "ic_2", name: "IC Path 2", flag: "🏳️", group: "I" },
  { id: "nor", name: "Noruega", flag: "🇳🇴", group: "I" },
  // Group J
  { id: "arg", name: "Argentina", flag: "🇦🇷", group: "J" },
  { id: "alg", name: "Argélia", flag: "🇩🇿", group: "J" },
  { id: "aut", name: "Áustria", flag: "🇦🇹", group: "J" },
  { id: "jor", name: "Jordânia", flag: "🇯🇴", group: "J" },
  // Group K
  { id: "por", name: "Portugal", flag: "🇵🇹", group: "K" },
  { id: "ic_1", name: "IC Path 1", flag: "🏳️", group: "K" },
  { id: "uzb", name: "Uzbequistão", flag: "🇺🇿", group: "K" },
  { id: "col", name: "Colômbia", flag: "🇨🇴", group: "K" },
  // Group L
  { id: "eng", name: "Inglaterra", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", group: "L" },
  { id: "cro", name: "Croácia", flag: "🇭🇷", group: "L" },
  { id: "gha", name: "Gana", flag: "🇬🇭", group: "L" },
  { id: "pan", name: "Panamá", flag: "🇵🇦", group: "L" },
];

function t(id: string): Team {
  return teams.find(team => team.id === id)!;
}

// ========================
// ALL MATCHES - 104 total
// ========================
// Group stage: 12 groups × 6 matches = 72
// Round of 32: 16, Round of 16: 8, QF: 4, SF: 2, 3rd: 1, Final: 1
export const matches: Match[] = [
  // ===== GROUP A =====
  { id: "ga1", homeTeam: t("mex"), awayTeam: t("rsa"), date: "2026-06-11T18:00", stage: "group", group: "A", played: false },
  { id: "ga2", homeTeam: t("kor"), awayTeam: t("ue_d"), date: "2026-06-12T12:00", stage: "group", group: "A", played: false },
  { id: "ga3", homeTeam: t("mex"), awayTeam: t("kor"), date: "2026-06-16T18:00", stage: "group", group: "A", played: false },
  { id: "ga4", homeTeam: t("rsa"), awayTeam: t("ue_d"), date: "2026-06-16T15:00", stage: "group", group: "A", played: false },
  { id: "ga5", homeTeam: t("ue_d"), awayTeam: t("mex"), date: "2026-06-20T18:00", stage: "group", group: "A", played: false },
  { id: "ga6", homeTeam: t("rsa"), awayTeam: t("kor"), date: "2026-06-20T18:00", stage: "group", group: "A", played: false },
  // ===== GROUP B =====
  { id: "gb1", homeTeam: t("can"), awayTeam: t("ue_a"), date: "2026-06-12T15:00", stage: "group", group: "B", played: false },
  { id: "gb2", homeTeam: t("qat"), awayTeam: t("sui"), date: "2026-06-12T18:00", stage: "group", group: "B", played: false },
  { id: "gb3", homeTeam: t("can"), awayTeam: t("qat"), date: "2026-06-17T15:00", stage: "group", group: "B", played: false },
  { id: "gb4", homeTeam: t("ue_a"), awayTeam: t("sui"), date: "2026-06-17T18:00", stage: "group", group: "B", played: false },
  { id: "gb5", homeTeam: t("sui"), awayTeam: t("can"), date: "2026-06-21T18:00", stage: "group", group: "B", played: false },
  { id: "gb6", homeTeam: t("ue_a"), awayTeam: t("qat"), date: "2026-06-21T18:00", stage: "group", group: "B", played: false },
  // ===== GROUP C =====
  { id: "gc1", homeTeam: t("bra"), awayTeam: t("mar"), date: "2026-06-13T18:00", stage: "group", group: "C", played: false },
  { id: "gc2", homeTeam: t("hai"), awayTeam: t("sco"), date: "2026-06-13T15:00", stage: "group", group: "C", played: false },
  { id: "gc3", homeTeam: t("bra"), awayTeam: t("hai"), date: "2026-06-18T18:00", stage: "group", group: "C", played: false },
  { id: "gc4", homeTeam: t("mar"), awayTeam: t("sco"), date: "2026-06-18T15:00", stage: "group", group: "C", played: false },
  { id: "gc5", homeTeam: t("sco"), awayTeam: t("bra"), date: "2026-06-22T18:00", stage: "group", group: "C", played: false },
  { id: "gc6", homeTeam: t("mar"), awayTeam: t("hai"), date: "2026-06-22T18:00", stage: "group", group: "C", played: false },
  // ===== GROUP D =====
  { id: "gd1", homeTeam: t("usa"), awayTeam: t("par"), date: "2026-06-12T21:00", stage: "group", group: "D", played: false },
  { id: "gd2", homeTeam: t("aus"), awayTeam: t("ue_c"), date: "2026-06-13T12:00", stage: "group", group: "D", played: false },
  { id: "gd3", homeTeam: t("usa"), awayTeam: t("aus"), date: "2026-06-17T21:00", stage: "group", group: "D", played: false },
  { id: "gd4", homeTeam: t("par"), awayTeam: t("ue_c"), date: "2026-06-17T12:00", stage: "group", group: "D", played: false },
  { id: "gd5", homeTeam: t("ue_c"), awayTeam: t("usa"), date: "2026-06-21T21:00", stage: "group", group: "D", played: false },
  { id: "gd6", homeTeam: t("par"), awayTeam: t("aus"), date: "2026-06-21T21:00", stage: "group", group: "D", played: false },
  // ===== GROUP E =====
  { id: "ge1", homeTeam: t("ger"), awayTeam: t("cur"), date: "2026-06-14T15:00", stage: "group", group: "E", played: false },
  { id: "ge2", homeTeam: t("civ"), awayTeam: t("ecu"), date: "2026-06-14T18:00", stage: "group", group: "E", played: false },
  { id: "ge3", homeTeam: t("ger"), awayTeam: t("civ"), date: "2026-06-19T15:00", stage: "group", group: "E", played: false },
  { id: "ge4", homeTeam: t("cur"), awayTeam: t("ecu"), date: "2026-06-19T18:00", stage: "group", group: "E", played: false },
  { id: "ge5", homeTeam: t("ecu"), awayTeam: t("ger"), date: "2026-06-23T18:00", stage: "group", group: "E", played: false },
  { id: "ge6", homeTeam: t("cur"), awayTeam: t("civ"), date: "2026-06-23T18:00", stage: "group", group: "E", played: false },
  // ===== GROUP F =====
  { id: "gf1", homeTeam: t("ned"), awayTeam: t("jpn"), date: "2026-06-14T21:00", stage: "group", group: "F", played: false },
  { id: "gf2", homeTeam: t("ue_b"), awayTeam: t("tun"), date: "2026-06-14T12:00", stage: "group", group: "F", played: false },
  { id: "gf3", homeTeam: t("ned"), awayTeam: t("ue_b"), date: "2026-06-19T21:00", stage: "group", group: "F", played: false },
  { id: "gf4", homeTeam: t("jpn"), awayTeam: t("tun"), date: "2026-06-19T12:00", stage: "group", group: "F", played: false },
  { id: "gf5", homeTeam: t("tun"), awayTeam: t("ned"), date: "2026-06-23T21:00", stage: "group", group: "F", played: false },
  { id: "gf6", homeTeam: t("jpn"), awayTeam: t("ue_b"), date: "2026-06-23T21:00", stage: "group", group: "F", played: false },
  // ===== GROUP G =====
  { id: "gg1", homeTeam: t("bel"), awayTeam: t("egy"), date: "2026-06-15T15:00", stage: "group", group: "G", played: false },
  { id: "gg2", homeTeam: t("irn"), awayTeam: t("nzl"), date: "2026-06-15T18:00", stage: "group", group: "G", played: false },
  { id: "gg3", homeTeam: t("bel"), awayTeam: t("irn"), date: "2026-06-20T15:00", stage: "group", group: "G", played: false },
  { id: "gg4", homeTeam: t("egy"), awayTeam: t("nzl"), date: "2026-06-20T12:00", stage: "group", group: "G", played: false },
  { id: "gg5", homeTeam: t("nzl"), awayTeam: t("bel"), date: "2026-06-24T18:00", stage: "group", group: "G", played: false },
  { id: "gg6", homeTeam: t("egy"), awayTeam: t("irn"), date: "2026-06-24T18:00", stage: "group", group: "G", played: false },
  // ===== GROUP H =====
  { id: "gh1", homeTeam: t("esp"), awayTeam: t("cpv"), date: "2026-06-15T21:00", stage: "group", group: "H", played: false },
  { id: "gh2", homeTeam: t("ksa"), awayTeam: t("uru"), date: "2026-06-15T12:00", stage: "group", group: "H", played: false },
  { id: "gh3", homeTeam: t("esp"), awayTeam: t("ksa"), date: "2026-06-20T21:00", stage: "group", group: "H", played: false },
  { id: "gh4", homeTeam: t("cpv"), awayTeam: t("uru"), date: "2026-06-20T12:00", stage: "group", group: "H", played: false },
  { id: "gh5", homeTeam: t("uru"), awayTeam: t("esp"), date: "2026-06-24T21:00", stage: "group", group: "H", played: false },
  { id: "gh6", homeTeam: t("cpv"), awayTeam: t("ksa"), date: "2026-06-24T21:00", stage: "group", group: "H", played: false },
  // ===== GROUP I =====
  { id: "gi1", homeTeam: t("fra"), awayTeam: t("sen"), date: "2026-06-16T18:00", stage: "group", group: "I", played: false },
  { id: "gi2", homeTeam: t("ic_2"), awayTeam: t("nor"), date: "2026-06-16T12:00", stage: "group", group: "I", played: false },
  { id: "gi3", homeTeam: t("fra"), awayTeam: t("ic_2"), date: "2026-06-21T15:00", stage: "group", group: "I", played: false },
  { id: "gi4", homeTeam: t("sen"), awayTeam: t("nor"), date: "2026-06-21T12:00", stage: "group", group: "I", played: false },
  { id: "gi5", homeTeam: t("nor"), awayTeam: t("fra"), date: "2026-06-25T18:00", stage: "group", group: "I", played: false },
  { id: "gi6", homeTeam: t("sen"), awayTeam: t("ic_2"), date: "2026-06-25T18:00", stage: "group", group: "I", played: false },
  // ===== GROUP J =====
  { id: "gj1", homeTeam: t("arg"), awayTeam: t("alg"), date: "2026-06-16T21:00", stage: "group", group: "J", played: false },
  { id: "gj2", homeTeam: t("aut"), awayTeam: t("jor"), date: "2026-06-16T15:00", stage: "group", group: "J", played: false },
  { id: "gj3", homeTeam: t("arg"), awayTeam: t("aut"), date: "2026-06-21T21:00", stage: "group", group: "J", played: false },
  { id: "gj4", homeTeam: t("alg"), awayTeam: t("jor"), date: "2026-06-21T15:00", stage: "group", group: "J", played: false },
  { id: "gj5", homeTeam: t("jor"), awayTeam: t("arg"), date: "2026-06-25T21:00", stage: "group", group: "J", played: false },
  { id: "gj6", homeTeam: t("alg"), awayTeam: t("aut"), date: "2026-06-25T21:00", stage: "group", group: "J", played: false },
  // ===== GROUP K =====
  { id: "gk1", homeTeam: t("por"), awayTeam: t("ic_1"), date: "2026-06-17T18:00", stage: "group", group: "K", played: false },
  { id: "gk2", homeTeam: t("uzb"), awayTeam: t("col"), date: "2026-06-17T21:00", stage: "group", group: "K", played: false },
  { id: "gk3", homeTeam: t("por"), awayTeam: t("uzb"), date: "2026-06-22T15:00", stage: "group", group: "K", played: false },
  { id: "gk4", homeTeam: t("ic_1"), awayTeam: t("col"), date: "2026-06-22T12:00", stage: "group", group: "K", played: false },
  { id: "gk5", homeTeam: t("col"), awayTeam: t("por"), date: "2026-06-26T18:00", stage: "group", group: "K", played: false },
  { id: "gk6", homeTeam: t("ic_1"), awayTeam: t("uzb"), date: "2026-06-26T18:00", stage: "group", group: "K", played: false },
  // ===== GROUP L =====
  { id: "gl1", homeTeam: t("eng"), awayTeam: t("cro"), date: "2026-06-17T12:00", stage: "group", group: "L", played: false },
  { id: "gl2", homeTeam: t("gha"), awayTeam: t("pan"), date: "2026-06-17T15:00", stage: "group", group: "L", played: false },
  { id: "gl3", homeTeam: t("eng"), awayTeam: t("gha"), date: "2026-06-22T21:00", stage: "group", group: "L", played: false },
  { id: "gl4", homeTeam: t("cro"), awayTeam: t("pan"), date: "2026-06-22T18:00", stage: "group", group: "L", played: false },
  { id: "gl5", homeTeam: t("pan"), awayTeam: t("eng"), date: "2026-06-26T21:00", stage: "group", group: "L", played: false },
  { id: "gl6", homeTeam: t("cro"), awayTeam: t("gha"), date: "2026-06-26T21:00", stage: "group", group: "L", played: false },

  // ===== ROUND OF 32 (16 matches) =====
  { id: "r32-1", homeTeam: t("mex"), awayTeam: t("sui"), date: "2026-06-28T15:00", stage: "round-of-32", played: false },
  { id: "r32-2", homeTeam: t("can"), awayTeam: t("rsa"), date: "2026-06-28T18:00", stage: "round-of-32", played: false },
  { id: "r32-3", homeTeam: t("bra"), awayTeam: t("ue_c"), date: "2026-06-28T21:00", stage: "round-of-32", played: false },
  { id: "r32-4", homeTeam: t("usa"), awayTeam: t("sco"), date: "2026-06-29T15:00", stage: "round-of-32", played: false },
  { id: "r32-5", homeTeam: t("ger"), awayTeam: t("tun"), date: "2026-06-29T18:00", stage: "round-of-32", played: false },
  { id: "r32-6", homeTeam: t("ned"), awayTeam: t("ecu"), date: "2026-06-29T21:00", stage: "round-of-32", played: false },
  { id: "r32-7", homeTeam: t("bel"), awayTeam: t("uru"), date: "2026-06-30T15:00", stage: "round-of-32", played: false },
  { id: "r32-8", homeTeam: t("esp"), awayTeam: t("nzl"), date: "2026-06-30T18:00", stage: "round-of-32", played: false },
  { id: "r32-9", homeTeam: t("fra"), awayTeam: t("jor"), date: "2026-06-30T21:00", stage: "round-of-32", played: false },
  { id: "r32-10", homeTeam: t("arg"), awayTeam: t("nor"), date: "2026-07-01T15:00", stage: "round-of-32", played: false },
  { id: "r32-11", homeTeam: t("por"), awayTeam: t("pan"), date: "2026-07-01T18:00", stage: "round-of-32", played: false },
  { id: "r32-12", homeTeam: t("eng"), awayTeam: t("col"), date: "2026-07-01T21:00", stage: "round-of-32", played: false },
  { id: "r32-13", homeTeam: t("kor"), awayTeam: t("qat"), date: "2026-07-02T15:00", stage: "round-of-32", played: false },
  { id: "r32-14", homeTeam: t("mar"), awayTeam: t("par"), date: "2026-07-02T18:00", stage: "round-of-32", played: false },
  { id: "r32-15", homeTeam: t("jpn"), awayTeam: t("civ"), date: "2026-07-02T21:00", stage: "round-of-32", played: false },
  { id: "r32-16", homeTeam: t("sen"), awayTeam: t("alg"), date: "2026-07-03T15:00", stage: "round-of-32", played: false },

  // ===== ROUND OF 16 (8 matches) =====
  { id: "r16-1", homeTeam: t("mex"), awayTeam: t("usa"), date: "2026-07-05T15:00", stage: "round-of-16", played: false },
  { id: "r16-2", homeTeam: t("bra"), awayTeam: t("ned"), date: "2026-07-05T18:00", stage: "round-of-16", played: false },
  { id: "r16-3", homeTeam: t("ger"), awayTeam: t("esp"), date: "2026-07-05T21:00", stage: "round-of-16", played: false },
  { id: "r16-4", homeTeam: t("bel"), awayTeam: t("arg"), date: "2026-07-06T15:00", stage: "round-of-16", played: false },
  { id: "r16-5", homeTeam: t("fra"), awayTeam: t("eng"), date: "2026-07-06T18:00", stage: "round-of-16", played: false },
  { id: "r16-6", homeTeam: t("por"), awayTeam: t("can"), date: "2026-07-06T21:00", stage: "round-of-16", played: false },
  { id: "r16-7", homeTeam: t("kor"), awayTeam: t("jpn"), date: "2026-07-07T15:00", stage: "round-of-16", played: false },
  { id: "r16-8", homeTeam: t("mar"), awayTeam: t("sen"), date: "2026-07-07T18:00", stage: "round-of-16", played: false },

  // ===== QUARTER-FINALS (4 matches) =====
  { id: "qf-1", homeTeam: t("bra"), awayTeam: t("mex"), date: "2026-07-10T18:00", stage: "quarter-final", played: false },
  { id: "qf-2", homeTeam: t("ger"), awayTeam: t("arg"), date: "2026-07-10T21:00", stage: "quarter-final", played: false },
  { id: "qf-3", homeTeam: t("fra"), awayTeam: t("por"), date: "2026-07-11T18:00", stage: "quarter-final", played: false },
  { id: "qf-4", homeTeam: t("kor"), awayTeam: t("mar"), date: "2026-07-11T21:00", stage: "quarter-final", played: false },

  // ===== SEMI-FINALS (2 matches) =====
  { id: "sf-1", homeTeam: t("bra"), awayTeam: t("arg"), date: "2026-07-14T21:00", stage: "semi-final", played: false },
  { id: "sf-2", homeTeam: t("fra"), awayTeam: t("kor"), date: "2026-07-15T21:00", stage: "semi-final", played: false },

  // ===== THIRD PLACE =====
  { id: "3rd", homeTeam: t("arg"), awayTeam: t("kor"), date: "2026-07-18T18:00", stage: "third-place", played: false },

  // ===== FINAL =====
  { id: "final", homeTeam: t("bra"), awayTeam: t("fra"), date: "2026-07-19T18:00", stage: "final", played: false },
];

// ========================
// PARTICIPANTS (16)
// ========================
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

// ========================
// SAMPLE BETS
// ========================
export const sampleBets: Bet[] = [
  { id: "b1", matchId: "ga1", participantId: "p1", homeScore: 2, awayScore: 0 },
  { id: "b2", matchId: "ga1", participantId: "p2", homeScore: 1, awayScore: 1 },
  { id: "b3", matchId: "ga1", participantId: "p5", homeScore: 3, awayScore: 1 },
  { id: "b4", matchId: "gc1", participantId: "p1", homeScore: 2, awayScore: 0 },
  { id: "b5", matchId: "gc1", participantId: "p2", homeScore: 3, awayScore: 1 },
];

// ========================
// CUP GROUP STANDINGS
// ========================
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

// ========================
// CUP BRACKET MATCHES
// ========================
export const cupBracketMatches: CupBracketMatch[] = [
  { id: "cb-qf1", stage: "quarter-final", participant1: participants[0], participant2: participants[5], score1: 3, score2: 1, winner: participants[0] },
  { id: "cb-qf2", stage: "quarter-final", participant1: participants[4], participant2: participants[1], score1: 2, score2: 2, winner: participants[4] },
  { id: "cb-qf3", stage: "quarter-final", participant1: participants[8], participant2: participants[13] },
  { id: "cb-qf4", stage: "quarter-final", participant1: participants[12], participant2: participants[9] },
  { id: "cb-sf1", stage: "semi-final", participant1: participants[0], participant2: participants[4] },
  { id: "cb-sf2", stage: "semi-final" },
  { id: "cb-final", stage: "final" },
  { id: "cb-3rd", stage: "third-place" },
];

// ========================
// STAGE LABELS
// ========================
export const stageLabels: Record<string, string> = {
  'group': 'Fase de Grupos',
  'round-of-32': '16 Avos de Final',
  'round-of-16': 'Oitavas de Final',
  'quarter-final': 'Quartas de Final',
  'semi-final': 'Semifinal',
  'third-place': 'Disputa 3º Lugar',
  'final': 'Final',
};
