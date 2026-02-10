<?php

/* Routes per gestione athletes */

use App\Models\Athlete;
use App\Utils\Response;
use App\Utils\Request;
use Pecee\SimpleRouter\SimpleRouter as Router;

/**
 * GET /api/athletes - Lista atleti
 */
Router::get('/athletes', function () {
    try {
        $request = new Request();
        $team_id = $request->getParam('team_id');

        if ($team_id !== null) {
            $athletes = Athlete::where('team_id', '=', $team_id);
        } else {
            $athletes = Athlete::all();
        }

        Response::success($athletes)->send();
    } catch (\Exception $e) {
        Response::error('Errore nel recupero della lista atleti: ' . $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR)->send();
    }
});

/**
 * GET /api/athletes/?team_id={id} - Atleti di un team
 */
/* Router::get('/athletes?team_id={id}') {
  try {
    $request = new Request();
    $team_id = $request->getParam('team_id');

    if ($team_id !== null) {
      $athletes = Athlete::where('team_ref', '=', $team_id);
    } else {
      $athletes = Athlete::all();
    }

    Response::success($athletes)->send();

  } catch (\Exception $e) {
    Response::error('Errore nel recupero della lista atleti: ' . $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR)->send();
  }
} */

/**
 * GET /api/athletes/{id} - Dettaglio atleta
 */
Router::get('/athletes/{id}', function ($id) {
    try {
        $athlete = Athlete::find($id);

        if ($athlete === null) {
            Response::error('Atleta non trovato', Response::HTTP_NOT_FOUND)->send();
            return;
        }

        Response::success($athlete)->send();
    } catch (\Exception $e) {
        Response::error('Errore nel recupero dell\'atleta: ' . $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR)->send();
    }
});

/**
 * POST /api/athletes - Crea nuovo atleta
 */
Router::post('/athletes', function () {
    try {
        $request = new Request();
        $data = $request->json();

        $errors = Athlete::validate($data);
        if (!empty($errors)) {
            Response::error('Errore di validazione', Response::HTTP_BAD_REQUEST, $errors)->send();
            return;
        }

        $athletes = Athlete::where("team_id", "=", $data['team_id']);
        if (count($athletes) >= 5) {
          Response::error('Squadra al completo', Response::HTTP_METHOD_NOT_ALLOWED)->send();
        }

        $athlete = Athlete::create($data);

        Response::success($athlete, Response::HTTP_CREATED, "Atleta creato con successo")->send();
    } catch (\Exception $e) {
        Response::error('Errore durante la creazione del nuovo atleta: ' . $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR)->send();
    }
});

/**
 * PUT|PATCH /api/athletes/{id} - Aggiorna atleta
 */
Router::match(['put', 'patch'], '/athletes/{id}', function ($id) {
    try {
        $request = new Request();
        $data = $request->json();

        $athlete = Athlete::find($id);
        if ($athlete === null) {
            Response::error('Atleta non trovato', Response::HTTP_NOT_FOUND)->send();
            return;
        }

        $errors = Athlete::validate(array_merge($athlete->toArray(), $data));
        if (!empty($errors)) {
            Response::error('Errore di validazione', Response::HTTP_BAD_REQUEST, $errors)->send();
            return;
        }

        $athlete->update($data);

        Response::success($athlete, Response::HTTP_OK, "Atleta aggiornato con successo")->send();
    } catch (\Exception $e) {
        Response::error('Errore durante l\'aggiornamento dell\'atleta: ' . $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR)->send();
    }
});

/**
 * DELETE /api/athletes/{id} - Elimina atleta
 */
Router::delete('/athletes/{id}', function ($id) {
    try {
        $athlete = Athlete::find($id);
        if ($athlete === null) {
            Response::error('Atleta non trovato', Response::HTTP_NOT_FOUND)->send();
            return;
        }

        $athlete->delete();

        Response::success(null, Response::HTTP_OK, "Atleta eliminato con successo")->send();
    } catch (\Exception $e) {
        Response::error('Errore durante l\'eliminazione dell\'atleta: ' . $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR)->send();
    }
});
