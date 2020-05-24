const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

/**
 * GET route template
 */
router.get('/', (req, res) => {
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

/**
 * POST route template
 */
router.post('/', (req, res) => {

});

module.exports = router;