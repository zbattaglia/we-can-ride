const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');

//PUT route to disable a users account
router.put('/:id', rejectUnauthenticated, (req, res) => {
    let queryText = `UPDATE "user" SET "disable"='true' WHERE "id"=$1`;
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