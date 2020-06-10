const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');

const moment = require('moment');

// import emailer to be able to pass messages sent internally in the app by email
const sendEmail = require('../modules/emailer');

/**
 * GET route to return all messages for a specific user to display on their inbox
 */
router.get('/', rejectUnauthenticated, (req, res) => {
    console.log( `Getting messages for user with id ${req.user.id}`);
    const sqlText = `SELECT "message"."id", "user"."first_name", "user"."last_name", "message"."message", "message"."sent" FROM "message"
                    JOIN "user" ON "user"."id" = "message"."sender"
                    WHERE "message"."recipient" = $1
                    ORDER BY "message"."sent" DESC;`;

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
router.post('/', rejectUnauthenticated, (req, res) => {
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

    // requires two querires. One to get the id, email, and name of the user the response is being sent to, and the second to send the message
    const sqlTextOne = `SELECT "message"."sender", "user"."email", "user"."first_name", "user"."notification" FROM "message" 
                        JOIN "user" ON "message"."sender" = "user"."id"
                        WHERE "message"."id" = $1;`;
    const sqlTextTwo = `INSERT INTO "message" ("sender", "recipient", "message", "sent")
                    VALUES ($1, $2, $3, $4);`

    console.log( `User with id ${sender} Replying to message with id ${messageId} on server POST route with reply type ${replyType}` );

    pool.query( sqlTextOne, [ messageId ] )
        .then( (response) => {
            // this will return the id of the original sender who is now the recipient of the reply
            const recipient = response.rows[0].sender;
            const email = response.rows[0].email;
            const first_name = response.rows[0].first_name;
            const notification = response.rows[0].notification;
            pool.query( sqlTextTwo, [ sender, recipient, message, 'Now()' ] )
            .then( (response) => {
                // upon successfully sending message internally in app,
                // call sendEmail to send message in email if user has notifications on
                if( notification === true ) {
                    const emailInfo = { email, first_name, message };
                    sendEmail( emailInfo );
                }
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
router.delete('/:messageId', rejectUnauthenticated, (req, res) => {
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

// POST route to send message to request another user take's a shift
router.post('/request', rejectUnauthenticated, async (req, res) => {
    // extract paramaters from request
    const senderId = req.user.id;
    const email = req.body.email;
    const recipient = req.body.first_name + ' ' + req.body.last_name[0];
    const shiftId = req.body.shift.id;
    const date = moment(req.body.shift.date).format('dddd, MMMM Do, YYYY');
    const time = req.body.shift.time_to_arrive;
    const role = req.body.shift.role;

    const message = `Hi ${recipient}! Are you able to take my ${role} shift on ${date} at ${time}?`

    console.log( `${senderId} is sending message to ${recipient} at email ${email} for ${role} on ${date} at ${time} with id ${shiftId}` );
    console.log( message )
    
    // gets name of volunteer sending message
    const sqlTextOne = `SELECT "user"."first_name", "user"."last_name" FROM "user" WHERE "id" = $1;`;
    // gets id of user message is being sent to
    const sqlTextTwo = `SELECT "user"."id", "user"."notification" FROM "user" WHERE "email" = $1;`;
    // Inserts message into selected users "inbox on database"
    const sqlTextThree = `INSERT INTO "message" ("sender", "recipient", "message", "sent")
                            VALUES ($1, $2, $3, 'Now()');`;
    try {
        let response = await pool.query( sqlTextOne, [ senderId ] )
        const senderName = response.rows[0].first_name + ' ' + response.rows[0].last_name[0];
        console.log( 'request sent from', senderName );
        response = await pool.query( sqlTextTwo, [ email ] )
        const recipientId = response.rows[0].id;
        const notification = response.rows[0].notification;
        console.log( 'Recipient has id of', recipientId );
        await pool.query( sqlTextThree, [ senderId, recipientId, message ] );
        if( notification === true ) {
            await sendEmail( { email, first_name: req.body.first_name, message } );
        }
        res.sendStatus( 200 );
    }
    catch(error) {
        console.log( 'Error sending request to take shift message', error );
        res.sendStatus( 500 );
    }

})

module.exports = router;