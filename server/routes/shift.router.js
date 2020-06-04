const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');


/**
 * GET route template
 */
router.get(`/myshift/:user_id`, rejectUnauthenticated, (req, res) => {
    // console.log( `Finding shifts for user with id ${req.user.id}`)
    const sqlText = `SELECT "shift"."id", "date", ("start_of_lesson" - INTERVAL '15 minutes') AS "time_to_arrive", 
    "title" AS "role" FROM "shift"
    JOIN "slot" ON "shift"."slot_id" = "slot"."id"
    JOIN "lesson" ON "slot"."lesson_id" = "lesson"."id"
    JOIN "skill" ON "skill_needed" = "skill"."id"
    WHERE "assigned_user" = $1
    ORDER BY "date" ASC;`;
    pool.query(sqlText, [Number( req.user.id )]).then( (response) => {
        res.send( response.rows );
    }).catch( (error) => {
        console.log( 'Error getting current users shifts', error );
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
            console.log( 'Error getting fourweeks shifts', error );
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

// PUT route to update a shift when a volunteer is trying to give up
router.put( '/:shiftId', (req, res) => {
    const shiftId = req.params.shiftId;
    // console.log( 'Got shiftId in server', shiftId );
    const sqlText = `UPDATE "shift"
                    SET "user_wants_to_trade" = $1
                    WHERE "shift"."id" = $2;`;

    pool.query( sqlText, [ true, shiftId ] )
        .then( (response) => {
            console.log( 'Successfully updated shift availability' );
            res.sendStatus( 200 );
        })
        .catch( (error) => {
            console.log( 'Error updaing shift availability', error );
            res.sendStatus( 500 );
        })
})

// GET route to get all shifts with open shifts for sub
router.get( '/sub', (req, res) => {
    // console.log( 'Getting sub shifts on server' );

    const sqlText = `SELECT "shift"."id", "date", "start_of_lesson", ("start_of_lesson" + "length_of_lesson") AS "end_of_lesson", "skill"."title", "eu"."first_name" AS "expected_first_name", "au"."first_name" AS "assigned_first_name", LEFT("au"."last_name", 1) AS "assigned_user_last_initial", "expected_user", "assigned_user", "client" FROM "shift" 
                    JOIN "slot" ON "shift"."slot_id" = "slot"."id"
                    JOIN "lesson" ON "slot"."lesson_id" = "lesson"."id"
                    LEFT JOIN "user" AS "eu" ON "expected_user" = "eu"."id"
                    LEFT JOIN "user" AS "au" ON "assigned_user" = "au"."id"
                    LEFT JOIN "skill" ON "skill_needed" = "skill"."id"
                    WHERE "assigned_user" IS NULL OR "user_wants_to_trade" IS TRUE
                    ORDER BY "date";`

    pool.query( sqlText )
        .then( (response) => {
            // console.log( 'Got sub shifts on server', response.rows );
            res.send( response.rows );
        })
        .catch( (error) => {
            console.log( "Error getting sub shifts", error );
            res.sendStatus( error );
        })
});

// PUT route to update sub table when volunteer takes an open shift
router.put( '/sub/shift', rejectUnauthenticated, (req, res) => {
    const userId = req.user.id;
    const shiftId = req.body.shiftId;
    console.log( `Adding user with id ${userId} to shift with id ${shiftId}` );

    // query to update userId on shift table at appropriate shift id, reset user wants to trade since this has been picked up
    const sqlText = `UPDATE "shift" SET "assigned_user" = $1, "user_wants_to_trade" = FALSE
                    WHERE "shift"."id" = $2;`;

    pool.query( sqlText, [ userId, shiftId ] )
        .then( (response) => {
            console.log( 'Successfully added user to shift table' );
            res.sendStatus( 200 );
        })
        .catch( (error) => {
            console.log( 'Error adding user to shift table', error );
            res.sendStatus( 500 );
        });
}); //end PUT route

module.exports = router;