import { myFetch } from "@/lib/backend";
import myEnv from "@/lib/env";
import type { Competition } from "./competition.type";
import type { Team } from "../teams/team.type";

export class CompetitionService {

  static async list(): Promise<Competition[]> {
    const competitions = await myFetch<Competition[]>(`${myEnv.backendApiUrl}/competitions`);
    return competitions;
  }

  static async get(id: number): Promise<Competition> {
    const competition = await myFetch<Competition>(`${myEnv.backendApiUrl}/competitions/${id}`);
    return competition;
  }

  static async create(data: Partial<Competition>): Promise<Competition> {
    const competition = await myFetch<Competition>(`${myEnv.backendApiUrl}/competitions`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return competition;
  }

  static async update({ id, data }: { id: number, data: Partial<Competition> }): Promise<Competition> {
    const updatedCompetition = await myFetch<Competition>(`${myEnv.backendApiUrl}/competitions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return updatedCompetition;
  }

  static async delete(id: number): Promise<void> {
    await myFetch<null>(`${myEnv.backendApiUrl}/competitions/${id}`, {
      method: 'DELETE'
    });
  }

  // Gestione teams della competition
  static async getTeams(competitionId: number): Promise<Team[]> {
    const teams = await myFetch<Team[]>(`${myEnv.backendApiUrl}/competitions/${competitionId}/teams`);
    return teams;
  }

  static async addTeam(competitionId: number, teamId: number): Promise<void> {
    await myFetch<void>(`${myEnv.backendApiUrl}/competitions/${competitionId}/teams`, {
      method: 'POST',
      body: JSON.stringify({ team_id: teamId })
    });
  }

  static async removeTeam(competitionId: number, teamId: number): Promise<void> {
    await myFetch<void>(`${myEnv.backendApiUrl}/competitions/${competitionId}/teams/${teamId}`, {
      method: 'DELETE'
    });
  }

  // Avvia il torneo
  static async start(competitionId: number): Promise<void> {
    await myFetch<void>(`${myEnv.backendApiUrl}/competitions/${competitionId}/start`, {
      method: 'POST'
    });
  }
}