import { myFetch } from "@/lib/backend";
import myEnv from "@/lib/env";
import type { Team } from "./team.type";

export class TeamService {

    static async list(): Promise<Team[]> {
        const categories = await myFetch<Team[]>(`${myEnv.backendApiUrl}/teams`);
        return categories;
    }

    static async update({ id, data }: { id: number, data: Omit<Partial<Team>, 'id'> }): Promise<Team> {
        const team = await myFetch<Team>(`${myEnv.backendApiUrl}/teams/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        })
        return team;
    }
}