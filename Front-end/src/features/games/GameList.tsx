import CustomEmpty from "@/components/customEmpty";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2, OctagonAlert, Trophy } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router";
import z from "zod";
import { CompetitionService } from "../competitions/competition.service";
import { TeamService } from "../teams/team.service";
import { GameService } from "./games.service";
import type { Game } from "./games.type";

const gameSchema = z.object({
  result: z
    .string()
    .min(3, "Risultato non valido")
    .max(5, "Risultato non valido"),
});

type GameData = z.infer<typeof gameSchema>;

const GameList = () => {
  const { id } = useParams(); // competition_id
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isResultDialogOpen, setResultDialogOpen] = useState(false);

  const gameForm = useForm({
    resolver: zodResolver(gameSchema),
    defaultValues: {
      result: "0-0",
    },
  });

  const queryClient = useQueryClient();

  // Query competizione
  const {
    data: competition,
    isPending: isCompetitionPending,
    isError: isCompetitionError,
    error: competitionError,
  } = useQuery({
    queryKey: ["competition", id],
    queryFn: () => CompetitionService.get(+id!),
  });

  // Query games
  const { data: games = [], isPending: isGamesPending } = useQuery({
    queryKey: ["competition-games", id],
    queryFn: () => GameService.getByCompetition(+id!),
  });

  // Query teams
  const { data: allTeams = [] } = useQuery({
    queryKey: ["teams"],
    queryFn: () => TeamService.list(),
  });

  // Mutation update result
  const updateResultMutation = useMutation({
    mutationFn: ({ gameId, result }: { gameId: number; result: string }) =>
      GameService.updateResult(gameId, result),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["competition-games", id] });
      queryClient.invalidateQueries({ queryKey: ["competition", id] });
      setResultDialogOpen(false);
      setSelectedGame(null);
      gameForm.reset();
    },
  });

  const handleOpenResultDialog = (game: Game) => {
    setSelectedGame(game);
    setResultDialogOpen(true);
  };

  const handleSubmitResult = (data: GameData) => {
    if (!selectedGame) return;
    const [homeScore, awayScore] = data.result.split("-");
    if (homeScore === awayScore) {
      alert("La partita non può finire in pareggio!");
      return;
    }
    updateResultMutation.mutate({
      result: data.result,
      gameId: selectedGame.id,
    });
  };

  const getTeam = (teamId: number | null) => {
    if (!teamId) return null;
    return allTeams.find((t) => t.id === teamId);
  };

  const getPhaseLabel = (phase: number) => {
    if (phase === 4) return "Ottavi di Finale";
    if (phase === 3) return "Quarti di Finale";
    if (phase === 2) return "Semifinali";
    if (phase === 1) return "Finale";
    return `Fase ${phase}`;
  };

  // Raggruppa games per fase
  const gamesByPhase: Record<number, Game[]> = {};
  games.forEach((game) => {
    if (!gamesByPhase[game.phase]) {
      gamesByPhase[game.phase] = [];
    }
    gamesByPhase[game.phase].push(game);
  });

  if (isCompetitionPending || isGamesPending) {
    return (
      <CustomEmpty
        title="Caricamento..."
        message="Attendi mentre vengono caricati i match"
        icon={<Loader2 className="animate-spin" />}
      />
    );
  }

  if (isCompetitionError) {
    return (
      <CustomEmpty
        title="errore imprevisto"
        message={competitionError.message}
        icon={<OctagonAlert />}
      />
    );
  }

  if (!competition) return null;

  return (
    <>
      <div className="w-full max-w-3xl mx-auto mt-4 px-4">
        {/* Header con breadcrumb */}
        <div className="mb-6">
          <Link to={`/competitions/${id}`}>
            <Button variant="ghost" className="mb-2 ml-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Torna alla scheda torneo
            </Button>
          </Link>
          <h1 className="text-4xl font-bold flex items-center gap-2 mt-4">
            <Trophy className="h-8 w-8" />
            {competition.name}
          </h1>
          <p className="text-gray-600 mt-2">
            {competition.team_number} squadre • {competition.phases} fasi
          </p>
          {competition.winner && (
            <p className="mt-2 text-yellow-600 font-semibold text-lg">
              Vincitore:{" "}
              {getTeam(competition.winner)?.name ||
                `Team #${competition.winner}`}
            </p>
          )}
        </div>
        {games.length === 0 ? (
          <CustomEmpty
            title="Nessun match"
            message="Vai alla gestione squadre"
            link={`/competitions/${id}`}
          />
        ) : (
          <div className="my-8">
            {Object.keys(gamesByPhase)
              .map(Number)
              .sort((a, b) => a - b)
              .map((phase) => (
                <div key={phase}>
                  <h2 className="text-2xl font-semibold mb-4">
                    {getPhaseLabel(phase)}
                  </h2>
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {gamesByPhase[phase].map((game) => {
                      const homeTeam = getTeam(game.home_team);
                      const awayTeam = getTeam(game.away_team);
                      const canEdit =
                        game.home_team && game.away_team && !game.winner;

                      return (
                        <div
                          key={game.id}
                          className="border rounded-lg p-4 bg-white shadow"
                        >
                          {/* Home Team */}
                          <div className="flex items-center justify-between mb-2">
                            {homeTeam ? (
                              <Link
                                to={`/teams/${homeTeam.id}`}
                                className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded flex-1"
                              >
                                <img
                                  src={homeTeam.logo}
                                  className="w-10 h-10 rounded-full"
                                />
                                <span className="font-semibold">
                                  {homeTeam.name}
                                </span>
                              </Link>
                            ) : (
                              <div className="flex items-center gap-3 p-2 flex-1">
                                <div className="w-10 h-10 rounded-full bg-gray-200" />
                                <span className="text-gray-400">
                                  In attesa...
                                </span>
                              </div>
                            )}
                            {game.winner === game.home_team && (
                              <Trophy className="h-5 w-5 text-yellow-500" />
                            )}
                          </div>

                          {/* Risultato */}
                          <div className="text-center text-2xl font-bold my-2">
                            {game.result}
                          </div>

                          {/* Away Team */}
                          <div className="flex items-center justify-between mb-2">
                            {awayTeam ? (
                              <Link
                                to={`/teams/${awayTeam.id}`}
                                className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded flex-1"
                              >
                                <img
                                  src={awayTeam.logo}
                                  className="w-10 h-10 rounded-full"
                                />
                                <span className="font-semibold">
                                  {awayTeam.name}
                                </span>
                              </Link>
                            ) : (
                              <div className="flex items-center gap-3 p-2 flex-1">
                                <div className="w-10 h-10 rounded-full bg-gray-200" />
                                <span className="text-gray-400">
                                  In attesa...
                                </span>
                              </div>
                            )}
                            {game.winner === game.away_team && (
                              <Trophy className="h-5 w-5 text-yellow-500" />
                            )}
                          </div>

                          {/* Bottone inserisci risultato */}
                          {canEdit && (
                            <Button
                              className="w-full mt-4"
                              onClick={() => handleOpenResultDialog(game)}
                            >
                              Inserisci Risultato
                            </Button>
                          )}

                          {game.winner && (
                            <div className="mt-4 text-center text-sm text-green-600 font-semibold">
                              Match completato
                            </div>
                          )}

                          {!game.home_team || !game.away_team ? (
                            <div className="mt-4 text-center text-sm text-gray-500">
                              In attesa di avversari
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Modal inserisci risultato */}
        <Dialog open={isResultDialogOpen} onOpenChange={setResultDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Inserisci Risultato</DialogTitle>
              {selectedGame && (
                <div className="mt-4">
                  <div className="text-center mb-4">
                    <p className="font-semibold">
                      {getTeam(selectedGame.home_team)?.name} vs{" "}
                      {getTeam(selectedGame.away_team)?.name}
                    </p>
                  </div>
                  <form onSubmit={gameForm.handleSubmit(handleSubmitResult)}>
                    <FieldSet className="w-full max-w-xs mx-auto">
                      <FieldGroup>
                        <Field>
                          <FieldLabel htmlFor="result">
                            Risultato (es. 3-1)
                          </FieldLabel>
                          <Input
                            id="result"
                            type="text"
                            placeholder="3-1"
                            pattern="\d{1,2}-\d{1,2}"
                            {...gameForm.register("result")}
                          />
                        </Field>
                      </FieldGroup>
                    </FieldSet>

                    <div className="flex gap-2 mt-6">
                      <Button
                        variant="outline"
                        onClick={() => setResultDialogOpen(false)}
                        className="flex-1"
                      >
                        Annulla
                      </Button>
                      <Button
                        type="submit"
                        disabled={updateResultMutation.isPending}
                        className="flex-1"
                      >
                        {updateResultMutation.isPending
                          ? "Salvataggio..."
                          : "Salva"}
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default GameList;
