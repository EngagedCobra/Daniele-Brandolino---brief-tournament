import type { Team } from "../teams/team.type";
import z from "zod"

export type Athlete = {
    id: number;
    name: string;
    surname: string;
    age: number;
    team_id: number;
    team: Team;
}

export const updateAthleteSchema = z.object({
    name: z.string().min(1, "Il nome è obbligatorio").max(50, "Il nome è troppo lungo").trim(),
    surname: z.string().min(1, "Il cognome è obbligatorio").max(50, "Il cognome è troppo lungo").trim(),
    age: z.coerce.number().int().min(18, "L'atleta deve essere maggiorenne").max(40, "L'atleta non può avere più di 40 anni"),
});
export type UpdateAthleteData = z.infer<typeof updateAthleteSchema>;

export const createAthleteSchema = z.object({
    name: z.string().min(1, "Il nome è obbligatorio").max(50, "Il nome è troppo lungo").trim(),
    surname: z.string().min(1, "Il cognome è obbligatorio").max(50, "Il cognome è troppo lungo").trim(),
    age: z.coerce.number().int().min(18, "L'atleta deve essere maggiorenne").max(40, "L'atleta non può avere più di 40 anni"),
    team_id: z.coerce.number().int()
})
export type CreateAthleteData = z.infer<typeof createAthleteSchema>