export type Competition = {
  id: number;
  name: string;
  team_number: number;
  phases: number;
  winner: number | null;
  created_at: string;
  updated_at: string | null;
}

export type CompetitionTeam = {
  competition_id: number;
  team_id: number;
  created_at: string;
  updated_at: string | null;
}