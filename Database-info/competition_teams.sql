CREATE TABLE public.competition_teams (
  competition_id integer NOT NULL,
  team_id integer NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT now(),
  updated_at timestamp without time zone NULL
);

ALTER TABLE public.competition_teams ADD CONSTRAINT competition_teams_pkey PRIMARY KEY (competition_id, team_id);insert into "public"."competition_teams" ("competition_id", "created_at", "team_id", "updated_at") values (7, '2026-02-11 22:00:52', 8, '2026-02-11 22:00:52');
insert into "public"."competition_teams" ("competition_id", "created_at", "team_id", "updated_at") values (7, '2026-02-11 22:00:53', 19, '2026-02-11 22:00:53');
insert into "public"."competition_teams" ("competition_id", "created_at", "team_id", "updated_at") values (7, '2026-02-11 22:00:54', 7, '2026-02-11 22:00:54');
insert into "public"."competition_teams" ("competition_id", "created_at", "team_id", "updated_at") values (7, '2026-02-11 22:00:55', 6, '2026-02-11 22:00:55');
