import { myFetch } from "@/lib/backend";
import myEnv from "@/lib/env";
import type { Team } from "./team.type";

export class TeamService {

  static async list(): Promise<Team[]> {
    const teams = await myFetch<Team[]>(`${myEnv.backendApiUrl}/teams`);
    return teams;
  }

  static async update({ id, data }: { id: number, data: Omit<Partial<Team>, 'id'> }): Promise<Team> {
    const updatedTeam = await myFetch<Team>(`${myEnv.backendApiUrl}/teams/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
    return updatedTeam;
  }

  static async get(id: number): Promise<Team> {
    const team = await myFetch<Team>(`${myEnv.backendApiUrl}/teams/${id}`)
    return team;
  }

  static async create(data:Partial<Team>) {
    const team = await myFetch<Team>(`${myEnv.backendApiUrl}/teams`, {
      method: 'POST',
      body: JSON.stringify(data)
    })
    return team
  }
}