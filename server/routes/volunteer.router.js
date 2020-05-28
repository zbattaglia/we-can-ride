const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');


/**
 * GET route template
 */
router.get('/', rejectUnauthenticated, (req, res) => {
    const sqlText = `SELECT "id", "type_of_user", "email", "birthday", "phone", "first_name", "last_name" FROM "user";`;

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
    const sqlText = `SELECT "user"."id", "user"."email", "user"."birthday", "user"."phone", "user"."first_name", "user"."last_name", ARRAY_AGG(DISTINCT "skill"."title") AS "skill", ARRAY_AGG(DISTINCT "availability"."time_available") AS "availability" FROM "user"
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
    const birthday = req.body.birthday;
    const time_available = req.body.time_available;
    const title = req.body.title;
    // console.log( `Updating user with id ${req.params.selectedId}`, first_name, last_name, phone, email, birthday );

    const connection = await pool.connect();

    try {
        await connection.query('BEGIN;');
        // the first query updates all of the user information stored in the user table
        const sqlTextOne = `UPDATE "user" 
                            SET "first_name" = $1, "last_name" = $2, "phone" = $3, "email" = $4, "birthday" = $5
                            WHERE "user"."id" = $6;`;
        // second query deletes all the selected users availability
        const sqlTextTwo = `DELETE FROM "user_availability" WHERE "user_availability"."user_id" = $1;`
        // third query get's id of specific availability to insert into user_availability table
        const sqlTextThree = `SELECT "id" FROM "availability" WHERE "availability"."time_available" = $1;`;
        // fourth query inserts user.id and availability id from third query into user_availability
        const sqlTextFour = `INSERT INTO "user_availability" ("user_id", "availability_id") VALUES ($1, $2);`;
        // fifth query deletes all the selected user's skills
        const sqlTextFive = `DELETE FROM "user_skill" WHERE "user_skill"."user_id" = $1;`;
        // sixth query get's id of specific skill to insert into user_skill table
        const sqlTextSix = `SELECT "id" FROM "skill" WHERE "skill"."title" = $1;`;
        // final query inserts user.id and skill.id from sixth query into user_skill
        const sqlTextSeven = `INSERT INTO "user_skill" ("skill_id", "user_id") VALUES ($1, $2);`;

        // run SQL transaction's
        await connection.query( sqlTextOne, [ first_name, last_name, phone, email, birthday, id ] );
        await connection.query( sqlTextTwo, [ id ] );
        for( const availability of time_available ) {
            let response = await connection.query( sqlTextThree, [ availability ] );
            await connection.query( sqlTextFour, [ id, response.rows[0].id ] );
        }
        await connection.query( sqlTextFive, [ id ] );
        for( const skill of title ) {
            let response = await connection.query( sqlTextSix, [ skill ] );
            await connection.query( sqlTextSeven, [ response.rows[0].id, id ] );
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

    // pool.query( sqlText, [ first_name, last_name, phone, email, birthday, id ] )
    //     .then( (response) => {
    //         console.log( 'Updated User Information' );
    //         res.sendStatus( 200 );
    //     })
    //     .catch( (error) => {
    //         console.log( 'Error updating selected volunteer information on database', error );
    //         res.sendStatus( 500 );
    //     });
});

/**
 * POST route template
 */
router.post('/', rejectUnauthenticated, (req, res) => {

});

module.exports = router;