const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const encryptLib = require('../modules/encryption');

// bring in module to decode web token
const createToken = require('../modules/createToken');
const decodeToken = require('../modules/decodeToken');
const sendEmailLink = require('../modules/linkEmailer');

/**
 * GET route for getting a user sent in a token and decoding
 */
router.get('/:id/:token', (req, res) => {
    // extract user id and web token from req.params
    const id = req.params.id;
    const token = req.params.token;
    // console.log( `Got reset password for user with id: ${id} and token ${token}`)

    // query database with id to get current hashed password to decode token
    const sqlText = `SELECT "user"."password" FROM "user" WHERE "user"."id" = $1;`;

    pool.query( sqlText, [ id ] )
        .then( (response) => {
            console.log( 'Valid user', response.rows );
            // pass token with returned hashed password to token module to be decoded
            const user = decodeToken( {token, key: response.rows[0].password, id } );
            // if token is decoded successfully return userId
            if( user ) {
                res.send( {userId: user} );
            }
            // else return nothing
            else {
                res.send( {userId: ''})
            }
        })
        .catch( (error) => {
            console.log( 'Error: User does not exist', error );
            res.sendStatus( 500 );
        });
});

/**
 * POST route for sending a reset password link
 */
router.post('/', (req, res) => {
    // get email from req.body
    const email = req.body.email;
    console.log( 'In POST route on password router', email );

    const sqlText = `SELECT "password", "user"."id", "first_name" FROM "user" WHERE "email" = $1;`;

    pool.query( sqlText, [ email ] )
        .then( (response) => {
            // create a new token with the user's id using the current hashed password as the encryption key
            console.log( 'Valid User', response.rows );
            const id = response.rows[0].id;
            const key = response.rows[0].password;
            const name = response.rows[0].first_name;
            const newToken = createToken( { id, key } );
            console.log( 'Got newToken back in router', newToken );
            // send new token to email module to send reset password link
            sendEmailLink( { email, name, id, newToken } );
        })
        .catch( (error) => {
            console.log( 'User does not exist', error )
        })
});

// PUT route to update passwords
router.put( '/:id', (req, res) => {
    // extract user id and new password from req.params and req.body
    const userId = req.params.id;
    const password = encryptLib.encryptPassword(req.body.password);
    console.log( `Updating password for user with id, ${userId}, to ${password} `)

    const sqlText = `UPDATE "user"
                    SET "password" = $1
                    WHERE "user"."id" = $2;`;
    pool.query( sqlText, [ password, userId ] )
        .then( (response) => {
            console.log( 'Successfully updated password' );
            res.sendStatus( 200 );
        })
        .catch( (error) => {
            console.log( 'Error updating password', error );
            res.sendStatus( 500 );
        })
})

module.exports = router;