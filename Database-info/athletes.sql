CREATE TABLE public.athletes (
  id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
  name character varying(50) NOT NULL,
  surname character varying(50) NOT NULL,
  age smallint NOT NULL,
  team_id integer NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT now(),
  updated_at timestamp without time zone NULL
);

ALTER TABLE public.athletes ADD CONSTRAINT athletes_pkey PRIMARY KEY (id);insert into "public"."athletes" ("age", "created_at", "id", "name", "surname", "team_id", "updated_at") values (24, '2026-02-05 17:51:11', 1, 'Daniele', 'Brandolino', 8, '2026-02-05 17:51:11');
insert into "public"."athletes" ("age", "created_at", "id", "name", "surname", "team_id", "updated_at") values (32, '2026-02-11 19:07:40', 8, 'Daniele', 'Brandolino', 6, '2026-02-11 19:07:40');
insert into "public"."athletes" ("age", "created_at", "id", "name", "surname", "team_id", "updated_at") values (32, '2026-02-11 18:50:37', 5, 'Daniele', 'Brandolino', 6, '2026-02-11 19:11:55');
insert into "public"."athletes" ("age", "created_at", "id", "name", "surname", "team_id", "updated_at") values (40, '2026-02-11 18:58:42', 6, 'Daniele', 'Brandolino', 6, '2026-02-11 19:12:04');
insert into "public"."athletes" ("age", "created_at", "id", "name", "surname", "team_id", "updated_at") values (18, '2026-02-11 21:03:35', 9, 'Daniele', 'Pellico', 9, '2026-02-11 21:03:35');
insert into "public"."athletes" ("age", "created_at", "id", "name", "surname", "team_id", "updated_at") values (18, '2026-02-11 21:10:50', 10, 'Daniele', 'Pellico', 8, '2026-02-11 21:10:50');
insert into "public"."athletes" ("age", "created_at", "id", "name", "surname", "team_id", "updated_at") values (32, '2026-02-11 19:07:39', 7, 'Daniele', 'Brandolino', 6, '2026-02-11 22:05:41');
