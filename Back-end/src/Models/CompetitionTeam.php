<?php

namespace App\Models;

use App\Traits\HasRelations;
use App\Traits\WithValidate;

class CompetitionTeam extends BaseModel
{

    use WithValidate;
    use HasRelations;

    public ?int $competition_id = null;
    public ?int $team_id = null;

    protected static ?string $table = "competition_teams";

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
            "team_id" => [
                "required",
                "numeric",
                function ($field, $value, $data) {
                    $team = Team::find((int)$value);
                    if ($team === null) {
                        return "Il team non esiste";
                    }
                }
            ]
        ];
    }
    //* definisco relazione con tabella -> riferimento della classe con relazione
    protected function competition()
    {
        return $this->belongsTo(Competition::class);
    }
    protected function team()
    {
        return $this->belongsTo(Team::class);
    }
}
