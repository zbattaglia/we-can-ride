const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');


/**
 * GET route template
 */
router.get('/', rejectUnauthenticated, (req, res) => {
    const sqlText = ``;

    pool.query( sqlText )
        .then( (response) => {
            res.send( response.rows );
        })
        .catch( (error) => {
            console.log( 'Error getting all shifts', error );
            res.sendStatus( 500 );
        })
});

/**
 * POST route template
 */
router.post('/', rejectUnauthenticated, (req, res) => {

});

module.exports = router;