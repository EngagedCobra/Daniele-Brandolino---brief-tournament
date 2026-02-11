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
import { ArrowRight, Loader2, LockKeyhole, OctagonAlert, PlayCircle, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router";
import z from 'zod';
import { GameService } from "../games/games.service";
import { TeamService } from "../teams/team.service";
import { CompetitionService } from "./competition.service";
import CustomEmpty from "@/components/customEmpty";

const editCompetitionSchema = z.object({
  name: z.string().min(1, "Il nome è obbligatorio").max(50, "Il nome è troppo lungo").trim(),
  team_number: z.coerce.number().refine(
    (number) => [4, 8, 16].includes(number)
  ),
});

type EditCompetitionData = z.infer<typeof editCompetitionSchema>;

const SingleCompetition = () => {
  const { id } = useParams();
  const [isAddTeamDialogOpen, setAddTeamDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  const editCompetitionForm = useForm({
    resolver: zodResolver(editCompetitionSchema),
    defaultValues: {
      name: "",
      team_number: 8,
    },
  });

  // Query competizione
  const {
    data: competition,
    isPending: isCompetitionPending,
    isError: isCompetitionError,
    error: competitionError,
    refetch: refetchCompetition,
  } = useQuery({
    queryKey: ["competition", id],
    queryFn: async () => {
      const res = await CompetitionService.get(+id!);
      return res;
    },
  });

  // Query partite
  const {
    data: games,
    isPending: isGamesPending,
    isError: isGamesError,
    error: gamesError,
    refetch: refetchGames,
  } = useQuery({
    queryKey: ["games", id],
    queryFn: async () => {
      const res = await GameService.getByCompetition(+id!)
      return res;
    },
  });

  // Query teams della competizione
  const {
    data: competitionTeams = [],
    isPending: isTeamsPending,
    isError: isTeamsError,
    error: teamsError,
    refetch: refetchTeams
  } = useQuery({
    queryKey: ["competition-teams", id],
    queryFn: async () => {
      const res = await CompetitionService.getTeams(+id!);
      return res;
    },
  });

  // Query tutti i teams disponibili
  const { data: allTeams = [] } = useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      const res = await TeamService.list();
      return res;
    },
  });

  // Mutation per rimuovere team
  const removeTeamMutation = useMutation({
    mutationFn: ({ competitionId, teamId }: { competitionId: number; teamId: number }) =>
      CompetitionService.removeTeam(competitionId, teamId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["competition-teams", id],
      });
    },
  });

  // Mutation per aggiungere team
  const addTeamMutation = useMutation({
    mutationFn: ({ competitionId, teamId }: { competitionId: number; teamId: number }) =>
      CompetitionService.addTeam(competitionId, teamId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["competition-teams", id],
      });
      setAddTeamDialogOpen(false);
    },
    onError: (error: Error) => {
      alert(error.message);
    },
  });

  // Mutation per avviare torneo
  const startTournamentMutation = useMutation({
    mutationFn: (competitionId: number) =>
      CompetitionService.start(competitionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["games", id],
      });
      alert("Torneo avviato con successo!");
      // Redirect ai games
      window.location.href = `/competitions/${id}/games`;
    },
    onError: (error: Error) => {
      alert(error.message);
    },
  });

  // Mutation per modificare competizione
  const updateCompetitionMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: EditCompetitionData }) =>
      CompetitionService.update({ id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["competition", id] });
      setEditDialogOpen(false);
    },
  });

  const handleEditCompetition = (data: EditCompetitionData) => {
    updateCompetitionMutation.mutate({ id: +id!, data });
  };

  const handleRemoveTeam = (teamId: number) => {
    removeTeamMutation.mutate({ competitionId: +id!, teamId });
  };

  const handleAddTeam = (teamId: number) => {
    addTeamMutation.mutate({ competitionId: +id!, teamId });
  };

  const handleStartTournament = () => {
    if (confirm("Sei sicuro di voler avviare il torneo? Non potrai più modificare le squadre.")) {
      startTournamentMutation.mutate(+id!);
    }
  };

  // Calcolo stato competizione
  const isTeamsFull = competition?.team_number === competitionTeams.length;
  const hasStarted = games && games.length > 0;
  const canStart = isTeamsFull && !hasStarted;
  const canEdit = !hasStarted;


  // Teams disponibili da aggiungere (non già nella competizione)
  const availableTeams = allTeams.filter(
    (team) => !competitionTeams.find((ct) => ct.id === team.id)
  );

  // Popola form edit quando si apre dialog
  useEffect(() => {
    if (competition && isEditDialogOpen) {
      editCompetitionForm.setValue("name", competition.name);
      editCompetitionForm.setValue("team_number", competition.team_number);
    }
  }, [competition, isEditDialogOpen]);

  if ((isCompetitionPending || isTeamsPending || isGamesPending)) {
    return (
      <CustomEmpty title="Caricamento..." message="Attendi mentre vengono caricata la competizione" icon={<Loader2 className="animate.spin" />} />
    );
  }

  if (isCompetitionError || isTeamsError || isGamesError) {
    return (
      <CustomEmpty title="Errore imprevisto" message={!isCompetitionError ? (isTeamsError ? teamsError.message : gamesError!.message) : competitionError.message} link={!isCompetitionError ? (isTeamsError ? () => refetchTeams() : () => refetchGames) : () => refetchCompetition()} icon={<OctagonAlert />} />
    );
  }
  return (
    <>
      <div className="w-full max-w-3xl mx-auto mt-4">
        {/* Header competizione */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">{competition.name}</h1>
            <p className="text-gray-600 mt-2">
              {competition.team_number} squadre • {competition.phases} fasi
            </p>
            <p className="mt-2">
              <span className="font-semibold">Squadre inserite: </span>
              {competitionTeams.length}/{competition.team_number}
            </p>
          </div>

          <div className="flex gap-2">
            {canEdit && (
              <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogTrigger asChild className="px-4 py-2 rounded-2xl">
                  <Button variant="outline">
                    Modifica Torneo
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Modifica Competizione</DialogTitle>
                    <form onSubmit={editCompetitionForm.handleSubmit(handleEditCompetition)}>
                      <FieldSet className="w-full max-w-xs">
                        <FieldGroup>
                          <Field>
                            <FieldLabel htmlFor="edit-name" className="mt-4">
                              Nome
                            </FieldLabel>
                            <Input
                              id="edit-name"
                              type="text"
                              {...editCompetitionForm.register("name")}
                            />
                          </Field>
                        </FieldGroup>
                      </FieldSet>
                      <FieldSet className="w-full max-w-xs">
                        <FieldGroup>
                          <Field>
                            <FieldLabel htmlFor="edit-team-number" className="mt-4">
                              Numero squadre
                            </FieldLabel>
                            <select
                              id="edit-team-number"
                              className="w-full border rounded px-3 py-2"
                              {...editCompetitionForm.register("team_number")}
                            >
                              <option value={4}>4 squadre</option>
                              <option value={8}>8 squadre</option>
                              <option value={16}>16 squadre</option>
                            </select>
                          </Field>
                        </FieldGroup>
                      </FieldSet>
                      <Button type="submit" className="mt-4">
                        Salva modifiche
                      </Button>
                    </form>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            )}
            {canStart && (
              <Button
                onClick={handleStartTournament}
                disabled={startTournamentMutation.isPending}
                className="bg-green-500 hover:bg-green-600"
              >
                <PlayCircle className="mr-2" />
                {startTournamentMutation.isPending ? "Avvio..." : "Avvia Torneo"}
              </Button>
            )}
            {hasStarted && (
              <Link to={`/competitions/${id}/games`}>
                <Button className="bg-blue-500 hover:bg-blue-600">
                  Vai ai Match
                  <ArrowRight className="ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Squadre Partecipanti</h2>
          {competitionTeams.length === 0 ? (
            <CustomEmpty title="Nessuna squadra" message="Non ci sono squadre in questa competizione" />
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {competitionTeams.map((team) => (
                <Item key={team.id}>
                  <ItemMedia variant="image">
                    <img src={team.logo} />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{team.name}</ItemTitle>
                  </ItemContent>
                  <ItemActions>
                    <Button
                      onClick={() => handleRemoveTeam(team.id)}
                      disabled={
                        removeTeamMutation.isPending ||
                        hasStarted
                      }
                      variant="destructive"
                    >
                      {!hasStarted ? <Trash /> : <LockKeyhole />}
                    </Button>
                  </ItemActions>
                </Item>
              ))}
            </div>
          )}
          {canEdit && (
            <div className="flex justify-center mt-8">
              <Dialog
                open={isAddTeamDialogOpen}
                onOpenChange={setAddTeamDialogOpen}
              >
                <DialogTrigger
                  className="bg-blue-300 px-4 py-2 rounded-2xl text-white disabled:bg-red-50 disabled:cursor-not-allowed"
                  disabled={
                    isTeamsFull ||
                    availableTeams.length === 0
                  }
                >
                  <Plus className="inline mr-2 h-4 w-4" />
                  {!canStart ? "Aggiungi squadra" : "Torneo al completo"}
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Seleziona una squadra</DialogTitle>
                    <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
                      {availableTeams.length === 0 ? (
                        <p className="text-gray-500">
                          Nessuna squadra disponibile
                        </p>
                      ) : (
                        availableTeams.map((team) => (
                          <div
                            key={team.id}
                            className="flex items-center justify-between border p-3 rounded"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={team.logo}
                                className="w-10 h-10 rounded-full"
                              />
                              <span>{team.name}</span>
                            </div>
                            <Button
                              onClick={() => handleAddTeam(team.id)}
                              disabled={addTeamMutation.isPending}
                              size="sm"
                            >
                              Aggiungi
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SingleCompetition;