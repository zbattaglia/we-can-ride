const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');

//get all the volunteers and their skills
router.get('/', rejectUnauthenticated, (req, res) => {
    const sqlText = `
    SELECT "first_name", "last_name", "user"."id" AS "user_id", "skill"."id" AS "skill_id", "skill"."title", "user_skill"."id" AS "user_skill_id" FROM "user"
    LEFT JOIN "user_skill" ON "user"."id" = "user_skill"."user_id"
    JOIN "skill" ON "skill"."id" = "user_skill"."skill_id";
  `;

    pool.query( sqlText )
        .then( (response) => {
            res.send( response.rows );
        })
        .catch( (error) => {
            console.log( 'Error getting all volunteers', error );
            res.sendStatus( 500 );
        })
});

module.exports = router;