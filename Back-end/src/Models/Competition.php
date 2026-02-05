<?php

namespace App\Models;

use App\Traits\HasRelations;
use App\Traits\WithValidate;

class Competition extends BaseModel
{

    use WithValidate;
    use HasRelations;

    //* active recors --> intanto creiamo l'istanza, poi la popoliamo, per questo settiamo tutto come null
    public ?string $name = null;
    public ?int $team_number = null;
    public ?int $phases = null;
    public ?int $winner = null;

    protected static ?string $table = "competitions";

    public function __construct(array $data = [])
    {
        parent::__construct($data);
    }

    protected static function validationRules(): array
    {
        return [
            "name" => ["required", "min:1", "max:50"],
            "team_number" => [
                "required",
                "numeric",
                function ($field, $value, $data) {
                    if ($value != 4 && $value != 8 && $value != 16) {
                        return "Il numero di squadre deve essere 4, 8 o 16";
                    }
                }
            ],
            "phases" => [
                "required",
                "numeric",
                function ($field, $value, $data) {
                    if ($value != 2 && $value != 3 && $value != 4) {
                        return "Il numero di fasi deve essere 2, 3 o 4";
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
                    }
                }
            ]
        ];
    }

    //* definisco relazione con tabella -> riferimento della classe con relazione
    protected function games()
    {
        return $this->hasMany(Game::class, 'competition_id');
    }
    protected function winnerTeam()
    {
        return $this->belongsTo(Team::class, 'winner');
    }
    protected function teams()
    {
        return $this->belongsToMany(Team::class, 'competition_teams', 'competition_id', 'team_id');
    }
}