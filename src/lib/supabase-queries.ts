import { supabase } from "@/integrations/supabase/client";
import { Team, Match, Participant, Bet } from "@/types/bolao";

// ========================
// STAGE LABELS (static, no DB needed)
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

// ========================
// TEAMS
// ========================
export async function fetchTeams(): Promise<Team[]> {
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .order("id");
  if (error) throw error;
  return (data || []).map((t) => ({
    id: t.id,
    name: t.name,
    flag: t.flag,
    group: t.group ?? undefined,
  }));
}

// ========================
// MATCHES
// ========================
interface MatchRow {
  id: string;
  home_team_id: string | null;
  away_team_id: string | null;
  home_score: number | null;
  away_score: number | null;
  date: string;
  stage: string;
  group: string | null;
  played: boolean;
}

export async function fetchMatches(teams?: Team[]): Promise<Match[]> {
  const allTeams = teams || (await fetchTeams());
  const teamMap = new Map(allTeams.map((t) => [t.id, t]));
  const placeholder: Team = { id: "tbd", name: "A definir", flag: "🏳️" };

  const { data, error } = await supabase
    .from("matches")
    .select("*")
    .order("date");
  if (error) throw error;

  return (data as MatchRow[] || []).map((m) => ({
    id: m.id,
    homeTeam: teamMap.get(m.home_team_id || "") || placeholder,
    awayTeam: teamMap.get(m.away_team_id || "") || placeholder,
    homeScore: m.home_score ?? undefined,
    awayScore: m.away_score ?? undefined,
    date: m.date,
    stage: m.stage as Match["stage"],
    group: m.group ?? undefined,
    played: m.played,
  }));
}

export async function updateMatchResult(
  matchId: string,
  homeScore: number,
  awayScore: number,
  played: boolean = true
) {
  const { error } = await supabase
    .from("matches")
    .update({ home_score: homeScore, away_score: awayScore, played })
    .eq("id", matchId);
  if (error) throw error;
}

export async function clearMatchResult(matchId: string) {
  const { error } = await supabase
    .from("matches")
    .update({ home_score: null, away_score: null, played: false })
    .eq("id", matchId);
  if (error) throw error;
}

export async function updateMatchTeams(
  matchId: string,
  homeTeamId: string,
  awayTeamId: string
) {
  const { error } = await supabase
    .from("matches")
    .update({ home_team_id: homeTeamId, away_team_id: awayTeamId })
    .eq("id", matchId);
  if (error) throw error;
}

// ========================
// PARTICIPANTS
// ========================
interface ParticipantRow {
  id: string;
  name: string;
  avatar: string;
  cup_group: string | null;
  cup_eliminated: boolean;
}

export async function fetchParticipants(): Promise<Participant[]> {
  const { data, error } = await supabase
    .from("participants")
    .select("*")
    .order("name");
  if (error) throw error;
  return (data as ParticipantRow[] || []).map((p) => ({
    id: p.id,
    name: p.name,
    avatar: p.avatar,
    totalPoints: 0,
    leaguePoints: 0,
    cupGroup: p.cup_group ?? undefined,
    cupEliminated: p.cup_eliminated,
  }));
}

