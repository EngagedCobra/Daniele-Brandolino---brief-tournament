<?php

namespace App\Models;

use App\Traits\HasRelations;
use App\Traits\WithValidate;

class Athlete extends BaseModel
{

    use WithValidate;
    use HasRelations;

    //* active recors --> intanto creiamo l'istanza, poi la popoliamo, per questo settiamo tutto come null
    public ?string $name = null;
    public ?string $surname = null;
    public ?int $age = null;
    public ?int $team_id = null;

    protected static ?string $table = "athletes";

    public function __construct(array $data = [])
    {
        parent::__construct($data);
    }

    protected static function validationRules(): array
    {
        return [
            "name" => ["required", "min:1", "max:100"],
            "surname" => ["required", "min:1", "max:100"],
            "age" => ["required", "numeric", "min:18", "max:40"],
            "team_id" => ["required", "numeric", function ($field, $value, $data) {
                if ($value !== null && $value !== "") {
                    $team = Team::find((int)$value);
                    if ($team === null) {
                        return "Il team di riferimento non esiste";
                    }
                }
            }]
        ];
    }

    //* definisco relazione con tabella -> riferimento della classe con relazione
    protected function team()
    {
        return $this->belongsTo(Team::class);
    }
}
