const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');


//Get all the sessions, with the most recently created ones first
router.get(`/all`, rejectUnauthenticated, (req, res) => {
    const sqlText = `SELECT * FROM "session" ORDER BY "id" DESC;`;
    pool.query(sqlText).then( (response) => {
        res.send( response.rows );
    }).catch( (error) => {
        console.log( 'Error getting all sessions', error );
        res.sendStatus( 500 );
    });
});

// GET all the possible volunteer roles, which are stored in the skill table
router.get(`/roles`, rejectUnauthenticated, (req, res) => {
  const queryText = `SELECT * FROM "skill";`;
  pool.query(queryText).then(response => {
    res.send(response.rows);
  }).catch(error => {
    console.log('error in getting the roles', error);
    res.sendStatus(500);
  });
 
});

//Add a new job to a particular lesson, such as adding another sidewalker
router.post(`/roles`, rejectUnauthenticated, (req, res) => {
  //req.body looks like {lesson_id: 35, session_id: 6, skill_id: 1}
  const sqlText = `INSERT INTO "slot"("lesson_id", "skill_needed") 
  VALUES($1, $2);
  `;
  pool.query(sqlText, [req.body.lesson_id, req.body.skill_id]).then(response =>{
    console.log('inserted a new slot', response);
    res.sendStatus(200)
  }).catch( error => {
    console.log('error in inserting a slot into a lesson', error)
    res.sendStatus(500);
  });
});

