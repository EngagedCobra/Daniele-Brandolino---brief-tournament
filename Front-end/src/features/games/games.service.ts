import { myFetch } from "@/lib/backend";
import myEnv from "@/lib/env";
import type { Game } from "./games.type";

export class GameService {
  
  static async list(): Promise<Game[]> {
    const games = await myFetch<Game[]>(`${myEnv.backendApiUrl}/games`);
    return games;
  }

  static async get(id: number): Promise<Game> {
    const game = await myFetch<Game>(`${myEnv.backendApiUrl}/games/${id}`);
    return game;
  }

  static async getByCompetition(competitionId: number): Promise<Game[]> {
    const games = await myFetch<Game[]>(`${myEnv.backendApiUrl}/competitions/${competitionId}/games`);
    return games;
  }

  static async updateResult(gameId: number, result: string): Promise<Game> {
    const game = await myFetch<Game>(`${myEnv.backendApiUrl}/games/${gameId}`, {
      method: 'PUT',
      body: JSON.stringify({ result })
    });
    return game;
  }
}