const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

/**
 * GET route to return all messages for a specific user to display on their inbox
 */
router.get('/', (req, res) => {
    console.log( `Getting messages for user with id ${req.user.id}`);
    const sqlText = `SELECT "message"."id", "user"."first_name", "user"."last_name", "message"."message" FROM "message"
                    JOIN "user" ON "user"."id" = "message"."sender"
                    WHERE "message"."recipient" = $1;`;

    pool.query( sqlText, [ req.user.id ] )
        .then( (response) => {
            console.log( `Got messages from database`, response.rows );
            res.send( response.rows );
        })
        .catch( (error) => {
            console.log( 'Error getting messages from database', error );
            res.sendStatus( 500 );
        })
});

/**
 * POST route template
 */
router.post('/', (req, res) => {

});

module.exports = router;