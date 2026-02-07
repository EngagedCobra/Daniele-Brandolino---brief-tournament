<?php

/* Routes per gestione competitions */

use App\Models\Competition;
use App\Models\CompetitionTeam;
use App\Models\Game;
use App\Utils\Response;
use App\Utils\Request;
use Pecee\SimpleRouter\SimpleRouter as Router;

/**
 * GET /api/competitions - Lista competizioni
 */
Router::get('/competitions', function () {
    try {
        $competitions = Competition::all();
        Response::success($competitions)->send();
    } catch (\Exception $e) {
        Response::error('Errore nel recupero della lista competizioni: ' . $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR)->send();
    }
});

/**
 * GET /api/competitions/{id} - Dettaglio competizione
 */
Router::get('/competitions/{id}', function ($id) {
    try {
        $competition = Competition::find($id);

        if ($competition === null) {
            Response::error('Competizione non trovata', Response::HTTP_NOT_FOUND)->send();
            return;
        }

        Response::success($competition)->send();
    } catch (\Exception $e) {
        Response::error('Errore nel recupero della competizione: ' . $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR)->send();
    }
});

/**
 * POST /api/competitions - Crea competizione
 */
Router::post('/competitions', function () {
    try {
        $request = new Request();
        $data = $request->json();

        if (!isset($data['name']) || !isset($data['team_number'])) {
            Response::error('name e team_number sono obbligatori', Response::HTTP_BAD_REQUEST)->send();
            return;
        }

        // Calcola automaticamente le phases in base al team_number
        $phases = log($data['team_number'], 2); // logaritmo base 2

        $competition = Competition::create([
            'name' => $data['name'],
            'team_number' => $data['team_number'],
            'phases' => $phases
        ]);

        Response::success($competition, Response::HTTP_CREATED, "Competizione creata con successo")->send();
    } catch (\Exception $e) {
        Response::error('Errore: ' . $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR)->send();
    }
});

/**
 * POST /api/competitions/{id}/start - Inizia il torneo e genera i match
 */
Router::post('/competitions/{id}/start', function ($id) {
    try {
        $competition = Competition::find($id);
        
        if ($competition === null) {
            Response::error('Competizione non trovata', Response::HTTP_NOT_FOUND)->send();
            return;
        }

        // Verifica che ci siano abbastanza team inseriti
        $competitionTeams = CompetitionTeam::all();
        $teamsInCompetition = array_filter($competitionTeams, fn($ct) => $ct->competition_id == $id);
        $teamCount = count($teamsInCompetition);

        if ($teamCount !== $competition->team_number) {
            Response::error(
                "Numero team non corretto. Richiesti: {$competition->team_number}, inseriti: {$teamCount}",
                Response::HTTP_BAD_REQUEST
            )->send();
            return;
        }

        // Verifica che i match non siano già stati generati
        $existingGames = Game::all();
        $gamesInCompetition = array_filter($existingGames, fn($g) => $g->competition_id == $id);
        
        if (count($gamesInCompetition) > 0) {
            Response::error('I match sono già stati generati per questo torneo', Response::HTTP_BAD_REQUEST)->send();
            return;
        }

        // Estrai gli ID dei team e randomizza
        $teams = array_map(fn($ct) => $ct->team_id, $teamsInCompetition);
        shuffle($teams); // RANDOMIZZAZIONE

        // Genera match primo round (phase 1)
        $firstRoundMatches = $competition->team_number / 2;
        $createdGames = [];

        // Trova la fase di partenza
        $phase = $competition->phases;

        for ($i = 0; $i < $firstRoundMatches; $i++) {
            $homeTeam = $teams[$i * 2];
            $awayTeam = $teams[$i * 2 + 1];
            $position = $i + 1;

            $game = Game::create([
                'competition_id' => $id,
                'home_team' => $homeTeam,
                'away_team' => $awayTeam,
                'phase' => $phase,
                'result' => '0-0',
                'winner' => null,
                "position" => $position
            ]);

            $createdGames[] = $game;
        }

        Response::success(
            $createdGames, 
            Response::HTTP_CREATED, 
            "Torneo avviato! Generati {$firstRoundMatches} match del primo turno"
        )->send();

    } catch (\Exception $e) {
        Response::error('Errore durante l\'avvio del torneo: ' . $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR)->send();
    }
});

/**
 * PUT|PATCH /api/competitions/{id} - Aggiorna competizione
 */
Router::match(['put', 'patch'], '/competitions/{id}', function ($id) {
    try {
        $request = new Request();
        $data = $request->json();

        $competition = Competition::find($id);
        if ($competition === null) {
            Response::error('Competizione non trovata', Response::HTTP_NOT_FOUND)->send();
            return;
        }

        $errors = Competition::validate(array_merge($competition->toArray(), $data));
        if (!empty($errors)) {
            Response::error('Errore di validazione', Response::HTTP_BAD_REQUEST, $errors)->send();
            return;
        }

        $phases = log($data['team_number'], 2);
        $data['phases'] = $phases;

        $competition->update($data);

        Response::success($competition, Response::HTTP_OK, "Competizione aggiornata con successo")->send();
    } catch (\Exception $e) {
        Response::error('Errore durante l\'aggiornamento della competizione: ' . $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR)->send();
    }
});

/**
 * DELETE /api/competitions/{id} - Elimina competizione
 */
Router::delete('/competitions/{id}', function ($id) {
    try {
        $competition = Competition::find($id);
        if ($competition === null) {
            Response::error('Competizione non trovata', Response::HTTP_NOT_FOUND)->send();
            return;
        }

        $competition->delete();

        Response::success(null, Response::HTTP_OK, "Competizione eliminata con successo")->send();
    } catch (\Exception $e) {
        Response::error('Errore durante l\'eliminazione della competizione: ' . $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR)->send();
    }
});

/**
 * GET /api/competitions/{id}/games - Lista partite di una competizione
 */
Router::get('/competitions/{id}/games', function ($id) {
    try {
        $competition = Competition::find($id);
        if ($competition === null) {
            Response::error('Competizione non trovata', Response::HTTP_NOT_FOUND)->send();
            return;
        }

        $allGames = Game::all();
        $games = array_filter($allGames, fn($game) => $game['competition_ref'] === $id);

        Response::success(array_values($games))->send();
    } catch (\Exception $e) {
        Response::error('Errore nel recupero delle partite della competizione: ' . $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR)->send();
    }
});
