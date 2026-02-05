<?php

/* Routes per gestione competitions */

use App\Models\Competition;
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
 * POST /api/competitions - Crea nuova competizione
 */
Router::post('/competitions', function () {
    try {
        $request = new Request();
        $data = $request->json();

        $errors = Competition::validate($data);
        if (!empty($errors)) {
            Response::error('Errore di validazione', Response::HTTP_BAD_REQUEST, $errors)->send();
            return;
        }

        $competition = Competition::create($data);

        Response::success($competition, Response::HTTP_CREATED, "Competizione creata con successo")->send();
    } catch (\Exception $e) {
        Response::error('Errore durante la creazione della nuova competizione: ' . $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR)->send();
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
        $games = array_filter($allGames, fn($game) => $game['competition_ref'] == $id);

        Response::success(array_values($games))->send();
    } catch (\Exception $e) {
        Response::error('Errore nel recupero delle partite della competizione: ' . $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR)->send();
    }
});