//get all the lessons for the selected session, with the start times and end times of each lesson
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
    ORDER BY "lesson_id", "slot_id"`;
    pool.query(sqlText, [req.params.session_id]).then( (response) => {
        res.send(response.rows );
    }).catch( (error) => {
        console.log( 'Error getting session slots', error );
        res.sendStatus( 500 );
    });
})

//create a lesson for a particular session. When creating a lesson, it automatically creates a leader and two side
//walker positions for each lesson created, which can be deleted later or filled with a volunteer
router.post('/create', rejectUnauthenticated, async (req, res, next) => {
  const connection = await pool.connect();
  const session_id = req.body.session_id;
  try {
    await connection.query(`BEGIN`);
    const createLessonQuery = `INSERT INTO "lesson"
    ("session_id", "start_of_lesson", "day_of_week", "client", "length_of_lesson") 
    VALUES($1, $2, $3, $4, $5) 
    RETURNING "lesson"."id" AS "lesson_id";`;
    const createSlotQuery = `INSERT INTO "slot"("lesson_id", "skill_needed") 
    VALUES($1, 1), ($1, 1), ($1, 2);`;
    const lesson_id = await connection.query(createLessonQuery, 
      [req.body.session_id, req.body.start_time, req.body.day, req.body.client, `${req.body.duration} minutes`] );
    const response = await connection.query(createSlotQuery, [lesson_id.rows[0].lesson_id]);
    await connection.query(`COMMIT`);
    res.send({session_id});
  } catch (error){
    console.log( `Error on create slots for lesson`, error)
    await connection.query(`ROLLBACK`);
    res.sendStatus(500);
  } finally {
    connection.release();
  };
});

//delete a job for a particular lesson, such as if the client doesn't need two sidewalkers.
//the code shouldn't have let anyone delete one of these if it has been published, but the 
//delete statements here are to make sure that there aren't any shifts for that job for that lesson
  router.delete('/slot', rejectUnauthenticated, async (req, res, next) => {
    const connection = await pool.connect();
    try {
      await connection.query(`BEGIN;`);
      const getShiftsQuery = `SELECT "shift"."id" AS "shift_id" FROM "slot"
      LEFT JOIN "shift" ON "shift"."slot_id" = "slot"."id"
      WHERE "slot_id" = $1;`;
      const shiftsToDelete = await connection.query(getShiftsQuery, [req.body.slot_id]);
      //delete the shifts so the slot can be deleted
      const deleteShiftsQuery = `DELETE FROM "shift" WHERE "id" = $1;`;
      for(i=0; i<shiftsToDelete.rows.length; i++){
        console.log('deleting shift', shiftsToDelete.rows[i].shift_id);
        await connection.query(deleteShiftsQuery, [shiftsToDelete.rows[i].shift_id]);
      }
      // delete the slots
      const deleteSlotsQuery = `DELETE FROM "slot" WHERE "id" = $1;`;
      await connection.query(deleteSlotsQuery, [req.body.slot_id]);
      await connection.query(`COMMIT;`);
      res.sendStatus(200);

    } catch (error) { 
      console.log('error in deleting that role', error);
      await connection.query(`ROLLBACK`);
      res.sendStatus(500);
    } finally {
      connection.release();
    }
  });

// assign a volunteer to a particular job for a lesson in a session
router.post('/assign', rejectUnauthenticated, async (req, res, next) => {
  const connection = await pool.connect();
  let volunteer_id = req.body.volunteer_id;
  if(volunteer_id === ""){volunteer_id = null};
  const slot_id = req.body.slot_id
  try {
    await connection.query(`BEGIN`);
    const assignVolunteerQuery = `UPDATE "slot" SET "expected_user"=$2 WHERE "id"=$1;
    `;
    await connection.query(assignVolunteerQuery, [slot_id, volunteer_id]);
    await connection.query(`COMMIT`);
    res.sendStatus(200);
  } catch (error){
    console.log( `Error on assign volunteer`, error)
    await connection.query(`ROLLBACK`);
    res.sendStatus(500);
  } finally {
    connection.release();
  };
});

//delete a lesson. this includes deleting any shifts associated with the lesson, 
//as well as any slots, which makes sure that the lesson will actually be deleted
//the user shouldn't be able to delete a lesson for an already published session though, 
//it's just to make sure that there won't be errors
router.delete('/lesson', rejectUnauthenticated, async (req, res, next) => {
  const connection = await pool.connect();

  try {
  await connection.query(`BEGIN`);
    const getShiftsQuery = `SELECT "lesson"."id" AS "lesson_id", "slot"."id" AS "slot_id", "shift"."id" AS "shift_id" FROM "lesson"
    LEFT JOIN "slot" ON "slot"."lesson_id" = "lesson"."id"
    LEFT JOIN "shift" ON "shift"."slot_id" = "slot"."id"
    WHERE "lesson_id" = $1
    ORDER BY "slot"."id"
    ;`;
    const shiftsToDelete = await connection.query(getShiftsQuery, [req.body.lesson_id]);
    const deleteShiftsQuery = `DELETE FROM "shift" WHERE "id"=$1;`;
    //delete each shift
    for(i=0; i<shiftsToDelete.rows.length; i++){
      console.log('deleting shift', shiftsToDelete.rows[i].shift_id);
      await connection.query(deleteShiftsQuery, [shiftsToDelete.rows[i].shift_id]);
    }
    const getSlotsQuery = `SELECT "lesson"."id" AS "lesson_id",
      "slot"."id" AS "slot_id" FROM "lesson"
    LEFT JOIN "slot" ON "slot"."lesson_id" = "lesson"."id"
    WHERE "lesson_id" = $1
    ORDER BY "slot"."id"
    ;`;
    const slotsToDelete = await connection.query(getSlotsQuery, [req.body.lesson_id]);
    const deleteSlotsQuery = `DELETE FROM "slot" WHERE "id"=$1;`;
    // get slots from shiftsToDelete
    // delete the slots
    for(i=0; i<slotsToDelete.rows.length; i++){
      console.log('deleting slot', slotsToDelete[i]);
      await connection.query(deleteSlotsQuery, [slotsToDelete.rows[i].slot_id]);
    }
  //delete the lesson
    const deleteLessonQuery = `DELETE FROM "lesson" WHERE "id"=$1 RETURNING "id";`;
    await connection.query(deleteLessonQuery, [req.body.lesson_id]);
    await connection.query(`COMMIT`);
    res.sendStatus(200);


  } catch (error) {
  console.log('error in deleting lesson', error);
  await connection.query(`ROLLBACK`);
  res.sendStatus(500);
  } finally {
  connection.release();
  };
})
module.exports = router;