import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Loader2, OctagonAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import z from "zod";
import { AthleteService } from "../athletes/athlete.service";
import { createAthleteSchema, type CreateAthleteData } from "../athletes/athlete.type";
import { TeamService } from "./team.service";
import type { Team } from "./team.type";
import CustomEmpty from "@/components/customEmpty";

const updateTeamSchema = z.object({
  name: z.string().min(1, "Il nome è obbligatorio").max(50, "Il nome è troppo lungo").trim(),
});

const createTeamSchema = z.object({
  name: z.string().min(1, "Il nome è obbligatorio").max(50, "Il nome è troppo lungo").trim(),
})

type UpdateTeamSchema = z.infer<typeof updateTeamSchema>;
type TeamData = z.infer<typeof createTeamSchema>;

const TeamList = () => {
  const [selectedTeam, setSelectedTeam] = useState<Team | undefined>(undefined);
  const [isTeamDialogOpen, setTeamDialogOpen] = useState(false);
  const [isAthleteDialogOpen, setAthleteDialogOpen] = useState(false);
  const [isTeamCreateDialogOpen, setTeamCreateDialogOpen] = useState(false);

  const teamForm = useForm({
    resolver: zodResolver(updateTeamSchema),
  });
  const teamCreateForm = useForm({
    resolver: zodResolver(createTeamSchema)
  })
  const createAthleteForm = useForm({
    resolver: zodResolver(createAthleteSchema),
  });

  const queryClient = useQueryClient();

  const {
    data: teams = [],
    isPending,
    isError,
    refetch,
    error,
  } = useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      const res = await TeamService.list();
      return res.sort((a, b) => a.id - b.id);
    },
  });

  const updateTeamMutation = useMutation({
    mutationFn: TeamService.update,
    onSuccess: () => {
      (queryClient.invalidateQueries({
        queryKey: ["teams"],
      }),
        setTeamDialogOpen(false));
    }

  });

  const createAthleteMutation = useMutation({
    mutationFn: AthleteService.create,
    onSuccess: () => setAthleteDialogOpen(false),
  });
  const createTeamMutation = useMutation({
    mutationFn: TeamService.create,
    onSuccess: () => {
      (queryClient.invalidateQueries({
        queryKey: ["teams"],
      }),
        setTeamCreateDialogOpen(false));
    },
  });

  const handleTeamUpdate = (data: UpdateTeamSchema) => {
    if (!selectedTeam) return;
    updateTeamMutation.mutate({ id: selectedTeam.id, data });
  };

  const handleAthleteCreate = (data: CreateAthleteData) => {
    if (!selectedTeam) return;
    data = {
      ...data,
      team_id: selectedTeam.id
    }
    createAthleteMutation.mutate(data);
  };

  const handleTeamCreate = (data: TeamData) => {
    const createData = {
      ...data,
      logo: ""
    }
    createTeamMutation.mutate(createData);
  };

  useEffect(() => {
    if (selectedTeam) {
      teamForm.setValue("name", selectedTeam.name);
    }
  }, [selectedTeam]);

  if (isPending) {
    return (
      <CustomEmpty title="Caricamento..." message="Attendi mentre vengono caricate le squadre" icon={<Loader2 className="animate-spin" />} />
    );
  }

  if (isError) {
    return (
      <CustomEmpty title="Errore imprevisto" message={error.message} icon={<OctagonAlert />} />
    );
  }

  return (
    <>
      <div className="max-w-3xl mx-auto mt-6">
        {/* TeamCreate Dialog */}
        <Dialog
          open={isTeamCreateDialogOpen}
          onOpenChange={setTeamCreateDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuovo Team</DialogTitle>
              <form onSubmit={teamCreateForm.handleSubmit(handleTeamCreate)}>
                <FieldSet className="w-full max-w-xs">
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="team-name" className="mt-4">
                        Scegli il nuovo nome del team
                      </FieldLabel>
                      <Input
                        id="team-name"
                        type="text"
                        {...teamCreateForm.register("name")}
                      />
                    </Field>
                  </FieldGroup>
                </FieldSet>
                <Button type="submit" className={"mt-4"}>
                  Crea team
                </Button>
              </form>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        {/* TeamEdit Dialog */}
        <Dialog
          open={isTeamDialogOpen}
          onOpenChange={setTeamDialogOpen}
        >
          <DialogTrigger asChild className="px-4 py-2 rounded-2xl hover:cursor-pointer">
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifica Team</DialogTitle>
              <form
                onSubmit={teamForm.handleSubmit(handleTeamUpdate)}
              >
                <FieldSet className="w-full max-w-xs">
                  <FieldGroup>
                    <Field>
                      <FieldLabel
                        htmlFor="team-name"
                        className="mt-4"
                      >
                        Scegli il nuovo nome del team
                      </FieldLabel>
                      <Input
                        id="team-name"
                        type="text"
                        disabled={!selectedTeam}
                        {...teamForm.register("name")}
                      />
                    </Field>
                  </FieldGroup>
                </FieldSet>
                <Button type="submit" className={"mt-4"}>
                  Salva
                </Button>
              </form>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        {/* AthleteAdd Dialog */}
        <Dialog
          open={isAthleteDialogOpen}
          onOpenChange={setAthleteDialogOpen}
        >
          <DialogTrigger asChild className="px-4 py-2 rounded-2xl hover:cursor-pointer">
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Aggiungi atleta</DialogTitle>
              <form
                onSubmit={createAthleteForm.handleSubmit(
                  handleAthleteCreate,
                )}
              >
                <FieldSet className="w-full max-w-xs">
                  <FieldGroup>
                    <Field>
                      <FieldLabel
                        htmlFor="athlete-name"
                        className="mt-4"
                      >
                        Nome
                      </FieldLabel>
                      <Input
                        id="athlete-name"
                        type="text"
                        disabled={!selectedTeam}
                        {...createAthleteForm.register("name")}
                      />
                    </Field>
                  </FieldGroup>
                </FieldSet>
                <FieldSet className="w-full max-w-xs">
                  <FieldGroup>
                    <Field>
                      <FieldLabel
                        htmlFor="athlete-surname"
                        className="mt-4"
                      >
                        Cognome
                      </FieldLabel>
                      <Input
                        id="athlete-surname"
                        type="text"
                        disabled={!selectedTeam}
                        {...createAthleteForm.register("surname")}
                      />
                    </Field>
                  </FieldGroup>
                </FieldSet>
                <FieldSet className="w-full max-w-xs">
                  <FieldGroup>
                    <Field>
                      <FieldLabel
                        htmlFor="athlete-age"
                        className="mt-4"
                      >
                        Età
                      </FieldLabel>
                      <Input
                        id="athlete-age"
                        type="number"
                        disabled={!selectedTeam}
                        {...createAthleteForm.register("age")}
                      />
                    </Field>
                  </FieldGroup>
                </FieldSet>
                <FieldSet className="w-full max-w-xs hidden">
                  <FieldGroup>
                    <Field>
                      <Input
                        value={selectedTeam?.id}
                        type="number"
                        {...createAthleteForm.register("team_id")}
                      />
                    </Field>
                  </FieldGroup>
                </FieldSet>
                <Button type="submit" className={"mt-4"}>
                  Salva
                </Button>
              </form>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        {teams.map((team) => {
          return (
            <>
              <Item key={team.id}>
                <ItemMedia variant="image">
                  <img src={team.logo} />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{team.name}</ItemTitle>
                </ItemContent>
                <ItemActions>
                  <Button variant={"secondary"} className={"w-full shrink"} onClick={() => {
                    setSelectedTeam(team)
                    setTeamDialogOpen(true)
                  }}
                  >Modifica team</Button>
                  <Button variant={"secondary"} className={"w-full shrink"} onClick={() => {
                    setSelectedTeam(team)
                    setAthleteDialogOpen(true)
                  }}
                  >Aggiungi Atleta</Button>
                  <Button
                    className="w-full shrink"
                    nativeButton={false}
                    render={<Link to={`/teams/${team.id}`} />}
                  >
                    Visualizza atleti
                    <ArrowRight />
                  </Button>
                </ItemActions>
              </Item>
            </>
          );
        })}
        <div className="flex justify-center my-8">
          <Button className={"px-4 py-2 rounded-2xl"} onClick={() => {
            setTeamCreateDialogOpen(true)
          }}
          >Aggiungi Team</Button>
        </div>
      </div>
    </>
  );
};

export default TeamList;
