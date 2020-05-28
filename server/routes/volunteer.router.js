const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');


/**
 * GET route template
 */
router.get('/', rejectUnauthenticated, (req, res) => {
    const sqlText = `SELECT "id", "type_of_user", "email", "birthday", "phone", "first_name", "last_name" FROM "user";`;

    pool.query( sqlText )
        .then( (response) => {
            res.send( response.rows );
        })
        .catch( (error) => {
            console.log( 'Error getting all volunteers', error );
            res.sendStatus( 500 );
        })
});

//GET route for specific volunteers information
router.get('/select/:volunteerId', rejectUnauthenticated, (req, res) => {
    // console.log( `Getting selected user on server with id ${req.params.volunteerId}`)
    // get volunteerId from req.params
    const volunteerId = req.params.volunteerId;
    // sqlText to return ALL information besides password stored on database for specific user
    const sqlText = `SELECT "user"."id", "user"."email", "user"."birthday", "user"."phone", "user"."first_name", "user"."last_name", ARRAY_AGG(DISTINCT "skill"."title") AS "skill", ARRAY_AGG(DISTINCT "availability"."time_available") AS "availability" FROM "user"
                    FULL JOIN "user_availability" ON "user_availability"."user_id" = "user"."id"
                    FULL JOIN "user_skill" ON "user_skill"."user_id" = "user"."id"
                    FULL JOIN "skill" ON "skill"."id" = "user_skill"."skill_id"
                    FULL JOIN "availability" ON "user_availability"."availability_id" = "availability"."id"
                    WHERE "user"."id" = $1
                    GROUP BY "user"."id";`;

    pool.query( sqlText, [ volunteerId ] )
        .then( (response) => {
            // console.log( `Got selected user from databse`, response.rows );
            res.send( response.rows[0] );
        })
        .catch( (error) => {
            console.log( 'Error getting selected volunteers information from database', error );
            res.sendStatus( 500 );
        })
})

/**
 * POST route template
 */
router.post('/', rejectUnauthenticated, (req, res) => {

});

module.exports = router;