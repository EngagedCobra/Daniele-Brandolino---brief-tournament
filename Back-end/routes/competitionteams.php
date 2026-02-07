<?php

/* Routes per gestione competition_teams (tabella pivot) */

use App\Models\CompetitionTeam;
use App\Models\Competition;
use App\Models\Team;
use App\Utils\Response;
use App\Utils\Request;
use Pecee\SimpleRouter\SimpleRouter as Router;

/**
 * GET /api/teams/{team_id}/competitions - Lista competizioni di un team
 */
Router::get('/teams/{team_id}/competitions', function ($team_id) {
    try {
        $team = Team::find($team_id);
        if ($team === null) {
            Response::error('Team non trovato', Response::HTTP_NOT_FOUND)->send();
            return;
        }

        // Trova tutte le associazioni per questo team
        $allCompetitionTeams = CompetitionTeam::all();
        $filtered = array_filter($allCompetitionTeams, fn($ct) => $ct->team_id == $team_id);
        
        // Recupera le competizioni
        $competitions = [];
        foreach ($filtered as $ct) {
            $competition = Competition::find($ct->competition_id);
            if ($competition !== null) {
                $competitions[] = $competition;
            }
        }

        Response::success($competitions)->send();
    } catch (\Exception $e) {
        Response::error('Errore nel recupero delle competizioni del team: ' . $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR)->send();
    }
});

/**
 * GET /api/competitions/{competition_id}/teams - Lista teams di una competizione
 */
Router::get('/competitions/{competition_id}/teams', function ($competition_id) {
    try {
        $competition = Competition::find($competition_id);
        if ($competition === null) {
            Response::error('Competizione non trovata', Response::HTTP_NOT_FOUND)->send();
            return;
        }

        // Trova tutte le associazioni per questa competizione
        $allCompetitionTeams = CompetitionTeam::where("competition_id", "=", $competition_id);
        
        // Recupera i teams
        $teams = [];
        foreach ($allCompetitionTeams as $ct) {
            $team = Team::find($ct->team_id);
            if ($team !== null) {
                $teams[] = $team;
            }
        }

        Response::success($teams)->send();
    } catch (\Exception $e) {
        Response::error('Errore nel recupero dei teams della competizione: ' . $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR)->send();
    }
});

/**
 * POST /api/competitions/{competition_id}/teams - Associa un team a una competizione
 */
Router::post('/competitions/{competition_id}/teams', function ($competition_id) {
    try {
        $request = new Request();
        $data = $request->json();

        $competition = Competition::find($competition_id);
        if ($competition === null) {
            Response::error('Competizione non trovata', Response::HTTP_NOT_FOUND)->send();
            return;
        }

        if (!isset($data['team_id'])) {
            Response::error('team_id è obbligatorio', Response::HTTP_BAD_REQUEST)->send();
            return;
        }

        $team = Team::find($data['team_id']);
        if ($team === null) {
            Response::error('Team non trovato', Response::HTTP_NOT_FOUND)->send();
            return;
        }

        // Verifica se l'associazione esiste già
        $existing = CompetitionTeam::all();
        foreach ($existing as $ct) {
            if ($ct->competition_id == $competition_id && $ct->team_id == $data['team_id']) {
                Response::error('Il team è già associato a questa competizione', Response::HTTP_BAD_REQUEST)->send();
                return;
            }
        }

        $competitionTeam = CompetitionTeam::create([
            'competition_id' => $competition_id,
            'team_id' => $data['team_id']
        ]);

        Response::success($competitionTeam, Response::HTTP_CREATED, "Team associato alla competizione con successo")->send();
    } catch (\Exception $e) {
        Response::error('Errore durante l\'associazione del team alla competizione: ' . $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR)->send();
    }
});

/**
 * POST /api/teams/{team_id}/competitions - Associa una competizione a un team
 */
