CREATE TABLE teams(
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name varchar(50) not null,
  logo text not null,
  created_at timestamp not null default now(),
  updated_at timestamp
);
CREATE TABLE competitions(
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name varchar(50) not null,
  team_number smallint not null,
  phases smallint not null,
  winner int default null,
  created_at timestamp not null default now(),
  updated_at timestamp,
  CHECK (phases IN (2, 3, 4)),
  CHECK (team_number IN (4, 8, 16)),
  FOREIGN KEY (winner) references teams(id)
);

CREATE TABLE games(
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY key,
  competition_id int not null,
  home_team int,
  away_team int,
  phase smallint not null,
  winner int default null,
  "position" smallint not null,
  result varchar(5) not null default '0-0',
  FOREIGN KEY (competition_id) references competitions(id),
  FOREIGN KEY (home_team) references teams(id),
  FOREIGN KEY (away_team) references teams(id),
  created_at timestamp not null default now(),
  updated_at timestamp,
  CHECK (home_team IS NULL OR away_team IS NULL OR home_team <> away_team),
  CHECK (phase IN (1, 2, 3, 4)),
  CHECK (winner IS NULL OR winner = home_team OR winner = away_team)
);

CREATE TABLE athletes(
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name varchar(50) not null,
  surname varchar(50) not null,
  age smallint not null,
  team_id int not null,
  FOREIGN KEY (team_id) references teams(id),
  created_at timestamp not null default now(),
  updated_at timestamp
);

CREATE TABLE competition_teams (
  competition_id INT NOT NULL,
  team_id INT NOT NULL,
  PRIMARY KEY (competition_id, team_id),
  FOREIGN KEY (competition_id) REFERENCES competitions(id),
  FOREIGN KEY (team_id) REFERENCES teams(id),
  created_at timestamp not null default now(),
  updated_at timestamp
);