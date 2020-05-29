const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');

const router = express.Router();

// Handles Ajax request for user information if user is authenticated
router.get('/', rejectUnauthenticated, (req, res) => {
  // Send back user object from the session (previously queried from the database)
  res.send(req.user);
});

//TODO GET ROUTE AND make sure the server is getting monday morning, monday evening, etc.


// Handles POST request with new user information and availability with encrypted password
router.post('/register', async (req, res, next) => {  
  const username = req.body.username;
  const password = encryptLib.encryptPassword(req.body.password);
  console.log(req.body.amSunday);
  // User information
  const sqlText = [username, password, req.body.firstName, req.body.lastName, req.body.phoneNumber, req.body.birthday];

  // User availability
  const sqlText2 = [username,
                    req.body.amSunday, 
                    req.body.pmSunday, 
                    req.body.amMonday, 
                    req.body.pmMonday, 
                    req.body.amTuesday, 
                    req.body.pmTuesday,
                    req.body.amWednesday,
                    req.body.pmWednesday,
                    req.body.amThursday,
                    req.body.pmThursday,
                    req.body.amFriday,
                    req.body.pmFriday,
                    req.body.amSaturday,
                    req.body.pmSaturday]

  const connection = await pool.connect();

  try {
    await connection.query(`BEGIN`);
    
    // User information
    const insertSQL = `INSERT INTO "user" (email, password, first_name, last_name, phone, birthday) 
                       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;`; 
                        
    await connection.query(insertSQL, sqlText);
    
    // const insertSQL2 =`INSERT INTO "user_availability" ("id", "time_available") 
    //                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    //                     `;
    // await connection.query(insertSQL2, sqlText2)
    await connection.query(`COMMIT`);
    res.sendStatus(200);
  }
  catch (error) {
    console.log( `Error on Register`, error)
    await connection.query(`ROLLBACK`);
    res.send({error:``});
    res.sendStatus(500);
  }
  finally {
    //important that we free that connection all the time
    connection.release();
  }

});

// Handles login form authenticate/login POST
// userStrategy.authenticate('local') is middleware that we run on this route
// this middleware will run our POST if successful
// this middleware will send a 404 if not successful
router.post('/login', userStrategy.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

// clear all server session information about this user
router.post('/logout', (req, res) => {
  // Use passport's built-in method to log out the user
  req.logout();
  res.sendStatus(200);
});

module.exports = router;
