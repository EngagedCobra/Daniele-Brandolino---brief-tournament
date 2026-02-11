CREATE TABLE public.teams (
  id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
  name character varying(50) NOT NULL,
  logo text NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT now(),
  updated_at timestamp without time zone NULL
);

ALTER TABLE public.teams ADD CONSTRAINT teams_pkey PRIMARY KEY (id);insert into "public"."teams" ("created_at", "id", "logo", "name", "updated_at") values ('2026-02-05 17:42:15', 8, 'http://back-end.test/teamLogos/logo-3.png', 'Raven', '2026-02-05 17:42:15');
insert into "public"."teams" ("created_at", "id", "logo", "name", "updated_at") values ('2026-02-05 17:42:23', 9, 'http://back-end.test/teamLogos/logo-4.png', 'Portofino', '2026-02-05 17:42:23');
insert into "public"."teams" ("created_at", "id", "logo", "name", "updated_at") values ('2026-02-05 17:42:45', 12, 'http://back-end.test/teamLogos/logo-6.png', 'PSGTeam', '2026-02-05 17:42:45');
insert into "public"."teams" ("created_at", "id", "logo", "name", "updated_at") values ('2026-02-11 19:34:09', 19, 'http://back-end.test/teamLogos/logo-13.png', 'Abba', '2026-02-11 19:34:09');
insert into "public"."teams" ("created_at", "id", "logo", "name", "updated_at") values ('2026-02-05 17:42:09', 7, 'http://back-end.test/teamLogos/logo-2.png', 'Liquid', '2026-02-11 19:34:49');
insert into "public"."teams" ("created_at", "id", "logo", "name", "updated_at") values ('2026-02-05 17:42:32', 10, 'http://back-end.test/teamLogos/logo-19.png', 'InsideMan', '2026-02-11 19:45:22');
insert into "public"."teams" ("created_at", "id", "logo", "name", "updated_at") values ('2026-02-05 17:42:36', 11, 'http://back-end.test/teamLogos/logo-5.png', 'Leopards', '2026-02-11 19:45:37');
insert into "public"."teams" ("created_at", "id", "logo", "name", "updated_at") values ('2026-02-05 17:42:53', 13, 'http://back-end.test/teamLogos/logo-7.png', 'Skeleton', '2026-02-11 19:45:44');
insert into "public"."teams" ("created_at", "id", "logo", "name", "updated_at") values ('2026-02-11 19:33:53', 14, 'http://back-end.test/teamLogos/logo-8.png', 'Supra', '2026-02-11 19:45:48');
insert into "public"."teams" ("created_at", "id", "logo", "name", "updated_at") values ('2026-02-11 19:33:57', 15, 'http://back-end.test/teamLogos/logo-9.png', 'G-Rex', '2026-02-11 19:45:53');
insert into "public"."teams" ("created_at", "id", "logo", "name", "updated_at") values ('2026-02-11 19:33:59', 16, 'http://back-end.test/teamLogos/logo-10.png', 'Red Ant', '2026-02-11 19:46:04');
insert into "public"."teams" ("created_at", "id", "logo", "name", "updated_at") values ('2026-02-11 19:34:01', 17, 'http://back-end.test/teamLogos/logo-11.png', 'Curse', '2026-02-11 19:46:08');
insert into "public"."teams" ("created_at", "id", "logo", "name", "updated_at") values ('2026-02-11 19:34:07', 18, 'http://back-end.test/teamLogos/logo-12.png', 'Striker', '2026-02-11 19:46:12');
insert into "public"."teams" ("created_at", "id", "logo", "name", "updated_at") values ('2026-02-11 19:34:11', 20, 'http://back-end.test/teamLogos/logo-14.png', 'eNeRGy', '2026-02-11 19:46:34');
insert into "public"."teams" ("created_at", "id", "logo", "name", "updated_at") values ('2026-02-11 19:34:13', 21, 'http://back-end.test/teamLogos/logo-15.png', 'Rogue', '2026-02-11 19:46:43');
insert into "public"."teams" ("created_at", "id", "logo", "name", "updated_at") values ('2026-02-11 19:34:14', 22, 'http://back-end.test/teamLogos/logo-16.png', 'Dynasty', '2026-02-11 19:46:48');
insert into "public"."teams" ("created_at", "id", "logo", "name", "updated_at") values ('2026-02-11 19:34:16', 23, 'http://back-end.test/teamLogos/logo-17.png', 'Manly', '2026-02-11 19:47:04');
insert into "public"."teams" ("created_at", "id", "logo", "name", "updated_at") values ('2026-02-11 19:34:18', 24, 'http://back-end.test/teamLogos/logo-18.png', 'Unicorn', '2026-02-11 19:47:09');
insert into "public"."teams" ("created_at", "id", "logo", "name", "updated_at") values ('2026-02-11 19:34:21', 26, 'http://back-end.test/teamLogos/logo-20.png', 'SkullG', '2026-02-11 19:47:14');
insert into "public"."teams" ("created_at", "id", "logo", "name", "updated_at") values ('2026-02-05 17:42:00', 6, 'http://back-end.test/teamLogos/logo-1.png', 'Milan Esport', '2026-02-11 22:05:15');
