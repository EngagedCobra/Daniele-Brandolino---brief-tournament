<?php

/* Routes per gestione games */

use App\Database\DB;
use App\Models\Competition;
use App\Models\Game;
use App\Utils\Response;
use App\Utils\Request;
use Pecee\SimpleRouter\SimpleRouter as Router;

/**
 * GET /api/games - Lista partite
 */
Router::get('/games', function () {
    try {
        $request = new Request();
        $competition_id = $request->getParam('competition_id');
        $phase = $request->getParam('phase');

        $games = Game::all();

        // Filtra per competition_id se presente
        if ($competition_id !== null) {
            $games = array_filter($games, fn($game) => $game->competition_id == $competition_id);
        }

        // Filtra per phase se presente
        if ($phase !== null) {
            $games = array_filter($games, fn($game) => $game->phase == $phase);
        }

        Response::success(array_values($games))->send();
    } catch (\Exception $e) {
        Response::error('Errore nel recupero della lista partite: ' . $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR)->send();
    }
});

/**
 * GET /api/games/{id} - Dettaglio partita
 */
Router::get('/games/{id}', function ($id) {
    try {
        $game = Game::find($id);

        if ($game === null) {
            Response::error('Partita non trovata', Response::HTTP_NOT_FOUND)->send();
            return;
        }

        Response::success($game)->send();
    } catch (\Exception $e) {
        Response::error('Errore nel recupero della partita: ' . $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR)->send();
    }
});

/**
 * POST /api/games - Crea nuova partita
 */
Router::post('/games', function () {
    try {
        $request = new Request();
        $data = $request->json();

        if (!isset($data['result']) || $data['result'] === null || $data['result'] === '') {
            $data['result'] = '0-0';
        }

        $errors = Game::validate($data);
        if (!empty($errors)) {
            Response::error('Errore di validazione', Response::HTTP_BAD_REQUEST, $errors)->send();
            return;
        }

        $game = Game::create($data);

        Response::success($game, Response::HTTP_CREATED, "Partita creata con successo")->send();
    } catch (\Exception $e) {
        Response::error('Errore durante la creazione della nuova partita: ' . $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR)->send();
    }
});

/**
 * PUT|PATCH /api/games/{id} - Aggiorna partita
 */
Router::match(['put', 'patch'], '/games/{id}', function ($id) {
    try {
        $request = new Request();
        $data = $request->json();

        if (!array_key_exists('result', $data)) {
            Response::error(
                'È possibile aggiornare solo il campo result',
                Response::HTTP_BAD_REQUEST
            )->send();
            return;
        }

        $game = Game::find($id);
        if ($game === null) {
            Response::error('Partita non trovata', Response::HTTP_NOT_FOUND)->send();
            return;
        }

        $errors = Game::validate(array_merge($game->toArray(), $data));
        if (!empty($errors)) {
            Response::error('Errore di validazione', Response::HTTP_BAD_REQUEST, $errors)->send();
            return;
        }

        if ($game->result !== "0-0") {
            Response::error('Partità già completata', Response::HTTP_METHOD_NOT_ALLOWED, $errors)->send();
            return;
        }
        [$homeScore, $awayScore] = array_map('intval', explode('-', $data['result']));

        // Decreto il vincitore
        $winner = match (true) {
            $homeScore > $awayScore => $game->home_team,
            $awayScore > $homeScore => $game->away_team
        };

        $successMessages = [];

        $updatedGame = DB::update("UPDATE games SET result = :result, winner = :winner WHERE id = :id", ['result' => $data['result'], 'winner' => $winner, 'id' => $id]);
        $successMessages[] = "Risultato aggiornato con successo, il vincitore è $winner";

        // Controllo se la partita aggiornata è l'ultima del torneo
        // Se lo è aggiorno la competizione di riferimento
        if ($game->phase == 1) {
            $competition = Competition::find($game->competition_id);
            if ($competition === null) {
                Response::error("Competizione non trovata", Response::HTTP_NOT_FOUND)->send();
            }
            else {
                DB::update("UPDATE competitions SET winner = :winner WHERE id = :id", ['winner' => $winner, 'id' => $game->competition_id]);
                $successMessages[] = "Torneo concluso; il vincitore è $winner";
            }
        }
        // Se non lo è creo/aggiorno la partita successiva
        else if ($game->phase != 1){
            $newPosition = ceil($game->position / 2);

            // Creazione/aggiornamento della partita successiva
            $nextGame = Game::where("phase", "=", $game->phase - 1);
            if (count($nextGame) === 0) {
                Game::create([
                    "competition_id" => $game->competition_id,
                    'home_team' => $winner,
                    'away_team' => null,
                    'phase' => $game->phase - 1,
                    'result' => '0-0',
                    'winner' => null,
                    "position" => $newPosition
                ]);
                $successMessages[] = "Nuova partita creata; home_team: $winner";
            } else {
                // Controllo la presenza delle squadre della partita nella prossima fase nella posizione di riferimento
                foreach ($nextGame as $g) {
                    if (($g->away_team == null || !isset($g->away_team)) && $g->position == $newPosition) {
                        DB::update("UPDATE games SET away_team = :team WHERE id = :id", ['team' => $winner, 'id' => $g->id]);
                        $successMessages[] = "Prossima partita aggiornata; $winner VS " .  $g->home_team;
                        break;
                    }
                }
            }
        }

        Response::success(['data' => $updatedGame, 'messages' => $successMessages], Response::HTTP_OK, "Tutto andato a buon fine")->send();
    } catch (\Exception $e) {
        Response::error('Errore durante l\'aggiornamento del risultato: ' . $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR)->send();
    }
});

/**
 * DELETE /api/games/{id} - Elimina partita
 */
Router::delete('/games/{id}', function ($id) {
    try {
        $game = Game::find($id);
        if ($game === null) {
            Response::error('Partita non trovata', Response::HTTP_NOT_FOUND)->send();
            return;
        }

        $game->delete();

        Response::success(null, Response::HTTP_OK, "Partita eliminata con successo")->send();
    } catch (\Exception $e) {
        Response::error('Errore durante l\'eliminazione della partita: ' . $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR)->send();
    }
});
