CREATE TABLE public.games (
  id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
  competition_id integer NOT NULL,
  home_team integer NULL,
  away_team integer NULL,
  phase smallint NOT NULL,
  winner integer NULL,
  result character varying(5) NOT NULL DEFAULT '0-0'::character varying,
  created_at timestamp without time zone NOT NULL DEFAULT now(),
  updated_at timestamp without time zone NULL,
  "position" smallint NOT NULL
);

ALTER TABLE public.games ADD CONSTRAINT games_pkey PRIMARY KEY (id);insert into "public"."games" ("away_team", "competition_id", "created_at", "home_team", "id", "phase", "position", "result", "updated_at", "winner") values (8, 3, '2026-02-10 22:52:27', 9, 16, 3, 4, '2-1', '2026-02-10 22:52:27', 9);
insert into "public"."games" ("away_team", "competition_id", "created_at", "home_team", "id", "phase", "position", "result", "updated_at", "winner") values (13, 6, '2026-02-11 21:55:57', 21, 51, 3, 4, '1-0', '2026-02-11 21:55:57', 21);
insert into "public"."games" ("away_team", "competition_id", "created_at", "home_team", "id", "phase", "position", "result", "updated_at", "winner") values (22, 6, '2026-02-11 21:34:54', 10, 48, 3, 1, '1-0', '2026-02-11 21:34:54', 10);
insert into "public"."games" ("away_team", "competition_id", "created_at", "home_team", "id", "phase", "position", "result", "updated_at", "winner") values (11, 3, '2026-02-10 22:52:27', 10, 13, 3, 1, '2-1', '2026-02-10 22:52:27', 10);
insert into "public"."games" ("away_team", "competition_id", "created_at", "home_team", "id", "phase", "position", "result", "updated_at", "winner") values (13, 3, '2026-02-10 22:52:27', 6, 14, 3, 2, '1-2', '2026-02-10 22:52:27', 13);
insert into "public"."games" ("away_team", "competition_id", "created_at", "home_team", "id", "phase", "position", "result", "updated_at", "winner") values (9, 3, '2026-02-10 23:51:27', 12, 27, 2, 2, '1-2', '2026-02-10 23:51:27', 9);
insert into "public"."games" ("away_team", "competition_id", "created_at", "home_team", "id", "phase", "position", "result", "updated_at", "winner") values (13, 3, '2026-02-10 23:55:02', 10, 28, 2, 1, '0-2', '2026-02-10 23:55:02', 13);
insert into "public"."games" ("away_team", "competition_id", "created_at", "home_team", "id", "phase", "position", "result", "updated_at", "winner") values (7, 6, '2026-02-11 21:49:54', 20, 49, 3, 2, '1-0', '2026-02-11 21:49:54', 20);
insert into "public"."games" ("away_team", "competition_id", "created_at", "home_team", "id", "phase", "position", "result", "updated_at", "winner") values (13, 3, '2026-02-10 23:55:24', 9, 29, 1, 1, '5-0', '2026-02-10 23:55:24', 9);
insert into "public"."games" ("away_team", "competition_id", "created_at", "home_team", "id", "phase", "position", "result", "updated_at", "winner") values (10, 4, '2026-02-11 00:03:11', 8, 30, 2, 1, '1-2', '2026-02-11 00:03:11', 10);
insert into "public"."games" ("away_team", "competition_id", "created_at", "home_team", "id", "phase", "position", "result", "updated_at", "winner") values (9, 4, '2026-02-11 00:03:11', 11, 31, 2, 2, '3-1', '2026-02-11 00:03:11', 11);
insert into "public"."games" ("away_team", "competition_id", "created_at", "home_team", "id", "phase", "position", "result", "updated_at", "winner") values (15, 6, '2026-02-11 21:51:06', 23, 50, 3, 3, '1-0', '2026-02-11 21:51:06', 23);
insert into "public"."games" ("away_team", "competition_id", "created_at", "home_team", "id", "phase", "position", "result", "updated_at", "winner") values (20, 6, '2026-02-11 22:00:15', 10, 53, 2, 1, '2-1', '2026-02-11 22:00:15', 10);
insert into "public"."games" ("away_team", "competition_id", "created_at", "home_team", "id", "phase", "position", "result", "updated_at", "winner") values (23, 6, '2026-02-11 22:00:11', 21, 52, 2, 2, '1-0', '2026-02-11 22:00:11', 21);
insert into "public"."games" ("away_team", "competition_id", "created_at", "home_team", "id", "phase", "position", "result", "updated_at", "winner") values (10, 1, '2026-02-07 19:04:52', 11, 5, 2, 1, '0-1', '2026-02-07 19:04:52', 10);
insert into "public"."games" ("away_team", "competition_id", "created_at", "home_team", "id", "phase", "position", "result", "updated_at", "winner") values (12, 1, '2026-02-07 19:04:52', 8, 6, 2, 2, '0-1', '2026-02-07 19:04:52', 12);
insert into "public"."games" ("away_team", "competition_id", "created_at", "home_team", "id", "phase", "position", "result", "updated_at", "winner") values (21, 6, '2026-02-11 22:00:25', 10, 54, 1, 1, '5-0', '2026-02-11 22:00:25', 10);
insert into "public"."games" ("away_team", "competition_id", "created_at", "home_team", "id", "phase", "position", "result", "updated_at", "winner") values (8, 7, '2026-02-11 22:00:57', 6, 56, 2, 2, '0-0', '2026-02-11 22:00:57', NULL);
insert into "public"."games" ("away_team", "competition_id", "created_at", "home_team", "id", "phase", "position", "result", "updated_at", "winner") values (19, 7, '2026-02-11 22:00:57', 7, 55, 2, 1, '1-0', '2026-02-11 22:00:57', 7);
insert into "public"."games" ("away_team", "competition_id", "created_at", "home_team", "id", "phase", "position", "result", "updated_at", "winner") values (NULL, 7, '2026-02-11 22:01:01', 7, 57, 1, 1, '0-0', '2026-02-11 22:01:01', NULL);
insert into "public"."games" ("away_team", "competition_id", "created_at", "home_team", "id", "phase", "position", "result", "updated_at", "winner") values (12, 1, '2026-02-07 20:12:16', 10, 12, 1, 1, '0-1', '2026-02-07 20:12:16', 12);
insert into "public"."games" ("away_team", "competition_id", "created_at", "home_team", "id", "phase", "position", "result", "updated_at", "winner") values (21, 8, '2026-02-11 22:06:39', 9, 58, 2, 1, '1-0', '2026-02-11 22:06:39', 9);
insert into "public"."games" ("away_team", "competition_id", "created_at", "home_team", "id", "phase", "position", "result", "updated_at", "winner") values (11, 4, '2026-02-11 00:03:18', 10, 32, 1, 1, '1-2', '2026-02-11 00:03:18', 11);
insert into "public"."games" ("away_team", "competition_id", "created_at", "home_team", "id", "phase", "position", "result", "updated_at", "winner") values (12, 5, '2026-02-11 17:08:42', 7, 33, 3, 1, '2-1', '2026-02-11 17:08:42', 7);
insert into "public"."games" ("away_team", "competition_id", "created_at", "home_team", "id", "phase", "position", "result", "updated_at", "winner") values (20, 8, '2026-02-11 22:06:39', 7, 59, 2, 2, '0-2', '2026-02-11 22:06:39', 20);
insert into "public"."games" ("away_team", "competition_id", "created_at", "home_team", "id", "phase", "position", "result", "updated_at", "winner") values (11, 5, '2026-02-11 17:08:42', 6, 34, 3, 2, '5-0', '2026-02-11 17:08:42', 6);
insert into "public"."games" ("away_team", "competition_id", "created_at", "home_team", "id", "phase", "position", "result", "updated_at", "winner") values (8, 5, '2026-02-11 17:08:42', 10, 35, 3, 3, '1-3', '2026-02-11 17:08:42', 8);
insert into "public"."games" ("away_team", "competition_id", "created_at", "home_team", "id", "phase", "position", "result", "updated_at", "winner") values (20, 8, '2026-02-11 22:06:44', 9, 60, 1, 1, '1-0', '2026-02-11 22:06:44', 9);
insert into "public"."games" ("away_team", "competition_id", "created_at", "home_team", "id", "phase", "position", "result", "updated_at", "winner") values (7, 3, '2026-02-10 22:52:27', 12, 15, 3, 3, '3-1', '2026-02-10 22:52:27', 12);
insert into "public"."games" ("away_team", "competition_id", "created_at", "home_team", "id", "phase", "position", "result", "updated_at", "winner") values (13, 5, '2026-02-11 17:08:42', 9, 36, 3, 4, '1-2', '2026-02-11 17:08:42', 13);
insert into "public"."games" ("away_team", "competition_id", "created_at", "home_team", "id", "phase", "position", "result", "updated_at", "winner") values (6, 5, '2026-02-11 17:08:48', 7, 37, 2, 1, '1-2', '2026-02-11 17:08:48', 6);
insert into "public"."games" ("away_team", "competition_id", "created_at", "home_team", "id", "phase", "position", "result", "updated_at", "winner") values (13, 5, '2026-02-11 17:09:03', 8, 38, 2, 2, '3-1', '2026-02-11 17:09:03', 8);
insert into "public"."games" ("away_team", "competition_id", "created_at", "home_team", "id", "phase", "position", "result", "updated_at", "winner") values (8, 5, '2026-02-11 20:46:39', 6, 39, 1, 1, '1-0', '2026-02-11 20:46:39', 6);
insert into "public"."games" ("away_team", "competition_id", "created_at", "home_team", "id", "phase", "position", "result", "updated_at", "winner") values (18, 6, '2026-02-11 21:34:46', 10, 40, 4, 1, '2-1', '2026-02-11 21:34:46', 10);
insert into "public"."games" ("away_team", "competition_id", "created_at", "home_team", "id", "phase", "position", "result", "updated_at", "winner") values (22, 6, '2026-02-11 21:34:46', 8, 41, 4, 2, '1-2', '2026-02-11 21:34:46', 22);
insert into "public"."games" ("away_team", "competition_id", "created_at", "home_team", "id", "phase", "position", "result", "updated_at", "winner") values (20, 6, '2026-02-11 21:34:46', 14, 42, 4, 3, '1-2', '2026-02-11 21:34:46', 20);
insert into "public"."games" ("away_team", "competition_id", "created_at", "home_team", "id", "phase", "position", "result", "updated_at", "winner") values (7, 6, '2026-02-11 21:34:46', 19, 43, 4, 4, '1-2', '2026-02-11 21:34:46', 7);
insert into "public"."games" ("away_team", "competition_id", "created_at", "home_team", "id", "phase", "position", "result", "updated_at", "winner") values (23, 6, '2026-02-11 21:34:46', 17, 44, 4, 5, '1-2', '2026-02-11 21:34:46', 23);
insert into "public"."games" ("away_team", "competition_id", "created_at", "home_team", "id", "phase", "position", "result", "updated_at", "winner") values (15, 6, '2026-02-11 21:34:46', 6, 45, 4, 6, '0-1', '2026-02-11 21:34:46', 15);
insert into "public"."games" ("away_team", "competition_id", "created_at", "home_team", "id", "phase", "position", "result", "updated_at", "winner") values (21, 6, '2026-02-11 21:34:46', 11, 46, 4, 7, '0-1', '2026-02-11 21:34:46', 21);
insert into "public"."games" ("away_team", "competition_id", "created_at", "home_team", "id", "phase", "position", "result", "updated_at", "winner") values (16, 6, '2026-02-11 21:34:46', 13, 47, 4, 8, '2-1', '2026-02-11 21:34:46', 13);
