<?php

/* Routes per gestione teams */

use App\Models\Team;
use App\Models\Athlete;
use App\Models\CompetitionTeam;
use App\Models\Competition;
use App\Utils\Response;
use App\Utils\Request;
use Pecee\SimpleRouter\SimpleRouter as Router;

/** 
 * GET /api/teams - Lista teams
 */
Router::get('/teams', function () {
    try {
        $teams = Team::all();
        Response::success($teams)->send();
    } catch (\Exception $e) {
        Response::error('Errore nel recupero della lista teams: ' . $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR)->send();
    }
});

/**
 * GET /api/teams/{id} - Dettaglio team
 */
Router::get('/teams/{id}', function ($id) {
    try {
        $team = Team::find($id);

        if ($team === null) {
            Response::error('Team non trovato', Response::HTTP_NOT_FOUND)->send();
            return;
        }

        Response::success($team)->send();
    } catch (\Exception $e) {
        Response::error('Errore nel recupero del team: ' . $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR)->send();
    }
});

/**
 * POST /api/teams - Crea nuovo team
 */
Router::post('/teams', function () {
    try {
        $request = new Request();
        $data = $request->json();

        $errors = Team::validate($data);
        if (!empty($errors)) {
            Response::error('Errore di validazione', Response::HTTP_BAD_REQUEST, $errors)->send();
            return;
        }

        $team = Team::create($data);

        Response::success($team, Response::HTTP_CREATED, "Team creato con successo")->send();
    } catch (\Exception $e) {
        Response::error('Errore durante la creazione del nuovo team: ' . $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR)->send();
    }
});

/**
 * PUT|PATCH /api/teams/{id} - Aggiorna team
 */
Router::match(['put', 'patch'], '/teams/{id}', function ($id) {
    try {
        $request = new Request();
        $data = $request->json();

        $team = Team::find($id);
        if ($team === null) {
            Response::error('Team non trovato', Response::HTTP_NOT_FOUND)->send();
            return;
        }

        $errors = Team::validate(array_merge($team->toArray(), $data));
        if (!empty($errors)) {
            Response::error('Errore di validazione', Response::HTTP_BAD_REQUEST, $errors)->send();
            return;
        }

        $team->update($data);

        Response::success($team, Response::HTTP_OK, "Team aggiornato con successo")->send();
    } catch (\Exception $e) {
        Response::error('Errore durante l\'aggiornamento del team: ' . $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR)->send();
    }
});

/**
 * DELETE /api/teams/{id} - Elimina team
 */
Router::delete('/teams/{id}', function ($id) {
    try {
        $team = Team::find($id);
        if ($team === null) {
            Response::error('Team non trovato', Response::HTTP_NOT_FOUND)->send();
            return;
        }

        $team->delete();

        $athletes = Athlete::where("team_id", "=", $id);
        foreach($athletes as $athlete) {
          $athlete->delete();
        }
        Response::success(null, Response::HTTP_OK, "Team e giocatori eliminati con successo")->send();
    } catch (\Exception $e) {
        Response::error('Errore durante l\'eliminazione del team: ' . $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR)->send();
    }
});

/**
 * GET /api/teams/{id}/athletes - Lista atleti di un team
 */
Router::get('/teams/{id}/athletes', function ($id) {
    try {
        $team = Team::find($id);
        if ($team === null) {
            Response::error('Team non trovato', Response::HTTP_NOT_FOUND)->send();
            return;
        }

        // Trova tutti gli atleti del team
        $allAthletes = Athlete::all();
        $athletes = array_filter($allAthletes, fn($athlete) => $athlete['team_ref'] === $id);

        Response::success(array_values($athletes))->send();
    } catch (\Exception $e) {
        Response::error('Errore nel recupero degli atleti del team: ' . $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR)->send();
    }
});

/**
 * GET /api/teams/{id}/competitions - Lista competizioni di un team
 */
Router::get('/teams/{id}/competitions', function ($id) {
    try {
        $team = Team::find($id);
        if ($team === null) {
            Response::error('Team non trovato', Response::HTTP_NOT_FOUND)->send();
            return;
        }

        // Trova tutte le associazioni per questo team
        $allCompetitionTeams = CompetitionTeam::all();
        $filtered = array_filter($allCompetitionTeams, fn($ct) => $ct['team_id'] === $id);
        
        // Recupera le competizioni
        $competitions = [];
        foreach ($filtered as $ct) {
            $competition = Competition::find($ct['competition_id']);
            if ($competition !== null) {
                $competitions[] = $competition;
            }
        }

        Response::success($competitions)->send();
    } catch (\Exception $e) {
        Response::error('Errore nel recupero delle competizioni del team: ' . $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR)->send();
    }
});