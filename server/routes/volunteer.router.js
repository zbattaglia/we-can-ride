const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');


//Get route to get the information about all volunteers, including the total number of hours their name is signed up for
//that have happened already
router.get('/volunteer', rejectUnauthenticated, (req, res) => {
    const sqlText = `
    SELECT "user"."id", "type_of_user", "email", "birthday", "phone", 
                    "first_name", "last_name", "total_hours", "disable", "user"."notification" FROM "user" LEFT JOIN (SELECT "user"."id", SUM("length_of_lesson") AS "total_hours" FROM "user" 
                    LEFT JOIN "shift" ON "shift"."assigned_user" = "user"."id"
                    JOIN "slot" ON "shift"."slot_id" = "slot"."id"
                    JOIN "lesson" ON "lesson"."id" = "slot"."lesson_id"
                    WHERE "date" < NOW()
                    GROUP BY "user"."id") AS "hours" ON "hours"."id" = "user"."id"
                    ORDER BY "last_name", "first_name", "user"."id"
                    ; `;

    pool.query( sqlText )
        .then( (response) => {
            res.send( response.rows );
        })
        .catch( (error) => {
            console.log( 'Error getting all volunteers', error );
            res.sendStatus( 500 );
        })
});

//GET route for specific volunteers information
router.get('/select/:volunteerId', rejectUnauthenticated, (req, res) => {
    // console.log( `Getting selected user on server with id ${req.params.volunteerId}`)
    // get volunteerId from req.params
    const volunteerId = req.params.volunteerId;
    // sqlText to return ALL information besides password stored on database for specific user
    const sqlText = `SELECT "user"."id", "user"."email", "user"."birthday", "user"."phone", "user"."first_name", "user"."last_name", "user"."notification", "user"."type_of_user", ARRAY_AGG(DISTINCT "skill"."title") AS "skill", ARRAY_AGG(DISTINCT "availability"."time_available") AS "availability" FROM "user"
                    FULL JOIN "user_availability" ON "user_availability"."user_id" = "user"."id"
                    FULL JOIN "user_skill" ON "user_skill"."user_id" = "user"."id"
                    FULL JOIN "skill" ON "skill"."id" = "user_skill"."skill_id"
                    FULL JOIN "availability" ON "user_availability"."availability_id" = "availability"."id"
                    WHERE "user"."id" = $1
                    GROUP BY "user"."id";`;

    pool.query( sqlText, [ volunteerId ] )
        .then( (response) => {
            // console.log( `Got selected user from databse`, response.rows );
            res.send( response.rows[0] );
        })
        .catch( (error) => {
            console.log( 'Error getting selected volunteers information from database', error );
            res.sendStatus( 500 );
        })
})

// PUT route to update a slected user's information
router.put( '/:selectedId', rejectUnauthenticated, async(req, res) => {
    // Get information from req.params and body
    const id = req.params.selectedId;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const phone = req.body.phone;
    const email = req.body.email;
    let birthday = req.body.birthday;
    if (birthday === 'Invalid date'){birthday = null}; //this is just to prevent errors due to blank birthdays
    const availability_skills = [];
    let type_of_user = req.body.type_of_user;
    if( type_of_user === false ) {
        type_of_user = 'volunteer';
    }
    else {
        type_of_user = 'admin';
    }

    // loop over the req.body and create an array of avalabilities and skills to insert in database.
    for ( let availability_skill in req.body ) {
        if( req.body[ availability_skill ] === true ) {
            availability_skills.push( availability_skill );
        };
    };

    console.log( 'Type of user on server =', type_of_user )
    // console.log( `Updating user with id ${req.params.selectedId}`, id, first_name, last_name, phone, email, birthday );
    // console.log( 'Updating selected user`s skills and availabilities on server ', req.body, availability_skills );


    const connection = await pool.connect();

    try {
        await connection.query('BEGIN;');
        // the first query updates all of the user information stored in the user table
        const sqlTextOne = `UPDATE "user" 
                            SET "first_name" = $1, "last_name" = $2, "phone" = $3, "email" = $4, "birthday" = $5, "notification" = $6, "type_of_user" = $7
                            WHERE "user"."id" = $8;`;
        // second query deletes all the selected users availability
        const sqlTextTwo = `DELETE FROM "user_availability" WHERE "user_availability"."user_id" = $1;`
        // third query gets id of specific availability to insert into user_availability table
        const sqlTextThree = `SELECT "id" FROM "availability" WHERE "availability"."time_available" = $1;`;
        // fourth query inserts user.id and availability id from third query into user_availability
        const sqlTextFour = `INSERT INTO "user_availability" ("user_id", "availability_id") VALUES ($1, $2);`;
        // fifth query gets id of specific skill to insert into user_skill table
        const sqlTextFive = `SELECT "id" FROM "skill" WHERE "skill"."title" = $1;`;
        // sixth query inserts user.id and skill.id from fifth query into user_skill
        const sqlTextSix = `INSERT INTO "user_skill" ("user_id", "skill_id") VALUES ($1, $2);`;
        // seventh sequel text deletes all current user_skill (comes after second sqlText)
        const sqlTextSeven = `DELETE FROM "user_skill" WHERE "user_skill"."user_id" = $1;`

        // run SQL transaction's
        await connection.query( sqlTextOne, [ first_name, last_name, phone, email, birthday, req.body.notification, type_of_user, id ] );
        await connection.query( sqlTextTwo, [ id ] );
        await connection.query( sqlTextSeven, [ id ] );
        for( const availability_skill of availability_skills ) {
            let response = await connection.query( sqlTextThree, [ availability_skill ] );
            if( response.rows[0] !== undefined ) {
                await connection.query( sqlTextFour, [ id, response.rows[0].id ] );
            }
            else {
                let skillResponse = await connection.query( sqlTextFive, [ availability_skill ] );
                if( skillResponse.rows[0] !== undefined ) {
                    await connection.query( sqlTextSix, [ id, skillResponse.rows[0].id ] );
                }
            }
        }
        await connection.query( 'COMMIT;' );
        res.sendStatus( 200 );
    }
    catch(error) {
        console.log( 'Error updating selected user', error );
        await connection.query( 'ROLLBACK;' );
        res.sendStatus( 500 )
    }
    finally {
        connection.release();
    }
});

module.exports = router;