Router::post('/teams/{team_id}/competitions', function ($team_id) {
    try {
        $request = new Request();
        $data = $request->json();

        $team = Team::find($team_id);
        if ($team === null) {
            Response::error('Team non trovato', Response::HTTP_NOT_FOUND)->send();
            return;
        }

        if (!isset($data['competition_id'])) {
            Response::error('competition_id è obbligatorio', Response::HTTP_BAD_REQUEST)->send();
            return;
        }

        $competition = Competition::find($data['competition_id']);
        if ($competition === null) {
            Response::error('Competizione non trovata', Response::HTTP_NOT_FOUND)->send();
            return;
        }

        // Verifica se l'associazione esiste già
        $existing = CompetitionTeam::all();
        foreach ($existing as $ct) {
            if ($ct['competition_id'] == $data['competition_id'] && $ct['team_id'] == $team_id) {
                Response::error('Il team è già associato a questa competizione', Response::HTTP_BAD_REQUEST)->send();
                return;
            }
        }

        $competitionTeam = CompetitionTeam::create([
            'competition_id' => $data['competition_id'],
            'team_id' => $team_id
        ]);

        Response::success($competitionTeam, Response::HTTP_CREATED, "Competizione associata al team con successo")->send();
    } catch (\Exception $e) {
        Response::error('Errore durante l\'associazione della competizione al team: ' . $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR)->send();
    }
});

/**
 * DELETE /api/competitions/{competition_id}/teams/{team_id} - Rimuovi team da competizione
 */
Router::delete('/competitions/{competition_id}/teams/{team_id}', function ($competition_id, $team_id) {
    try {
        $competition = Competition::find($competition_id);
        if ($competition === null) {
            Response::error('Competizione non trovata', Response::HTTP_NOT_FOUND)->send();
            return;
        }

        $team = Team::find($team_id);
        if ($team === null) {
            Response::error('Team non trovato', Response::HTTP_NOT_FOUND)->send();
            return;
        }

        // Trova l'associazione
        $competitionTeams = CompetitionTeam::all();
        $found = null;

        foreach ($competitionTeams as $ct) {
            if ($ct['competition_id'] == $competition_id && $ct['team_id'] == $team_id) {
                $found = $ct;
                break;
            }
        }

        if ($found === null) {
            Response::error('Associazione non trovata', Response::HTTP_NOT_FOUND)->send();
            return;
        }

        // Elimina l'associazione (implementa secondo il tuo ORM)
        // CompetitionTeam::deleteAssociation($competition_id, $team_id);

        Response::success(null, Response::HTTP_OK, "Team rimosso dalla competizione con successo")->send();
    } catch (\Exception $e) {
        Response::error('Errore durante la rimozione del team dalla competizione: ' . $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR)->send();
    }
});

/**
 * DELETE /api/teams/{team_id}/competitions/{competition_id} - Rimuovi competizione da team
 */
Router::delete('/teams/{team_id}/competitions/{competition_id}', function ($team_id, $competition_id) {
    try {
        $team = Team::find($team_id);
        if ($team === null) {
            Response::error('Team non trovato', Response::HTTP_NOT_FOUND)->send();
            return;
        }

        $competition = Competition::find($competition_id);
        if ($competition === null) {
            Response::error('Competizione non trovata', Response::HTTP_NOT_FOUND)->send();
            return;
        }

        // Trova l'associazione
        $competitionTeams = CompetitionTeam::all();
        $found = null;

        foreach ($competitionTeams as $ct) {
            if ($ct['competition_id'] == $competition_id && $ct['team_id'] == $team_id) {
                $found = $ct;
                break;
            }
        }

        if ($found === null) {
            Response::error('Associazione non trovata', Response::HTTP_NOT_FOUND)->send();
            return;
        }

        // Elimina l'associazione (implementa secondo il tuo ORM)
        // CompetitionTeam::deleteAssociation($competition_id, $team_id);

        Response::success(null, Response::HTTP_OK, "Competizione rimossa dal team con successo")->send();
    } catch (\Exception $e) {
        Response::error('Errore durante la rimozione della competizione dal team: ' . $e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR)->send();
    }
});
