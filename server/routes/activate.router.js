const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');

//PUT route to activate a users account
router.put('/:id', rejectUnauthenticated, (req, res) => {
    console.log(`updating to disable user profile`, req.params);
    let queryText = `UPDATE "user" SET "disable"='false' WHERE "id"=$1`;
    pool.query(queryText, [req.params.id])
      .then(result => {
        res.sendStatus(201);
      })
      .catch(error => {
        console.log(`Error disabling user account`, error);
        res.sendStatus(500);
      });
  });



module.exports = router;