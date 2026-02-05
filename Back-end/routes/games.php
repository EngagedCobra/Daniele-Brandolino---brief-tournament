<?php

/* Routes per gestione games */

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
            $games = array_filter($games, fn($game) => $game['competition_ref'] == $competition_id);
        }

        // Filtra per phase se presente
        if ($phase !== null) {
            $games = array_filter($games, fn($game) => $game['phase'] == $phase);
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

        $game->update($data);

        Response::success($game, Response::HTTP_OK, "Partita aggiornata con successo")->send();
    } catch (\Exception $e) {
        Response::error('Errore durante l\'aggiornamento della partita: ' . $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR)->send();
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
