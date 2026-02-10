import { myFetch } from "@/lib/backend";
import myEnv from "@/lib/env";
import type { Athlete } from "./athlete.type";


export class AthleteService {
  
  static async create(data: Omit<Partial<Athlete>, "id">) {
    const athlete = await myFetch<Athlete>(`${myEnv.backendApiUrl}/athletes`, {
      method: 'POST',
      body: JSON.stringify(data)
    })
    return athlete;
  }

  static async list(): Promise<Athlete[]> {
    const teams = await myFetch<Athlete[]>(`${myEnv.backendApiUrl}/athletes`);
    return teams;
  }
  static async getByTeam(teamId: number): Promise<Athlete[]> {
    const athletes = await myFetch<Athlete[]>(
      `${myEnv.backendApiUrl}/athletes?team_id=${teamId}`
    );
    return athletes;
  }

  static async update({ id, data }: { id: number, data: Omit<Partial<Athlete>, 'id'> }): Promise<Athlete> {
    const updatedAthlete = await myFetch<Athlete>(`${myEnv.backendApiUrl}/athletes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
    return updatedAthlete;
  }

  static async delete(id:number): Promise<void> {
    await myFetch<null>(`${myEnv.backendApiUrl}/athletes/${id}`, { method: 'DELETE' });
  }

}

