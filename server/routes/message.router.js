const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const tradeShiftEmail = require('../modules/adminEmailShiftToTrade');
// require moment for formatting dates in messages
const moment = require('moment');

// require emailer to be able to send messages sent internally in the app by email
const sendEmail = require('../modules/emailer');


 //GET route to return all messages for a specific user to display on their inbox

router.get('/', rejectUnauthenticated, (req, res) => {
    // query database to get all of the messages for current logged in user
    const sqlText = `SELECT "message"."id", "user"."first_name", "user"."last_name", "message"."message", "message"."sent" FROM "message"
                    JOIN "user" ON "user"."id" = "message"."sender"
                    WHERE "message"."recipient" = $1
                    ORDER BY "message"."sent" DESC;`;

    pool.query( sqlText, [ req.user.id ] )
        .then( (response) => {
            // return response.rows of query
            res.send( response.rows );
        })
        .catch( (error) => {
            // if there is an error, log to terminal
            console.log( 'Error getting messages from database', error );
            res.sendStatus( 500 );
        })
}); // end GET route


 // POST route to send a message

router.post('/', rejectUnauthenticated, (req, res) => {
    // Set default accept/reject messages for user's to send.
    // For privacy reasons users can not send custom emails / messages
    const acceptMessage = `I can take your shift. I will add myself to the schedule in the 
                            We Can Ride volunteer App.`;
    const rejectMessage = `Sorry I am not able to cover your We Can Ride volunteer shift on that day.`;
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
    const sqlTextOne = `SELECT "message"."sender", "user"."email", "user"."first_name", "message"."message", "user"."notification" FROM "message" 
                        JOIN "user" ON "message"."sender" = "user"."id"
                        WHERE "message"."id" = $1;`;
    const sqlTextTwo = `INSERT INTO "message" ("sender", "recipient", "message", "sent")
                    VALUES ($1, $2, $3, $4);`

    pool.query( sqlTextOne, [ messageId ] )
        .then( (response) => {
            // this will return the id of the original sender
            // who is now the recipient of the reply along with the original message (if there is one)
            const recipient = response.rows[0].sender;
            const email = response.rows[0].email;
            const first_name = response.rows[0].first_name;
            const originalMessage = response.rows[0].message;
            const notification = response.rows[0].notification;
            pool.query( sqlTextTwo, [ sender, recipient, message, 'Now()' ] )
            .then( (response) => {
                // upon successfully sending message internally in app,
                // call sendEmail to send message in email if user has notifications on
                if( notification === true ) {
                    const emailInfo = { email, first_name, message, originalMessage };
                    sendEmail( emailInfo );
                }
                res.sendStatus( 201 );
            })
            .catch( (error) => {
                // if any errors, log to terminal
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
    // set messageId to value passed in request parameter
    const messageId = req.params.messageId;

    // Set SQL text for querying database
    const sqlText = `DELETE FROM "message" WHERE "id" = $1;`;

    pool.query( sqlText, [ messageId ])
        .then( (response) => {
            res.sendStatus( 204 );
        })
        .catch( (error) => {
            // if there is an error deleting message, log on terminal
            console.log( 'Error deleting message from database', error );
            res.sendStatus( 504 );
        })
})

// POST route to send message to request another user take's a shift
router.post('/request', rejectUnauthenticated, async (req, res) => {
    // extract paramaters from request
    // senderId is database id of user sending request
    // email is address request is being sent to
    // recipient is name of user email is being sent to (first name and last initial only for security)
    // date is dat of shift (moment called for formatting)
    // time and role are specific to shift being traded
    const senderId = req.user.id;
    const email = req.body.email;
    const recipient = req.body.first_name + ' ' + req.body.last_name[0];
    const shiftId = req.body.shift.id;
    const date = moment(req.body.shift.date).format('dddd, MMMM Do, YYYY');
    const time = req.body.shift.time_to_arrive;
    const role = req.body.shift.role;
    // Create message to send to user
    const message = `Hi ${recipient}! Are you able to take my ${role} shift on ${date} at ${time}?`
    
    // gets name of volunteer sending message
    const sqlTextOne = `SELECT "user"."first_name", "user"."last_name" FROM "user" WHERE "id" = $1;`;
    // gets id of user message is being sent to
    const sqlTextTwo = `SELECT "user"."id", "user"."notification" FROM "user" WHERE "email" = $1;`;
    // Inserts message into selected users "inbox on database"
    const sqlTextThree = `INSERT INTO "message" ("sender", "recipient", "message", "sent")
                            VALUES ($1, $2, $3, 'Now()');`;
    try {
        // query database and set senderName to result
        let response = await pool.query( sqlTextOne, [ senderId ] )
        const senderName = response.rows[0].first_name + ' ' + response.rows[0].last_name[0];

        // query database and set recipient id based on result
        // notification is a boolean indicating if email notifications are turned on
        response = await pool.query( sqlTextTwo, [ email ] )
        const recipientId = response.rows[0].id;
        const notification = response.rows[0].notification;
        // Insert message into databse so it shows up in users in app inbox
        // if notifications are turned on pass message info to sendEmail module to email user
        await pool.query( sqlTextThree, [ senderId, recipientId, message ] );
        if( notification === true ) {
            await sendEmail( { email, first_name: req.body.first_name, message } );
        }
        res.sendStatus( 200 );
    }
    catch(error) {
        // if any errors occur in try, throw an error
        console.log( 'Error sending request to take shift message', error );
        res.sendStatus( 500 );
    }

})

// POST route to notify admin users when a shift is being given up
router.post('/trade', rejectUnauthenticated, async (req, res) => {
    // extract paramaters from request (first and last name of user giving up shift)
    const volunteer = `${req.user.first_name} ${req.user.last_name}`;

    // first query to get information of shift being given up
    // qury returns date, start_time, and skill of shift being given up
    const sqlTextOne = `SELECT "date", "start_of_lesson", "skill"."title" FROM "shift" 
                            JOIN "slot" ON "shift"."slot_id" = "slot"."id"
                            JOIN "lesson" ON "slot"."lesson_id" = "lesson"."id"
                            LEFT JOIN "skill" ON "skill_needed" = "skill"."id"
                            WHERE "shift"."id" = $1;`;

    // second query to get all of the admin users emails
    const sqlTextTwo = `SELECT "user"."email" FROM "user" WHERE "user"."type_of_user" = 'admin';`;

    try {
        // query database with first sqlTextOne and set variables based on values returned
        let response = await pool.query( sqlTextOne, [ req.body.shiftId ] )
        // moment is called to format date returned from database
        const date = moment(response.rows[0].date).format( 'MMMM Do, YYYY');
        const startTime = response.rows[0].start_of_lesson;
        const title = response.rows[0].title;
        // query database with sqlTextTwo and set the toList of emails with result
        response = await pool.query( sqlTextTwo )
        const toList = response.rows;
        // call tradeShiftEmail module to send email to all admin users with information of shift being given up
        tradeShiftEmail( { date, startTime, title, volunteer, toList } );
        res.sendStatus( 200 )
    }
    catch(error) {
        // if any of the queries failed throw an error
        console.log( 'Error alerting admin that shift is being given up', error );
        res.sendStatus( 500 );
    }
}); // end POST route

module.exports = router;