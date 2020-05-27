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

router.get(`/slots/:session_id`, rejectUnauthenticated, (req, res) => {
    const sqlText = `SELECT * FROM "session"
    LEFT JOIN "lesson" ON "session"."id" = "lesson"."session_id"
    LEFT JOIN "slot" ON "lesson"."id" = "slot"."lesson_id"
    WHERE "session"."id" = $1;`;
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