<?php

namespace App\Models;

use App\Traits\HasRelations;
use App\Traits\WithValidate;

class Game extends BaseModel
{

    use WithValidate;
    use HasRelations;

    public ?int $competition_id = null;
    public ?int $away_team = null;
    public ?int $home_team = null;
    public ?int $phase = null;
    public ?int $winner = null;
    public ?string $result = null;
    public ?int $position = null;

    protected static ?string $table = "games";

    public function __construct(array $data = [])
    {
        parent::__construct($data);
    }

    protected static function validationRules(): array
    {
        return [
            "competition_id" => [
                "required",
                "numeric",
                function ($field, $value, $data) {
                    $competition = Competition::find((int)$value);
                    if ($competition === null) {
                        return "La competizione non esiste";
                    }
                }
            ],
            "home_team" => [
                "sometimes",
                "numeric",
                function ($field, $value, $data) {
                    if ($value !== null && $value !== "") {
                        $team = Team::find((int)$value);
                        if ($team === null) {
                            return "La squadra di casa non esiste";
                        }

                        // Verifica che home_team e away_team siano diversi
                        if (isset($data['away_team']) && $data['away_team'] !== null && $data['away_team'] !== "") {
                            if ($value === $data['away_team']) {
                                return "La squadra di casa e quella ospite devono essere diverse";
                            }
                        }
                    }
                }
            ],
            "away_team" => [
                "sometimes",
                "numeric",
                function ($field, $value, $data) {
                    if ($value !== null && $value !== "") {
                        $team = Team::find((int)$value);
                        if ($team === null) {
                            return "La squadra ospite non esiste";
                        }

                        // Verifica che home_team e away_team siano diversi
                        if (isset($data['home_team']) && $data['home_team'] !== null && $data['home_team'] !== "") {
                            if ($value === $data['home_team']) {
                                return "La squadra di casa e quella ospite devono essere diverse";
                            }
                        }
                    }
                }
            ],
            "phase" => [
                "required",
                "numeric",
                function ($field, $value, $data) {
                    if ($value !== 1 && $value !== 2 && $value !== 3 && $value !== 4) {
                        return "La fase del torneo deve essere 1, 2, 3 o 4";
                    }
                }
            ],
            "winner" => [
                "sometimes",
                "numeric",
                function ($field, $value, $data) {
                    if ($value !== null && $value !== "") {
                        $team = Team::find((int)$value);
                        if ($team === null) {
                            return "Il team vincitore non esiste";
                        }

                        // Verifica che il vincitore sia home_team o away_team
                        $homeTeam = $data['home_team'] ?? null;
                        $awayTeam = $data['away_team'] ?? null;

                        if ($homeTeam !== null && $awayTeam !== null) {
                            if ($value !== $homeTeam && $value !== $awayTeam) {
                                return "Il vincitore deve essere una delle due squadre che giocano";
                            }
                        }
                    }
                }
            ],
            "result" => [
                "sometimes",
                "min:1",
                "max:5",
                function ($field, $value, $data) {
                    // Se non è presente, usa il default '0-0'
                    if ($value === null || $value === "") {
                        return null;
                    }
                    // Verifica formato "X-Y"
                    if (!preg_match('/^\d{1,2}-\d{1,2}$/', $value)) {
                        return "Il formato del risultato deve essere 'X-Y' (es. '2-1')";
                    }
                }
            ],
            "position" => [
                "required",
                "numeric"
            ]
        ];
    }

    //* definisco relazione con tabella -> riferimento della classe con relazione
    protected function competition()
    {
        return $this->belongsTo(Competition::class, 'competition_id');
    }
    protected function homeTeam()
    {
        return $this->belongsTo(Team::class, 'home_team');
    }
    protected function awayTeam()
    {
        return $this->belongsTo(Team::class, 'away_team');
    }
    protected function winnerTeam()
    {
        return $this->belongsTo(Team::class, 'winner');
    }
}
