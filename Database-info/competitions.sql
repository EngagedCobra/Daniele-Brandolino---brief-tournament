CREATE TABLE public.competitions (
  id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
  name character varying(50) NOT NULL,
  team_number smallint NOT NULL,
  phases smallint NOT NULL,
  winner integer NULL,
  created_at timestamp without time zone NOT NULL DEFAULT now(),
  updated_at timestamp without time zone NULL
);

ALTER TABLE public.competitions ADD CONSTRAINT competitions_pkey PRIMARY KEY (id);insert into "public"."competitions" ("created_at", "id", "name", "phases", "team_number", "updated_at", "winner") values ('2026-02-05 17:45:17', 1, 'Champions League 2024', 2, 4, '2026-02-07 18:58:50', 12);
insert into "public"."competitions" ("created_at", "id", "name", "phases", "team_number", "updated_at", "winner") values ('2026-02-10 21:03:46', 3, 'Torneo over the limit', 3, 8, '2026-02-10 22:35:39', 9);
insert into "public"."competitions" ("created_at", "id", "name", "phases", "team_number", "updated_at", "winner") values ('2026-02-11 00:02:57', 4, 'Terzo', 2, 4, '2026-02-11 00:02:57', 11);
insert into "public"."competitions" ("created_at", "id", "name", "phases", "team_number", "updated_at", "winner") values ('2026-02-11 16:22:19', 5, 'Grand Game', 3, 8, '2026-02-11 17:08:14', 6);
insert into "public"."competitions" ("created_at", "id", "name", "phases", "team_number", "updated_at", "winner") values ('2026-02-11 21:17:01', 6, 'Giga Match', 4, 16, '2026-02-11 21:17:01', 10);
insert into "public"."competitions" ("created_at", "id", "name", "phases", "team_number", "updated_at", "winner") values ('2026-02-11 22:00:49', 7, 'Mini torneo', 2, 4, '2026-02-11 22:00:49', NULL);
insert into "public"."competitions" ("created_at", "id", "name", "phases", "team_number", "updated_at", "winner") values ('2026-02-11 22:06:13', 8, 'Torneo over the limit', 2, 4, '2026-02-11 22:06:27', 9);
