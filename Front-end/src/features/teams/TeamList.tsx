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
import { TeamService } from "./team.service";
import type { Team } from "./team.type";

const nameSchema = z.object({
  name: z.string().min(1),
});

const athleteSchema = z.object({
  name: z.string().min(1),
  surname: z.string().min(1),
  age: z.coerce.number().int().min(18).max(60),
  team_id: z.coerce.number().int().min(1),
});

const createTeamSchema = z.object({
  name: z.string().min(1)
})

type NameData = z.infer<typeof nameSchema>;
type AthleteData = z.infer<typeof athleteSchema>;
type TeamData = z.infer<typeof createTeamSchema>;

const TeamList = () => {
  const [selectedTeam, setSelectedTeam] = useState<Team | undefined>(undefined);
  const [isTeamDialogOpen, setTeamDialogOpen] = useState(false);
  const [isAthleteDialogOpen, setAthleteDialogOpen] = useState(false);
  const [isTeamCreateDialogOpen, setTeamCreateDialogOpen] = useState(false);

  const teamForm = useForm({
    resolver: zodResolver(nameSchema),
  });
  const teamCreateForm = useForm({
    resolver: zodResolver(createTeamSchema)
  })
  const athleteForm = useForm({
    resolver: zodResolver(athleteSchema),
/*     defaultValues: {team_id: selectedTeam?.id} */
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
    onSuccess: () =>{
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

  const handleTeamUpdate = (data: NameData) => {
    if (!selectedTeam) return;
    updateTeamMutation.mutate({ id: selectedTeam.id, data });
  };

  const handleAthleteCreate = (data: AthleteData) => {
    if (!selectedTeam) return;
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
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Loader2 className="animate-spin" />
          </EmptyMedia>
          <EmptyTitle>Caricamento...</EmptyTitle>
          <EmptyDescription>
            Attendi mentre vengono caricate le squadre
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  if (isError) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <OctagonAlert />
          </EmptyMedia>
          <EmptyTitle>Errore imprevisto</EmptyTitle>
          <EmptyDescription>{error.message}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button onClick={() => refetch()}>Riprova</Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <>
      <div className="max-w-[1240px] mx-auto mt-6">
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
                  <Dialog
                    open={isTeamDialogOpen}
                    onOpenChange={setTeamDialogOpen}
                  >
                    <DialogTrigger
                      onClick={() => setSelectedTeam(team)}
                      className="bg-blue-300 px-4 py-2 rounded-2xl text-white"
                    >
                      Modifica Team
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
                  {/* <AthleteEdit id={team.id} updating creating={undefined}></AthleteEdit> */}
                  <Dialog
                    open={isAthleteDialogOpen}
                    onOpenChange={setAthleteDialogOpen}
                  >
                    <DialogTrigger
                      onClick={() => setSelectedTeam(team)}
                      className="bg-blue-300 px-4 py-2 rounded-2xl text-white"
                    >
                      Aggiungi atleta
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Aggiungi atleta</DialogTitle>
                        <form
                          onSubmit={athleteForm.handleSubmit(
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
                                  {...athleteForm.register("name")}
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
                                  {...athleteForm.register("surname")}
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
                                  {...athleteForm.register("age")}
                                />
                              </Field>
                            </FieldGroup>
                          </FieldSet>
                          <FieldSet className="w-full max-w-xs hidden">
                            <FieldGroup>
                              <Field>
                                <Input
                                  id="athlete-team-id"
                                  type="number"
                                  value={team.id}
                                  disabled={!selectedTeam}
                                  {...athleteForm.register("team_id")}
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
                  <Button
                    variant={"secondary"}
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
        <div className="flex justify-center mt-8">
          <Dialog
            open={isTeamCreateDialogOpen}
            onOpenChange={setTeamCreateDialogOpen}
          >
            <DialogTrigger className="bg-blue-300 px-4 py-2 rounded-2xl text-white">
              Aggiungi nuovo Team
            </DialogTrigger>
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
        </div>
      </div>
    </>
  );
};

export default TeamList;
