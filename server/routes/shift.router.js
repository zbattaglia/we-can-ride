const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');


//get all the slots that a user has signed up for. This is because if you sign up for a standard session
//but it hasn't been published yet, you won't have shifts associated with that signup, but you might still want 
//to know when you signed up for
router.get(`/myslots/:user_id`, rejectUnauthenticated, (req, res) => {
    //req.params is in the form { user_id: '8' }
    const sqlText = `SELECT "slot"."id" AS "slot_id", 
    "start_date" AS "session_start_date", "start_of_lesson", 
    ("start_of_lesson" + "length_of_lesson") AS "end_of_lesson", INITCAP(to_char("day_of_week", 'day')) AS "weekday", "length_in_weeks", "skill"."title" FROM "slot" 
    JOIN "lesson" ON "slot"."lesson_id" = "lesson"."id"
    JOIN "session" ON "lesson"."session_id" = "session"."id"
    JOIN "skill" ON "slot"."skill_needed" = "skill"."id"
    WHERE "slot"."expected_user" = $1 AND "start_date" >= NOW();`;
    pool.query(sqlText, [req.params.user_id]).then(response => {
        res.send(response.rows);
    }).catch(error => {
        console.log('error in getting my slots', error);
        res.sendStatus(500);
    });
})

//get all the shifts that a user has signed up for
router.get(`/myshift/:user_id`, rejectUnauthenticated, (req, res) => {
    // console.log( `Finding shifts for user with id ${req.user.id}`)
    const sqlText = `SELECT "shift"."id", "date", ("start_of_lesson" - INTERVAL '15 minutes') AS "time_to_arrive", 
    "title" AS "role" FROM "shift"
    JOIN "slot" ON "shift"."slot_id" = "slot"."id"
    JOIN "lesson" ON "slot"."lesson_id" = "lesson"."id"
    JOIN "skill" ON "skill_needed" = "skill"."id"
    WHERE "assigned_user" = $1
    ORDER BY "date" ASC;`;
    pool.query(sqlText, [Number(req.user.id)]).then((response) => {
        res.send(response.rows);
    }).catch((error) => {
        console.log('Error getting current users shifts', error);
        res.sendStatus(500);
    });
});

//get the next four weeks worth of shifts
router.get('/fourweeks', rejectUnauthenticated, (req, res) => {
    const sqlText = `SELECT EXTRACT(DOW FROM "date") AS "weekday", "shift"."id", "date", "start_of_lesson", ("start_of_lesson" + "length_of_lesson") AS "end_of_lesson", "skill"."title", "eu"."first_name" AS "expected_first_name", "au"."first_name" AS "assigned_first_name", LEFT("au"."last_name", 1) AS "assigned_user_last_initial", "expected_user", "assigned_user", "client" FROM "shift" 
    JOIN "slot" ON "shift"."slot_id" = "slot"."id"
    JOIN "lesson" ON "slot"."lesson_id" = "lesson"."id"
    LEFT JOIN "user" AS "eu" ON "expected_user" = "eu"."id"
    LEFT JOIN "user" AS "au" ON "assigned_user" = "au"."id"
    LEFT JOIN "skill" ON "skill_needed" = "skill"."id"
    WHERE "date" >= (current_date + cast(abs(extract(dow from current_date) - 6) - 7 as int)) AND "date" < DATE ((current_date + INTERVAL '4 weeks')::timestamp::date) + cast(abs(extract(dow from current_date)-6) - 7 as int)
    ORDER BY "date", "start_of_lesson";`;

    pool.query(sqlText)
        .then((response) => {
            res.send(response.rows);
        })
        .catch((error) => {
            console.log('Error getting fourweeks shifts', error);
            res.sendStatus(500);
        });
});

//get all the shifts
router.get(`/all`, rejectUnauthenticated, (req, res) => {
    const sqlText = `SELECT "shift"."id", "shift"."date", "user"."first_name", LEFT("user"."last_name", 1) AS "last_name", 
    "lesson"."start_of_lesson", "shift"."assigned_user", "shift"."user_wants_to_trade", "skill"."title" FROM "shift"
    LEFT JOIN "user" ON "shift"."assigned_user" = "user"."id"
    JOIN "slot" ON "shift"."slot_id" = "slot"."id"
    JOIN "lesson" ON "slot"."lesson_id" = "lesson"."id"
    JOIN "skill" ON "slot"."skill_needed" = "skill"."id"
    ORDER BY "shift"."date";`;
    pool.query(sqlText)
        .then((response) => {
            res.send(response.rows);
        })
        .catch((error) => {
            console.log('Error getting all shifts', error);
            res.sendStatus(500);
        });
});


