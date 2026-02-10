import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, OctagonAlert, PencilIcon, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import z from "zod";
import { AthleteService } from "../athletes/athlete.service";
import type { Athlete } from "../athletes/athlete.type";
import { TeamService } from "./team.service";

const athleteSchema = z.object({
  name: z.string().min(1),
  surname: z.string().min(1),
  age: z.coerce.number().int().min(18).max(60),
  team_id: z.coerce.number().int().min(1),
});
type AthleteData = z.infer<typeof athleteSchema>;

const SingleTeam = () => {
  const { id } = useParams();

  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | undefined>(
    undefined,
  );
  const [isAthleteDialogOpen, setAthleteDialogOpen] = useState(false);
  const [isCreateAthleteDialogOpen, setCreateAthleteDialogOpen] =
    useState(false);
  const athleteForm = useForm({
    resolver: zodResolver(athleteSchema),
  });

  const queryClient = useQueryClient();

  const updateAthleteMutation = useMutation({
    mutationFn: AthleteService.update,
    onSuccess: () => {
      (queryClient.invalidateQueries({
        queryKey: ["athletes"],
      }),
        setAthleteDialogOpen(false));
    },
  });

  const createAthleteMutation = useMutation({
    mutationFn: AthleteService.create,
    onSuccess: () => {
      (queryClient.invalidateQueries({
        queryKey: ["athletes"],
      }),
        setCreateAthleteDialogOpen(false));
    },
  });

  const deleteAthleteMutation = useMutation({
    mutationFn: AthleteService.delete,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["athletes"],
      }),
  });

  const handleAthleteCreate = (data: AthleteData) => {
    createAthleteMutation.mutate(data);
  };

  const handleAthleteUpdate = (data: AthleteData) => {
    if (!selectedAthlete) return;
    updateAthleteMutation.mutate({ id: selectedAthlete.id, data });
  };

  const handleAthleteDelete = (id: number) => {
    deleteAthleteMutation.mutate(id);
  };

  useEffect(() => {
    if (selectedAthlete) {
      athleteForm.setValue("name", selectedAthlete.name);
      athleteForm.setValue("surname", selectedAthlete.surname);
      athleteForm.setValue("age", selectedAthlete.age);
      athleteForm.setValue("team_id", selectedAthlete.team_id);
    }
  }, [selectedAthlete]);

  const {
    data: team,
    isPending: isTeamPending,
    isError: isTeamError,
    error: teamError,
    refetch: refetchTeam,
  } = useQuery({
    queryKey: ["team", id],
    queryFn: async () => {
      const res = await TeamService.get(+id!);
      return res;
    },
  });

  const { data: athletes = [], isPending: isAthletesPending } = useQuery({
    queryKey: ["athletes", id],
    queryFn: async () => {
      const res = await AthleteService.getByTeam(+id!);
      return res;
    },
  });

  if (isTeamPending || isAthletesPending) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Loader2 className="animate-spin" />
          </EmptyMedia>
          <EmptyTitle>Caricamento...</EmptyTitle>
          <EmptyDescription>
            Attendi mentre vengono caricati i dati
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  if (isTeamError) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <OctagonAlert />
          </EmptyMedia>
          <EmptyTitle>Errore imprevisto</EmptyTitle>
          <EmptyDescription>{teamError.message}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button onClick={() => refetchTeam()}>Riprova</Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <>
      <div className="w-full max-w-[1240px] mx-auto mt-4">
        <div className="flex justify-center items-center mb-8">
          <img src={team.logo} className="w-sm h-[50px] me-4" />
          <p className="text-4xl">{team.name}</p>
        </div>

        <div className="mt-8 w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Atleti</h2>
          {athletes.length === 0 ? (
            <Empty className="border">
              <EmptyHeader>
                <EmptyTitle>Nessun atleta</EmptyTitle>
                <EmptyDescription>
                  Non ci sono atleti in questa squadra
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="space-y-2 grid grid-cols-2 gap-10">
              {athletes.map((athlete) => (
                <Item key={athlete.id}>
                  <ItemContent className="flex justify-between">
                    <ItemTitle>
                      {athlete.name} {athlete.surname}
                    </ItemTitle>
                    <ItemDescription>Età: {athlete.age} anni</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Button onClick={() => handleAthleteDelete(athlete.id)}>
                      <Trash></Trash>
                    </Button>
                    <Dialog
                      open={isAthleteDialogOpen}
                      onOpenChange={setAthleteDialogOpen}
                    >
                      <DialogTrigger
                        onClick={() => setSelectedAthlete(athlete)}
                        className="bg-blue-300 px-4 py-2 rounded-2xl text-white"
                      >
                        <PencilIcon></PencilIcon>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Modifica atleta</DialogTitle>
                          <form
                            onSubmit={athleteForm.handleSubmit(
                              handleAthleteUpdate,
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
                                    disabled={!selectedAthlete}
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
                                    disabled={!selectedAthlete}
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
                                    type="text"
                                    disabled={!selectedAthlete}
                                    {...athleteForm.register("age", {
                                      valueAsNumber: true,
                                    })}
                                  />
                                </Field>
                              </FieldGroup>
                            </FieldSet>
                            <FieldSet className="w-full max-w-xs hidden">
                              <FieldGroup>
                                <Field>
                                  <Input
                                    id="athlete-team_id"
                                    type="number"
                                    value={selectedAthlete?.team_id}
                                    disabled={!selectedAthlete}
                                    {...athleteForm.register("team_id", {
                                      valueAsNumber: true,
                                    })}
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
                  </ItemActions>
                </Item>
              ))}
            </div>
          )}
          <div className="flex justify-center mt-8">
            <Dialog
              open={isCreateAthleteDialogOpen}
              onOpenChange={setCreateAthleteDialogOpen}
            >
              <DialogTrigger
                className="bg-blue-300 px-4 py-2 rounded-2xl text-white"
                disabled={athletes.length === 5 ? true : false}
              >
                Aggiungi atleta
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Aggiungi atleta</DialogTitle>
                  <form
                    onSubmit={athleteForm.handleSubmit(handleAthleteCreate)}
                  >
                    <FieldSet className="w-full max-w-xs">
                      <FieldGroup>
                        <Field>
                          <FieldLabel htmlFor="athlete-name" className="mt-4">
                            Nome
                          </FieldLabel>
                          <Input
                            id="athlete-name"
                            type="text"
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
                            {...athleteForm.register("surname")}
                          />
                        </Field>
                      </FieldGroup>
                    </FieldSet>
                    <FieldSet className="w-full max-w-xs">
                      <FieldGroup>
                        <Field>
                          <FieldLabel htmlFor="athlete-age" className="mt-4">
                            Età
                          </FieldLabel>
                          <Input
                            id="athlete-age"
                            type="number"
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
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleTeam;
