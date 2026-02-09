import type { Team } from "../teams/team.type";

export type Athlete = {
    id: number;
    name: string;
    surname: string;
    age: number;
    team_id: Team;
}