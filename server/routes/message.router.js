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
 * POST route to send a message
 */
router.post('/', (req, res) => {
    // Set default accept/reject messages for user's to send.
    const acceptMessage = `I can take your shift!`;
    const rejectMessage = `Sorry I can't take your shift on that day`;
    // get response type and message id from req.body, get current user id
    const messageId = req.body.id;
    const replyType = req.body.type;
    const sender = req.user.id;
    let message;
    // set the message to either the accept of reject message based on reply type.
    if( replyType === 'accept' ) {
        message = acceptMessage;
    }
    else {
        message = rejectMessage;
    }

    // requires two querires. One to get the id of the user the response is being sent to, and the second to send the message
    const sqlTextOne = `SELECT "message"."sender" FROM "message" WHERE "message"."id" = $1;`;
    const sqlTextTwo = `INSERT INTO "message" ("sender", "recipient", "message")
                    VALUES ($1, $2, $3);`

    console.log( `User with id ${sender} Replying to message with id ${messageId} on server POST route with reply type ${replyType}` );

    pool.query( sqlTextOne, [ messageId ] )
        .then( (response) => {
            // this will return the id of the original sender who is now the recipient of the reply
            const recipient = response.rows[0].sender;
            pool.query( sqlTextTwo, [ sender, recipient, message ] )
            .then( (response) => {
                console.log( 'Sent reply' );
                res.sendStatus( 201 );
            })
            .catch( (error) => {
                console.log( 'Error sending reply', error );
                res.sendStatus( 501 );
            })
        })
        .catch( (error) => {
            console.log( 'Error getting recipient Id from database', error );
        })
});

// DELETE route to delete message from database
router.delete('/:messageId', (req, res) => {
    console.log( `Got delete message on server for message with id ${req.params.messageId}`)
    // set messageId to value passed in request parameter
    const messageId = req.params.messageId;

    // Set SQL text for querying database
    const sqlText = `DELETE FROM "message" WHERE "id" = $1;`;

    pool.query( sqlText, [ messageId ])
        .then( (response) => {
            console.log( 'Deleted message from database' );
            res.sendStatus( 204 );
        })
        .catch( (error) => {
            console.log( 'Error deleting message from database', error );
            res.sendStatus( 504 );
        })
})

module.exports = router;