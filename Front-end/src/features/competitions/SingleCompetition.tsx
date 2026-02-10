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
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import MainLayout from "@/layouts/MainLayout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, OctagonAlert, PlayCircle, Plus, Trash } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router";
import { TeamService } from "../teams/team.service";
import { CompetitionService } from "./competition.service";

const SingleCompetition = () => {
  const { id } = useParams();
  const [isAddTeamDialogOpen, setAddTeamDialogOpen] = useState(false);
  const [competitionIsReady, setCompetitionReady] = useState(false);

  const queryClient = useQueryClient();

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

  // Query teams della competizione
  const { data: competitionTeams = [], isPending: isTeamsPending } = useQuery({
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
    mutationFn: ({
      competitionId,
      teamId,
    }: {
      competitionId: number;
      teamId: number;
    }) => CompetitionService.removeTeam(competitionId, teamId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["competition-teams", id],
      });
      queryClient.invalidateQueries({
        queryKey: ["competition-status", id],
      });
    },
  });

  // Mutation per aggiungere team
  const addTeamMutation = useMutation({
    mutationFn: ({
      competitionId,
      teamId,
    }: {
      competitionId: number;
      teamId: number;
    }) => CompetitionService.addTeam(competitionId, teamId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["competition-teams", id],
      });
      queryClient.invalidateQueries({
        queryKey: ["competition-status", id],
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
        queryKey: ["competition-status", id],
      });
      alert("Torneo avviato con successo!");
    },
    onError: (error: Error) => {
      alert(error.message);
    },
  });

  const handleRemoveTeam = (teamId: number) => {
    if (confirm("Sei sicuro di voler rimuovere questa squadra?")) {
      removeTeamMutation.mutate({ competitionId: +id!, teamId });
    }
  };

  const handleAddTeam = (teamId: number) => {
    addTeamMutation.mutate({ competitionId: +id!, teamId });
    if (competitionTeams.length === competition?.team_number) setCompetitionReady(true);
  };

  const handleStartTournament = () => {
    if (
      confirm(
        "Sei sicuro di voler avviare il torneo? Non potrai più modificare le squadre.",
      )
    ) {
      startTournamentMutation.mutate(+id!);
    }
  };

  // Teams disponibili da aggiungere (non già nella competizione)
  const availableTeams = allTeams.filter(
    (team) => !competitionTeams.find((ct) => ct.id === team.id),
  );

  if (isCompetitionPending || isTeamsPending) {
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

  if (isCompetitionError) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <OctagonAlert />
          </EmptyMedia>
          <EmptyTitle>Errore imprevisto</EmptyTitle>
          <EmptyDescription>{competitionError.message}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button onClick={() => refetchCompetition()}>Riprova</Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <>
      <div className="w-full max-w-[1240px] mx-auto mt-4">
        {/* Header competizione */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">{competition.name}</h1>
            <p className="text-gray-600 mt-2">
              {competition.team_number} squadre • {competition.phases} fasi
            </p>
            {competitionIsReady && (
              <p className="mt-2">
                <span className="font-semibold">Squadre inserite:</span>{" "}
                {competitionTeams.length}/
                {competition.team_number}
              </p>
            )}
          </div>

          {/* Bottone avvia torneo */}
          {competitionIsReady && (
            <Button
              onClick={handleStartTournament}
              disabled={startTournamentMutation.isPending}
              className="bg-green-500 hover:bg-green-600"
            >
              <PlayCircle className="mr-2" />
              {startTournamentMutation.isPending ? "Avvio..." : "Avvia Torneo"}
            </Button>
          )}

          {competitionIsReady && (
            <div className="text-green-600 font-semibold">✓ Torneo avviato</div>
          )}
        </div>

        {/* Lista squadre partecipanti */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Squadre Partecipanti</h2>

          {competitionTeams.length === 0 ? (
            <Empty className="border">
              <EmptyHeader>
                <EmptyTitle>Nessuna squadra</EmptyTitle>
                <EmptyDescription>
                  Non ci sono squadre in questa competizione
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {competitionTeams.map((team) => (
                <Item key={team.id}>
                  <ItemMedia variant="image">
                    <img src={team.logo} alt={team.name} />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{team.name}</ItemTitle>
                  </ItemContent>
                  <ItemActions>
                    <Button
                      onClick={() => handleRemoveTeam(team.id)}
                      disabled={
                        removeTeamMutation.isPending ||
                        competitionIsReady
                      }
                      variant="destructive"
                    >
                      <Trash />
                    </Button>
                  </ItemActions>
                </Item>
              ))}
            </div>
          )}

          {/* Bottone aggiungi squadra */}
          {!competitionIsReady && (
            <div className="flex justify-center mt-8">
              <Dialog
                open={isAddTeamDialogOpen}
                onOpenChange={setAddTeamDialogOpen}
              >
                <DialogTrigger
                  className="bg-blue-300 px-4 py-2 rounded-2xl text-white"
                  disabled={
                    competitionIsReady ||
                    availableTeams.length === 0
                  }
                >
                  <Plus className="inline mr-2 h-4 w-4" />
                  Aggiungi squadra
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
                                alt={team.name}
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
