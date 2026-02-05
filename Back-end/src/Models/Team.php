<?php

namespace App\Models;

use App\Traits\HasRelations;
use App\Traits\WithValidate;

class Team extends BaseModel
{

    use WithValidate;
    use HasRelations;

    //* active recors --> intanto creiamo l'istanza, poi la popoliamo, per questo settiamo tutto come null
    public ?string $name = null;
    public ?string $logo = null;

    protected static ?string $table = "teams";

    public function __construct(array $data = [])
    {
        parent::__construct($data);
    }

    protected static function validationRules(): array
    {
        return [
            "name" => ["required", "min:1", "max:100"],
            "logo" => ["sometimes", function ($field, $value, $data) {
                if ($value !== null && $value !== "") {
                    if (!filter_var($value, FILTER_VALIDATE_URL) && !preg_match('/^\/[^\/]/', $value)) {
                        return "Il campo $field deve essere un URL o un path valido";
                    }
                }
            }],
        ];
    }

    //* definisco relazione con tabella -> riferimento della classe con relazione
    protected function athletes()
    {
        return $this->hasMany(Athlete::class, 'team_ref');
    }
    protected function competitionsWon()
    {
        return $this->hasMany(Competition::class, 'winner');
    }
    protected function competitions()
    {
        return $this->belongsToMany(Competition::class, 'competition_teams', 'team_id', 'competition_id');
    }
    protected function homeGames()
    {
        return $this->hasMany(Game::class, 'home_team');
    }
    protected function awayGames()
    {
        return $this->hasMany(Game::class, 'away_team');
    }
    protected function gamesWon()
    {
        return $this->hasMany(Game::class, 'winner');
    }
}