export async function addParticipant(name: string, cupGroup?: string) {
  const avatar = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const { data, error } = await supabase
    .from("participants")
    .insert({ name, avatar, cup_group: cupGroup || null })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateParticipant(id: string, updates: { name?: string; cup_group?: string; cup_eliminated?: boolean }) {
  const payload: Record<string, unknown> = {};
  if (updates.name !== undefined) {
    payload.name = updates.name;
    payload.avatar = updates.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  }
  if (updates.cup_group !== undefined) payload.cup_group = updates.cup_group;
  if (updates.cup_eliminated !== undefined) payload.cup_eliminated = updates.cup_eliminated;

  const { error } = await supabase
    .from("participants")
    .update(payload)
    .eq("id", id);
  if (error) throw error;
}

export async function deleteParticipant(id: string) {
  const { error } = await supabase.from("participants").delete().eq("id", id);
  if (error) throw error;
}

// ========================
// BETS
// ========================
export async function fetchBets(participantId?: string): Promise<Bet[]> {
  let query = supabase.from("bets").select("*");
  if (participantId) query = query.eq("participant_id", participantId);
  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map((b) => ({
    id: b.id,
    matchId: b.match_id,
    participantId: b.participant_id,
    homeScore: b.home_score,
    awayScore: b.away_score,
  }));
}

export async function upsertBet(
  matchId: string,
  participantId: string,
  homeScore: number,
  awayScore: number
) {
  const { error } = await supabase
    .from("bets")
    .upsert(
      {
        match_id: matchId,
        participant_id: participantId,
        home_score: homeScore,
        away_score: awayScore,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "match_id,participant_id" }
    );
  if (error) throw error;
}

// ========================
// CUP BRACKET
// ========================
export async function fetchCupBracketMatches(participants?: Participant[]) {
  const { data, error } = await supabase
    .from("cup_bracket_matches")
    .select("*")
    .order("sort_order");
  if (error) throw error;

  const allParticipants = participants || (await fetchParticipants());
  const pMap = new Map(allParticipants.map((p) => [p.id, p]));

  return (data || []).map((m) => ({
    id: m.id,
    stage: m.stage as Match["stage"],
    participant1: m.participant1_id ? pMap.get(m.participant1_id) : undefined,
    participant2: m.participant2_id ? pMap.get(m.participant2_id) : undefined,
    score1: m.score1 ?? undefined,
    score2: m.score2 ?? undefined,
    winner: m.winner_id ? pMap.get(m.winner_id) : undefined,
  }));
}

export async function upsertCupBracketMatch(
  id: string,
  stage: string,
  sortOrder: number,
  participant1Id?: string,
  participant2Id?: string,
  score1?: number,
  score2?: number,
  winnerId?: string
) {
  const { error } = await supabase
    .from("cup_bracket_matches")
    .upsert({
      id,
      stage,
      sort_order: sortOrder,
      participant1_id: participant1Id || null,
      participant2_id: participant2Id || null,
      score1: score1 ?? null,
      score2: score2 ?? null,
      winner_id: winnerId || null,
    });
  if (error) throw error;
}

// ========================
// SPECIAL BETS (Champion + Top Scorer)
// ========================
export interface SpecialBetRow {
  id: string;
  participant_id: string;
  champion_team_id: string | null;
  top_scorer_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface SpecialResultRow {
  id: string;
  champion_team_id: string | null;
  top_scorer_name: string | null;
  updated_at: string;
}

export async function fetchSpecialBets(): Promise<SpecialBetRow[]> {
  const { data, error } = await supabase.from("special_bets").select("*");
  if (error) throw error;
  return data || [];
}

export async function fetchSpecialBetByParticipant(participantId: string): Promise<SpecialBetRow | null> {
  const { data, error } = await supabase
    .from("special_bets")
    .select("*")
    .eq("participant_id", participantId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function upsertSpecialBet(
  participantId: string,
  championTeamId: string | null,
  topScorerName: string | null
) {
  const { error } = await supabase
    .from("special_bets")
    .upsert(
      {
        participant_id: participantId,
        champion_team_id: championTeamId,
        top_scorer_name: topScorerName,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "participant_id" }
    );
  if (error) throw error;
}

export async function fetchSpecialResults(): Promise<SpecialResultRow | null> {
  const { data, error } = await supabase
    .from("special_results")
    .select("*")
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function upsertSpecialResults(
  championTeamId: string | null,
  topScorerName: string | null
) {
  const existing = await fetchSpecialResults();
  if (existing) {
    const { error } = await supabase
      .from("special_results")
      .update({ champion_team_id: championTeamId, top_scorer_name: topScorerName, updated_at: new Date().toISOString() })
      .eq("id", existing.id);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("special_results")
      .insert({ champion_team_id: championTeamId, top_scorer_name: topScorerName });
    if (error) throw error;
  }
}

// ========================
// Check if group stage is over (any round-of-32 match has teams assigned)
// ========================
export async function isGroupStageOver(): Promise<boolean> {
  const { data, error } = await supabase
    .from("matches")
    .select("id, home_team_id, away_team_id")
    .neq("stage", "group")
    .not("home_team_id", "is", null)
    .not("away_team_id", "is", null)
    .limit(1);
  if (error) throw error;
  return (data || []).length > 0;
}

// ========================
// COMPUTED: Participant points from bets
// ========================
export async function computeParticipantPoints(
  matches: Match[],
  bets: Bet[]
): Promise<Map<string, number>> {
  const { calculateScore } = await import("@/lib/scoring");
  const pointsMap = new Map<string, number>();

  for (const bet of bets) {
    const match = matches.find((m) => m.id === bet.matchId);
    if (!match?.played || match.homeScore === undefined || match.awayScore === undefined) continue;
    const result = calculateScore(bet.homeScore, bet.awayScore, match.homeScore, match.awayScore);
    const current = pointsMap.get(bet.participantId) || 0;
    pointsMap.set(bet.participantId, current + result.points);
  }

  return pointsMap;
}
