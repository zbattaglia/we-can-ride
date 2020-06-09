
const express = require('express');
require('dotenv').config();
const pool = require('./modules/pool');
const router = express.Router();

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

    // query to insert message into database to display in inbox
    // const sqlTextThree = `INSERT INTO "message" ("message"."recipient", "message"."message", "message"."sent")
    //                       VALUES($1, $2, NOW());`;

    try {
      // query the database
      const responseOne = await pool.query( sqlTextOne );
      // console.log( 'Got upcoming open shifts:', responseOne.rows )
      const responseTwo = await pool.query( sqlTextTwo );
      // console.log( 'Got all admin users emails', responseTwo.rows )

      // const message = await upcomingReminder( { shifts: responseOne.rows, admins: responseTwo.rows } );

      // console.log( 'Got a message:', message );
      // // for (admin of responseTwo.rows ) {
      // //   await pool.query( sqlTextThree, [ Number(admin.id), message[0] ])
      // //   console.log( 'successfully sent message' );
      // // }
    }
    catch( error ) {
      console.log( 'Error getting upcoming open shifts', error );
    }
});

// will execute every sunday at midnight
cron.schedule( '0 0 0 * * 0', async () => {

  // query to get all users info that are not disabled
  const sqlTextOne = `SELECT "user"."id", "user"."first_name", "user"."email" 
                     FROM "user" WHERE "user"."disable" = FALSE ORDER BY "user"."id";`;

  // query to get all of a users (from query one) shifts in the next week
  const sqlTextTwo = `SELECT "date", ("start_of_lesson" - INTERVAL '15 minutes') AS "time_to_arrive", "title" AS "role" FROM "shift"
                      JOIN "slot" ON "shift"."slot_id" = "slot"."id"
                      JOIN "lesson" ON "slot"."lesson_id" = "lesson"."id"
                      JOIN "skill" ON "skill_needed" = "skill"."id"
                      WHERE "assigned_user" = $1
                      AND "date" BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '10 DAYS');`;
                     
  try {
    const responseOne = await pool.query( sqlTextOne)
    console.log( 'Got all enabled users', responseOne.rows );
    const enabledUsers = responseOne.rows;
    for ( user of enabledUsers ) {
      const responseTwo = await pool.query( sqlTextTwo, [ user.id ] )
      if( responseTwo.rows[0] !== undefined ) {
        await weeklyReminder( { firstName: user.first_name, email: user.email, upcomingShift: responseTwo.rows } );
      }
    }
  }
  catch(error) {
    console.log( 'Error sending users weekly reminder', error );
  }
  // console.log( 'Getting all users')
  // pool.query( sqlTxtOne )
  //   .then( (response) => {
  //     console.log( 'Got all endabled users', response.rows );
  //   })
  //   .catch( (error) => {
  //     console.log( 'Error getting endabled users', error );
  //   })

});

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
