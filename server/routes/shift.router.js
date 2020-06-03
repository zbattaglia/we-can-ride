const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');


/**
 * GET route template
 */
router.get(`/myshift/:user_id`, rejectUnauthenticated, (req, res) => {
    const sqlText = `SELECT "date", ("start_of_lesson" - INTERVAL '15 minutes') AS "time_to_arrive", 
    "title" AS "role" FROM "shift"
    JOIN "slot" ON "shift"."slot_id" = "slot"."id"
    JOIN "lesson" ON "slot"."lesson_id" = "lesson"."id"
    JOIN "skill" ON "skill_needed" = "skill"."id"
    WHERE "assigned_user" = $1
    ;`;
    pool.query(sqlText, [req.params.user_id]).then( (response) => {
        res.send( response.rows );
    }).catch( (error) => {
        console.log( 'Error getting all shifts', error );
        res.sendStatus( 500 );
    });
});

router.get('/fourweeks', rejectUnauthenticated, (req, res) => {
    const sqlText = `SELECT EXTRACT(DOW FROM "date") AS "weekday", "shift"."id", "date", "start_of_lesson", ("start_of_lesson" + "length_of_lesson") AS "end_of_lesson", "skill"."title", "eu"."first_name" AS "expected_first_name", "au"."first_name" AS "assigned_first_name", LEFT("au"."last_name", 1) AS "assigned_user_last_initial", "expected_user", "assigned_user", "client" FROM "shift" 
    JOIN "slot" ON "shift"."slot_id" = "slot"."id"
    JOIN "lesson" ON "slot"."lesson_id" = "lesson"."id"
    LEFT JOIN "user" AS "eu" ON "expected_user" = "eu"."id"
    LEFT JOIN "user" AS "au" ON "assigned_user" = "au"."id"
    LEFT JOIN "skill" ON "skill_needed" = "skill"."id"
    WHERE "date" >= (current_date + cast(abs(extract(dow from current_date) - 6) - 7 as int)) AND "date" < DATE ((current_date + INTERVAL '4 weeks')::timestamp::date) + cast(abs(extract(dow from current_date)-6) - 7 as int)
    ORDER BY "date", "start_of_lesson";`;

    pool.query( sqlText )
        .then( (response) => {
            res.send( response.rows );
        })
        .catch( (error) => {
            console.log( 'Error getting all shifts', error );
            res.sendStatus( 500 );
        })
});

router.get(`/all`, rejectUnauthenticated, (req, res) => {
    const sqlText = `SELECT * FROM "shift";`;
    pool.query(sqlText)
    .then( (response) => {
        res.send( response.rows );
    })
    .catch( (error) => {
        console.log( 'Error getting all shifts', error );
        res.sendStatus( 500 );
    });
});

/**
 * POST route template
 */
router.post('/', rejectUnauthenticated, (req, res) => {

});

module.exports = router;