--create a database called 'we_can_ride'
--in that database run these queries
--Create all the tables
--Create users table
CREATE TABLE "user" (
    "id" serial PRIMARY KEY,
    password VARCHAR(255),
    "type_of_user" VARCHAR(50),
    "email" VARCHAR(100),
    "birthday" DATE,
    "phone" VARCHAR(22),
    "first_name" VARCHAR(50),
    "last_name" VARCHAR(50)
);
--Create availablity table
CREATE TABLE "availability" (
    "id" serial PRIMARY KEY,
    "time_available" VARCHAR(255)
);
--Create skills table
CREATE TABLE "skill" (
    "id" serial PRIMARY KEY,
    "title" VARCHAR(255)
);
--Create user_availability table
CREATE TABLE "user_availability" (
    "id" serial PRIMARY KEY,
    "user_id" INT REFERENCES "user",
    "availability_id" INT REFERENCES "availability"
);
--Create user_skills table
CREATE TABLE "user_skill" (
    "id" serial PRIMARY KEY,
    "skill_id" INT REFERENCES "skill",
    "user_id" INT REFERENCES "user"
);
--Create sessions table
CREATE TABLE "session" (
    "id" serial PRIMARY KEY,
    "start_date" DATE,
    "length_in_weeks" INTERVAL,
    "ready_to_publish" BOOLEAN,
    "session_type" VARCHAR(50)
);
--Create lessons table
CREATE TABLE "lesson" (
    "id" serial PRIMARY KEY,
    "session_id" INT REFERENCES "session",
    "start_of_lesson" time without time zone,
    "client" VARCHAR(255),
    "length_of_lesson" INTERVAL,
    "day_of_week" timestamp without time zone
);
--Create slots table
CREATE TABLE "slot" (
    "id" serial PRIMARY KEY,
    "lesson_id" INT REFERENCES "lesson",
    "skill_needed" INT REFERENCES "skill",
    "expected_user" INT REFERENCES "user"
);
--Create shifts table
CREATE TABLE "shift" (
    "id" serial PRIMARY KEY,
    "slot_id" INT REFERENCES "slot",
    "date" DATE,
    "assigned_user" INT REFERENCES "user",
    "user_wants_to_trade" boolean DEFAULT false
);
--INSERT skills
INSERT INTO "skill"("id", "title") 
VALUES
(1, 'side walker'),
(2, 'leader'),
(3, 'barn aid'),
(4, 'feeder') RETURNING "id", "title";
--INSERT availabilities
INSERT INTO "availability"("id", "time_available") 
VALUES
(1, 'weekday morning'),
(2, 'weekday evening'),
(3, 'weekend morning'),
(4, 'wekeend evening')
RETURNING "id", "time_available";
--TODO eventually the stuff below here should be deleted for the final project
-- weeks start on Saturday (which is weekday 6)
--you can just do 8 weeks, 60 minutes, whatever, in a field that's an interval
--INSERT practice data into our tables so we have something to look at
--users
INSERT INTO "public"."user"("password", "type_of_user", "email", "first_name") 
VALUES
('wecanride', 'admin', 'rina@wecanride.com', 'Rina'), 
('frieda', 'volunteer', 'kajakali@hotmail.com', '04-03-1987', '8433241666', 'Frieda', 'Jacobson')
RETURNING "id", "password", "type_of_user", "email", "birthday", "phone", 
"first_name", "last_name";
--queries we might need
--create a new user
INSERT INTO "user"("username", "password", "type_of_user", "email", "birthday", "phone", "first_name", "last_name") VALUES('bibi', 'bibilikesmilk', 'volunteer', 'bibi@gmail.com', '04-03-1987', '8433241414', 'Frieda', 'Jacobson') 
RETURNING "id", "username", "password", "type_of_user", "email", "birthday", "phone", "first_name", "last_name";
--create a new session
INSERT INTO "session"("start_date", "length_in_weeks", "ready_to_publish") 
VALUES('5 may 2020', '10 weeks', FALSE) 
RETURNING "id", "start_date", "length_in_weeks", "ready_to_publish";
--create a new lesson
INSERT INTO "lesson"("session_id", "start_of_lesson", "day_of_week", "client", "length_of_lesson") 
VALUES(1, '9:30', 'Wednesday', 'R', '45 minutes') 
RETURNING "id", "session_id", "start_of_lesson", "day_of_week", "client", "length_of_lesson";
--create a new slot
INSERT INTO "slot"("lesson_id", "skill_needed") VALUES(4, 1), (4, 1), (4, 2) 
RETURNING "id", "lesson_id", "skill_needed", "expected_user";
--create the shifts for a slot based on the length of the session and the day of the week of the slot and the start date of the session. start date is 2020-01-06, monday is the first day so add 0 days, and then add 7 days for each one
INSERT INTO "shift"("slot_id", "date") 
VALUES
(3, INTERVAL '0 days' + DATE '2020-01-06'), 
(3, INTERVAL '7 days' + DATE '2020-01-06'),
(3, INTERVAL '14 days' + DATE '2020-01-06'),
(3, INTERVAL '21 days' + DATE '2020-01-06'), 
(3, INTERVAL '28 days' + DATE '2020-01-06'), 
(3, INTERVAL '35 days' + DATE '2020-01-06'), 
(3, INTERVAL '42 days' + DATE '2020-01-06'), 
(3, INTERVAL '49 days' + DATE '2020-01-06')
RETURNING "id", "slot_id", "date", "assigned_user";
--get all the shifts to show them in the calendar
--can use the same with a WHERE clause by date to get them for one date
--currently shows the first name of the expected and assigned users, but adding the last names is trivial
SELECT "shift"."id", "date", "start_of_lesson", ("start_of_lesson" + "length_of_lesson") AS "end_of_lesson", "skill"."title", "eu"."first_name" AS "expected_first_name", "au"."first_name" AS "assigned_first_name", LEFT("au"."last_name", 1) AS "assigned_user_last_initial", "expected_user", "assigned_user", "client" FROM "shift" 
JOIN "slot" ON "shift"."slot_id" = "slot"."id"
JOIN "lesson" ON "slot"."lesson_id" = "lesson"."id"
LEFT JOIN "user" AS "eu" ON "expected_user" = "eu"."id"
LEFT JOIN "user" AS "au" ON "assigned_user" = "au"."id"
LEFT JOIN "skill" ON "skill_needed" = "skill"."id"
;
-- GET My shifts that I'm signed up for user number 5 (available as match param)
SELECT "date", ("start_of_lesson" - INTERVAL '15 minutes') AS "time_to_arrive", "title" AS "role" FROM "shift"
JOIN "slot" ON "shifts"."slot_id" = "slot"."id"
JOIN "lesson" ON "slots"."lesson_id" = "lesson"."id"
JOIN "skill" ON "skill_needed" = "skill"."id"
WHERE "assigned_user" = 5
;
--substitute page - show roles that don't have someone assigned. This is the same as above but assigned_user IS NULL
-- Next step is the same but with skills. And then the same but with availability... 
SELECT "shift"."id", "date", "start_of_lesson", ("start_of_lesson" + "length_of_lesson") AS "end_of_lesson", "skill"."title", "eu"."first_name" AS "expected_first_name", "au"."first_name" AS "assigned_first_name", LEFT("au"."last_name", 1) AS "assigned_user_last_initial", "expected_user", "assigned_user", "client" FROM "shift" 
JOIN "slot" ON "shift"."slot_id" = "slot"."id"
JOIN "lesson" ON "slot"."lesson_id" = "lesson"."id"
LEFT JOIN "user" AS "eu" ON "expected_user" = "eu"."id"
LEFT JOIN "user" AS "au" ON "assigned_user" = "au"."id"
LEFT JOIN "skill" ON "skill_needed" = "skill"."id"
WHERE "assigned_user" IS NULL
;
--show this user's skills (which we can compare to the skills needed and only show if they match)
SELECT "skill"."id" AS "skill_id", "title" FROM "user"
LEFT JOIN "user_skill" ON "user_skill"."user_id" = "user"."id"
JOIN "skill" ON "user_skill"."skill_id" = "skill"."id"
WHERE "user"."id" = 2
;
--show this user's availability ( which we can keep in a reducer and compare to the list of unassigned shifts)
SELECT "availability"."id" AS "availability_id", "time_available" FROM "user"
LEFT JOIN "user_availability" ON "user_availability"."user_id" = "user"."id"
JOIN "availability" ON "user_availability"."availability_id" = "availability"."id"
WHERE "user"."id" = 2
;
--show all the users who have a specific skill like side-walker
SELECT "user"."id", "first_name", "email", LEFT("last_name", 1) AS "last_initial" FROM "user"
LEFT JOIN "user_skills" ON "user_skills"."user_id" = "user"."id"
JOIN "skill" ON "user_skill"."skill_id" = "skill"."id"
WHERE "title" = 'side walker'
;
--show all the shifts for the whole week
SELECT EXTRACT(DOW FROM "date") AS "weekday", "shift"."id", "date", "start_of_lesson", ("start_of_lesson" + "length_of_lesson") AS "end_of_lesson", "skill"."title", "eu"."first_name" AS "expected_first_name", "au"."first_name" AS "assigned_first_name", LEFT("au"."last_name", 1) AS "assigned_user_last_initial", "expected_user", "assigned_user", "client" FROM "shift" 
JOIN "slot" ON "shift"."slot_id" = "slot"."id"
JOIN "lesson" ON "slot"."lesson_id" = "lesson"."id"
LEFT JOIN "user" AS "eu" ON "expected_user" = "eu"."id"
LEFT JOIN "user" AS "au" ON "assigned_user" = "au"."id"
LEFT JOIN "skill" ON "skill_needed" = "skill"."id"
WHERE "date" >= '2020-01-27' AND "date" < DATE '2020-01-27' + INTERVAL '1 week'
;
-- getting the days of the week from the lessons Monday is 1, Sunday is 7...
SELECT EXTRACT (DOW FROM "day_of_week") AS "weekday", * FROM "lesson"
;
--select hours of a person that have been done before today
SELECT "user"."id", SUM("length_of_lesson") FROM "user" 
LEFT JOIN "shift" ON "shift"."assigned_user" = "user"."id"
JOIN "slot" ON "shift"."slot_id" = "slot"."id"
JOIN "lesson" ON "lesson"."id" = "slot"."lesson_id"
WHERE "user"."id" = 5 AND "date" < NOW()
GROUP BY "user"."id"
;
SELECT * FROM "user" 
LEFT JOIN "shift" ON "shift"."assigned_user" = "user"."id"
JOIN "slot" ON "shift"."slot_id" = "slot"."id"
JOIN "lesson" ON "lesson"."id" = "slot"."lesson_id"
WHERE "user"."id" = 5
;
