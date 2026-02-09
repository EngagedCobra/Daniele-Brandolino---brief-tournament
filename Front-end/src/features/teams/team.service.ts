import { myFetch } from "@/lib/backend";
import myEnv from "@/lib/env";
import type { Team } from "./team.type";

export class TeamService {

    static async list(): Promise<Team[]> {
        const categories = await myFetch<Team[]>(`${myEnv.backendApiUrl}/teams`);
        return categories;
    }
}