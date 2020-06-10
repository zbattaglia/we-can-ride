
const express = require('express');
require('dotenv').config();
const pool = require('./modules/pool');

const app = express();
const bodyParser = require('body-parser');
const sessionMiddleware = require('./modules/session-middleware');

const upcomingReminder = require( './modules/upcomingShiftReminder' );
const weeklyReminder = require('./modules/weeklyReminder');

const passport = require('./strategies/user.strategy');
// node-cron required to schedule automated 
const cron = require( 'node-cron' );

// will execute every day at midnight (0 0 0 * * *)
cron.schedule( '0 0 0 * * *', async () => {
  // sql query to return all shifts in the next three days that are unassigned or up for trade
    const sqlTextOne = `SELECT "date", ("start_of_lesson" - INTERVAL '15 minutes') AS "time_to_arrive", 
                    "title" AS "role" FROM "shift"
                    FULL OUTER JOIN "slot" ON "shift"."slot_id" = "slot"."id"
                    FULL OUTER JOIN "lesson" ON "slot"."lesson_id" = "lesson"."id"
                    FULL OUTER JOIN "skill" ON "skill_needed" = "skill"."id"
                    WHERE ("assigned_user" IS NULL OR "shift"."user_wants_to_trade" IS TRUE)
                    AND "date" BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '3 DAYS')
                    ORDER BY "date";`;

    // query to get all admin users emails
    const sqlTextTwo = `SELECT "user"."id", "user"."email" FROM "user" WHERE "user"."type_of_user" = 'admin';`;

    try {
      // query the database
      const responseOne = await pool.query( sqlTextOne );
      const responseTwo = await pool.query( sqlTextTwo );
      // call upcomingReminder module and pass in all open shifts from queryOne, and all admin Emails from queryTwo
      await upcomingReminder( { shifts: responseOne.rows, admins: responseTwo.rows } );

    }
    catch( error ) {
      // if there are any errors in the try, log to the terminal
      console.log( 'Error getting upcoming open shifts', error );
    }
}); // end upcoming shifts reminder

// will execute every sunday at midnight
cron.schedule( '0 0 0 * * 0', async () => {

  // query to get all users info that are not disabled and have notifications on
  const sqlTextOne = `SELECT "user"."id", "user"."first_name", "user"."email", "user"."notification"
                     FROM "user" WHERE "user"."disable" = FALSE ORDER BY "user"."id";`;

  // query to get all of a users (from query one) shifts in the next week
  const sqlTextTwo = `SELECT "date", ("start_of_lesson" - INTERVAL '15 minutes') AS "time_to_arrive", "title" AS "role" FROM "shift"
                      JOIN "slot" ON "shift"."slot_id" = "slot"."id"
                      JOIN "lesson" ON "slot"."lesson_id" = "lesson"."id"
                      JOIN "skill" ON "skill_needed" = "skill"."id"
                      WHERE "assigned_user" = $1
                      AND "date" BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '10 DAYS');`;
                     
  try {
    // query database with sqlTextOne, set enabled users to the response
    const responseOne = await pool.query( sqlTextOne)
    const enabledUsers = responseOne.rows;
    // loop over enabled users and query database to determine if they have shifts in the next week
    for ( user of enabledUsers ) {
      // only send weekly reminder if user has notifcations enabled
      if( user.notification ) {
        const responseTwo = await pool.query( sqlTextTwo, [ user.id ] )
        // if they do have shifts coming (not undefined) call weekly reminder module to send email with information from queries
        if( responseTwo.rows[0] !== undefined ) {
          await weeklyReminder( { firstName: user.first_name, email: user.email, upcomingShift: responseTwo.rows } );
        }
      }
    }
  }
  catch(error) {
    // if any errors in try, log to terminal
    console.log( 'Error sending users weekly reminder', error );
  }
}); // end weekly shift reminder

// Route includes
const userRouter = require('./routes/user.router');
const volunteerRouter = require('./routes/volunteer.router');
const shiftRouter = require('./routes/shift.router');
const sessionRouter = require('./routes/session.router');
const messageRouter = require('./routes/message.router');
const disableRouter = require('./routes/disable.router');
const activateRouter = require('./routes/activate.router');
const lessonRouter = require('./routes/lesson.router');
const passwordRouter = require('./routes/password.router');
const rolesRouter = require('./routes/roles.router');



// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Passport Session Configuration //
app.use(sessionMiddleware);

// start up passport sessions
app.use(passport.initialize());
app.use(passport.session());

/* Routes */
app.use('/api/user', userRouter);
app.use('/volunteer', volunteerRouter);
app.use('/shift', shiftRouter);
app.use('/session', sessionRouter);
app.use('/message', messageRouter);
app.use('/disable', disableRouter);
app.use('/activate', activateRouter);
app.use('/lesson', lessonRouter);
app.use('/resetPassword', passwordRouter);
app.use('/roles', rolesRouter);


// Serve static files
app.use(express.static('build'));

// App Set //
const PORT = process.env.PORT || 5000;

/** Listen * */
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
