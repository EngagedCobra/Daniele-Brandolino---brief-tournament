import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Loader2, OctagonAlert, PencilIcon, PlusIcon, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { AthleteService } from "../athletes/athlete.service";
import { createAthleteSchema, updateAthleteSchema, type Athlete, type CreateAthleteData, type UpdateAthleteData } from "../athletes/athlete.type";
import { TeamService } from "./team.service";
import CustomEmpty from "@/components/customEmpty";



const SingleTeam = () => {
  const { id } = useParams();

  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | undefined>(
    undefined,
  );
  const [isAthleteDialogOpen, setAthleteDialogOpen] = useState(false);
  const [isCreateAthleteDialogOpen, setCreateAthleteDialogOpen] =
    useState(false);
  const updateAthleteForm = useForm({
    resolver: zodResolver(updateAthleteSchema),
  });
  const createAthleteForm = useForm(
    { resolver: zodResolver(createAthleteSchema) }
  )

  const queryClient = useQueryClient();

  const updateAthleteMutation = useMutation({
    mutationFn: AthleteService.update,
    onSuccess: () => {
      (queryClient.invalidateQueries({
        queryKey: ["athletes"],
      }),
        setAthleteDialogOpen(false));
      setSelectedAthlete(undefined)
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

  const handleAthleteCreate = (data: CreateAthleteData) => {
    data = {
      ...data,
      team_id: +id!
    }
    createAthleteMutation.mutate(data);
  };

  const handleAthleteUpdate = (data: UpdateAthleteData) => {
    if (!selectedAthlete) return;
    updateAthleteMutation.mutate({ id: selectedAthlete.id, data });
  };

  const handleAthleteDelete = (id: number) => {
    deleteAthleteMutation.mutate(id);
  };

  useEffect(() => {
    if (selectedAthlete) {
      updateAthleteForm.setValue("name", selectedAthlete.name);
      updateAthleteForm.setValue("surname", selectedAthlete.surname);
      updateAthleteForm.setValue("age", selectedAthlete.age);
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

  const { data: athletes = [], isPending: isAthletesPending, isError: isAthleteError, error: athleteError, refetch: refetchAthletes } = useQuery({
    queryKey: ["athletes", id],
    queryFn: async () => {
      const res = await AthleteService.getByTeam(+id!);
      return res;
    },
  });

  if (isTeamPending || isAthletesPending) {
    return (
      <CustomEmpty title="Caricamento..." message="Attendi mentre vengono caricati i dati" icon={<Loader2 className="animate-spin" />} />
    );
  }

  if (isTeamError || isAthleteError) {
    return (
      <CustomEmpty title="Errore imprevisto" message={teamError ? teamError.message : athleteError?.message} icon={<OctagonAlert/>} link={teamError ? refetchTeam() : refetchAthletes()} />
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto mt-4">
      <div className="flex items-center mb-8">
        <img src={team.logo} className="h-12.5 me-4" />
        <p className="text-4xl">{team.name}</p>
      </div>

      <div className="mt-8 w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Atleti</h2>
        {athletes.length === 0 ? (
          <CustomEmpty title="Nessun match" message="Non ci sono atleti in questa squadra"/>
        ) : (
          <>
            <div className="space-y-2 grid grid-cols-2 gap-10">
              {athletes.sort((a, b) => a.id - b.id).map((athlete) => (
                <Item key={athlete.id}>
                  <ItemContent className="flex justify-between">
                    <ItemTitle>
                      {athlete.name} {athlete.surname}
                    </ItemTitle>
                    <ItemDescription>Età: {athlete.age} anni</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Button variant={"destructive"} className={"hover:cursor-pointer"} onClick={() => handleAthleteDelete(athlete.id)}>
                      <Trash />
                    </Button>
                    <Button variant={"secondary"} className="px-4 py-2 rounded-2xl hover:cursor-pointer" onClick={() => {
                      setSelectedAthlete(athlete)
                      setAthleteDialogOpen(true)
                    }}>
                      <PencilIcon />
                    </Button>
                  </ItemActions>
                </Item>
              ))}
            </div>
          </>)}
        <div className="flex justify-center mt-8">
        </div>
      </div>
      <div className="flex justify-center">
        <Button className={"rounded-2xl px-4 py-2"} disabled={athletes.length === 5 ? true : false} onClick={() => setCreateAthleteDialogOpen(true)}>
          <PlusIcon />
          {athletes.length === 5 ? "Squadra al completo" : "Aggiungi atleta"}
        </Button>
      </div>
      {/* Create athlete dialog */}
      <Dialog
        open={isCreateAthleteDialogOpen}
        onOpenChange={setCreateAthleteDialogOpen}
      >
        <DialogTrigger>
        </DialogTrigger>
        <DialogDescription />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aggiungi atleta</DialogTitle>
            <form
              onSubmit={createAthleteForm.handleSubmit(handleAthleteCreate)}
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
                      {...createAthleteForm.register("surname")}
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
                      {...createAthleteForm.register("age")}
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>
              <FieldSet className="w-full max-w-xs hidden">
                <FieldGroup>
                  <Field>
                    <Input
                      value={selectedAthlete?.id}
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
      {/* Edit athlete dialog */}
      <Dialog
        open={isAthleteDialogOpen}
        onOpenChange={(open) => {
          setAthleteDialogOpen(open)
          if (!open) setSelectedAthlete(undefined)
        }}
      >
        <DialogTrigger>
        </DialogTrigger>
        <DialogDescription />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifica atleta</DialogTitle>
            <form
              onSubmit={updateAthleteForm.handleSubmit(
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
                      {...updateAthleteForm.register("name")}
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
                      {...updateAthleteForm.register("surname")}
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
                      {...updateAthleteForm.register("age", {
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
    </div>
  );
};

export default SingleTeam;
