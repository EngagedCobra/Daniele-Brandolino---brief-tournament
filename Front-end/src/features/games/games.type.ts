export type Game = {
  id: number;
  competition_id: number;
  home_team: number | null;
  away_team: number | null;
  phase: number;
  winner: number | null;
  result: string;
  created_at: string;
  updated_at: string | null;
}