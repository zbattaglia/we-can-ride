const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');


/**
 * GET route template
 */
router.get(`/all`, rejectUnauthenticated, (req, res) => {
    const sqlText = `SELECT * FROM "session";`;
    pool.query(sqlText).then( (response) => {
        res.send( response.rows );
    }).catch( (error) => {
        console.log( 'Error getting all sessions', error );
        res.sendStatus( 500 );
    });
});

router.get(`/lessons/:session_id`, rejectUnauthenticated, (req, res) => {
    const sqlText = `SELECT "user"."first_name", "user"."last_name", "start_of_lesson", 
    ("start_of_lesson" + "length_of_lesson") AS "end_of_lesson", "length_of_lesson", "client",
     "slot"."id" AS "slot_id", "lesson_id", "expected_user", "skill"."title", EXTRACT (DOW FROM "day_of_week") AS "weekday" 
    FROM "session"
    LEFT JOIN "lesson" ON "session"."id" = "lesson"."session_id"
    LEFT JOIN "slot" ON "lesson"."id" = "slot"."lesson_id"
    JOIN "skill" ON "skill"."id" = "skill_needed"
    LEFT JOIN "user" ON "expected_user" = "user"."id"
    WHERE "session"."id" = $1
    ORDER BY "lesson_id"`;
    pool.query(sqlText, [req.params.session_id]).then( (response) => {
        res.send( response.rows );
    }).catch( (error) => {
        console.log( 'Error getting session slots', error );
        res.sendStatus( 500 );
    });
})

/**
 * POST route template
 */
router.post('/', rejectUnauthenticated, (req, res) => {

});

module.exports = router;