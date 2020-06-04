const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const moment = require('moment');

/**
 * GET route template
 */
router.get(`/all`, rejectUnauthenticated, (req, res) => {
  console.log('getting all the sessions, the current user is', req.user);
  let sqlText = `SELECT * FROM "session" WHERE "let_volunteer_view" = TRUE ORDER BY "id" DESC;`;
  if(req.user.type_of_user === 'admin') sqlText = `SELECT * FROM "session" ORDER BY "id" DESC;`;
    pool.query(sqlText).then( (response) => {
        res.send( response.rows );
    }).catch( (error) => {
        console.log( 'Error getting all sessions', error );
        res.sendStatus( 500 );
    });
});

router.get(`/lessons/:session_id`, rejectUnauthenticated, (req, res) => {
    const sqlText = `SELECT "user"."first_name", "user"."last_name", "start_of_lesson", 
    ("start_of_lesson" + "length_of_lesson") AS "end_of_lesson", "length_of_lesson", "client",
     "slot"."id" AS "slot_id", "lesson_id", "expected_user", "skill"."title", EXTRACT (DOW FROM "day_of_week") AS "weekday" 
    FROM "session"
    LEFT JOIN "lesson" ON "session"."id" = "lesson"."session_id"
    LEFT JOIN "slot" ON "lesson"."id" = "slot"."lesson_id"
    JOIN "skill" ON "skill"."id" = "skill_needed"
    LEFT JOIN "user" ON "expected_user" = "user"."id"
    WHERE "session"."id" = $1
    ORDER BY "lesson_id";`;
    pool.query(sqlText, [req.params.session_id]).then( (response) => {
        res.send(response.rows );
    }).catch( (error) => {
        console.log( 'Error getting session slots', error );
        res.sendStatus( 500 );
    });
})

/**
 * POST route template
 */
router.post('/new', rejectUnauthenticated, (req, res) => {
  console.log(req.body.date, req.body.yearlong, req.body.length); //yearlong is a boolean
  let yearlong = 'session';
  if (req.body.yearlong === true){
    yearlong = 'yearlong'
  };
  let length = req.body.length + ' WEEKS';
  const sqlText = `INSERT INTO "session"
  ("start_date", "ready_to_publish", "session_type", "length_in_weeks") 
  VALUES( $1, FALSE, $2, $3) 
  RETURNING "id", "start_date", "ready_to_publish", "session_type", "length_in_weeks"
  ;
  `;
  pool.query(sqlText, [req.body.date, yearlong, length]).then( response => {
    console.log('response from database', response);
    res.sendStatus(200);
  }).catch( error => {
    console.log('error in adding session to database', error);
    res.sendStatus(500);
  });
});

router.put('/view', rejectUnauthenticated, (req, res) => {
  console.log('in server on session volunteer view', req.body);
  //req.body looks like { session_id: 13, let_volunteer_view: false }
  let sqlText = `UPDATE "session" 
  SET "let_volunteer_view"=$2 
  WHERE "id"=$1;
  `;
  pool.query(sqlText, [req.body.session_id, req.body.let_volunteer_view]).then(response => {
    res.sendStatus(200);
  }).catch(error => {
    console.log('error in changing if volunteer can view', error);
    res.sendStatus(500);
  });
});



router.put('/edit/:session_id', rejectUnauthenticated, async (req, res, next) => {
  console.log('in the publish session router', req.params.session_id);
  const connection = await pool.connect();
  const session_id = req.params.session_id;
  try{
    connection.query('BEGIN');
    const sessionQuery = `UPDATE "session" 
    SET "ready_to_publish"=TRUE, "let_volunteer_view"=FALSE WHERE "id"=$1 RETURNING "id", "start_date", "ready_to_publish", "session_type", "length_in_weeks", EXTRACT(DOW FROM "start_date") AS "weekday";
    `;
    const sessionResponse = await connection.query(sessionQuery, [session_id]);
  
    const sessionWeekday = sessionResponse.rows[0].weekday;
    const sessionStartDate = sessionResponse.rows[0].start_date.toLocaleDateString();
    const sessionLengthWeeks =(sessionResponse.rows[0].length_in_weeks.days)/7
    await console.log('sessionResponse', sessionResponse.rows[0], 'start', sessionStartDate, 'length', sessionLengthWeeks, 'weekday', sessionWeekday);


    //get the lessons
    const slotQuery = `SELECT *, EXTRACT(DOW FROM "day_of_week") AS "weekday" FROM "lesson" LEFT JOIN "slot" ON "slot"."lesson_id" = "lesson"."id" WHERE "session_id" = $1`;
    const slotResponse = await connection.query(slotQuery, [session_id]);
    await console.log(slotResponse.rows);
    //loop through the lesson response and for each lesson slot, create shifts based on how long the 
      //so this session starts on a weekday 4... so I should make 35/7 shifts, and I should do it starting
      //with the 

    for(let i=0; i<slotResponse.rows.length; i++){
    //for each slot, make some shifts
    console.log(slotResponse.rows[i].id);
      //decide how many days past the session start date to start making shifts
    let dayDifference = slotResponse.rows[i].weekday - sessionWeekday;
    if(dayDifference<0){dayDifference = dayDifference + 7}; 
      for(let j=0; j<sessionLengthWeeks; j++){
        //make a shift for each week of the session
        console.log('date to send', sessionStartDate, dayDifference, moment(`${sessionStartDate}`).add(`${dayDifference}`, 'day').format('L'));
        let dateToSend = moment(`${sessionStartDate}`).add(`${dayDifference}`, 'day').format('L');
        const addShiftQuery = `INSERT INTO "shift"("slot_id", "assigned_user", "date") 
        VALUES($1, $2, $3);`;
        await connection.query(addShiftQuery, [slotResponse.rows[i].id, slotResponse.rows[i].expected_user, dateToSend]);
        dayDifference = dayDifference + 7;
      }
    }
    await connection.query(`COMMIT`);
    res.sendStatus(200);
  }catch (error){
    console.log( `Error on create slots for lesson`, error)
    await connection.query(`ROLLBACK`);
    res.sendStatus(500);
  }finally{
    connection.release();
  }
  //TODO:  flip the session to ready to publihs
  //TODO make the shifts based on the session length
});

module.exports = router;