// PUT route to update a shift when a volunteer is trying to give up
//this marks that shift as a shift that the volunteer would like to give up, so others can take it
router.put('/:shiftId', rejectUnauthenticated, (req, res) => {
    const shiftId = req.params.shiftId;
    // console.log( 'Got shiftId in server', shiftId );
    const sqlText = `UPDATE "shift"
                    SET "user_wants_to_trade" = $1
                    WHERE "shift"."id" = $2;`;

    pool.query(sqlText, [true, shiftId])
        .then((response) => {
            res.sendStatus(200);
        })
        .catch((error) => {
            console.log('Error updaing shift availability', error);
            res.sendStatus(500);
        })
});

// GET route to get all shifts with open shifts for sub
router.get('/sub', rejectUnauthenticated, async (req, res, next) => {
    // console.log( 'Getting sub shifts on server' );
    const connection = await pool.connect();
    try{
        connection.query('BEGIN');
        //here's where we find out this user's roles and then get the shifts they can sub for
        //this query will get the skills this user is qualified for
        const getUserRolesQuery =`SELECT "skill_id" FROM "user_skill"
        WHERE "user_id" = $1;`;
        const userSkills = await connection.query(getUserRolesQuery, [req.user.id]);
        //loop through the skills to make a string for the query
        const skillList = userSkills.rows;
        let skillString = '';

        //make a list of the skills to get
        for(let i=0; i < skillList.length; i++){
            if(i === 0){
                skillString = skillString + '"skill"."id" = ' + skillList[i].skill_id;
            } else{
                skillString = skillString + ' OR ' + '"skill"."id" = ' + skillList[i].skill_id;
            }
        }

 
        const sqlText = `SELECT "shift"."id", "date", "start_of_lesson", ("start_of_lesson" + "length_of_lesson") AS "end_of_lesson", "skill"."title", "eu"."first_name" AS "expected_first_name", "au"."first_name" AS "assigned_first_name", LEFT("au"."last_name", 1) AS "assigned_user_last_initial", "expected_user", "assigned_user", "client" FROM "shift" 
        JOIN "slot" ON "shift"."slot_id" = "slot"."id"
        JOIN "lesson" ON "slot"."lesson_id" = "lesson"."id"
        LEFT JOIN "user" AS "eu" ON "expected_user" = "eu"."id"
        LEFT JOIN "user" AS "au" ON "assigned_user" = "au"."id"
        LEFT JOIN "skill" ON "skill_needed" = "skill"."id"
        WHERE ("assigned_user" IS NULL OR "user_wants_to_trade" IS TRUE)
        AND (${skillString})
        ORDER BY "date";`;
        const response = await connection.query(sqlText);
        await connection.query(`COMMIT`);
        res.send(response.rows);
    }
    catch (error){
        console.log( "Error getting sub shifts", error);
        await connection.query(`ROLLBACK`);
        res.sendStatus(500);
      }finally{
        connection.release();
      }



});

// PUT route to update sub table when volunteer takes an open shift
router.put('/sub/shift', rejectUnauthenticated, (req, res) => {
    const userId = req.user.id;
    const shiftId = req.body.shiftId;
    //console.log(`Adding user with id ${userId} to shift with id ${shiftId}`);

    // query to update userId on shift table at appropriate shift id, reset user wants to trade since this has been picked up
    const sqlText = `UPDATE "shift" SET "assigned_user" = $1, "user_wants_to_trade" = FALSE
                    WHERE "shift"."id" = $2;`;

    pool.query(sqlText, [userId, shiftId])
        .then((response) => {
            res.sendStatus(200);
        })
        .catch((error) => {
            console.log('Error adding user to shift table', error);
            res.sendStatus(500);
        });
}); //end PUT route


//this is so that the admin can change who is assigned to a shift from the calendar, by picking a user to
//assign
router.put('/update/volunteer',rejectUnauthenticated, (req, res) => {
    const queryText = `UPDATE "shift" SET "assigned_user" = $1, "user_wants_to_trade" = FALSE WHERE "id" = $2;`;
    const queryValues = [req.body.selectUser, req.body.eventId];
    pool.query(queryText, queryValues)
        .then(() => { res.sendStatus(204); })
        .catch((error) => {
            console.log('Error in router.put.', error);
            res.sendStatus(500);
        })
});

module.exports = router;
