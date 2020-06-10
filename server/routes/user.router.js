const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');

const createRegistrationToken = require('../modules/createRegistrationToken');
const sendRegistrationLink = require('../modules/registrationLinkEmailer');
const decodeRegistrationToken = require('../modules/decodeRegistrationToken');

const router = express.Router();

// Handles Ajax request for user information if user is authenticated
router.get('/', rejectUnauthenticated, (req, res) => {
  // Send back user object from the session (previously queried from the database)
  res.send(req.user);
});

// router to verify if a web token is valid so a user can register
router.get('/register/:token', async (req, res) => {
  // get token from req.params
  const token = req.params.token;
  try {
    // call decodeRegistrationToken module and pass token in
    if( decodeRegistrationToken( token ) ) {
      res.sendStatus( 200 );
    }
  }
  catch(error) {
    // if error, log to terminal
    console.log( 'Error decoding token', error );
    res.sendStatus( 500 );
  }
}); // end GET route

// Handles POST request with new user information and availability with encrypted password
router.post('/register', async (req, res, next) => {  
  const username = req.body.username;
  const password = encryptLib.encryptPassword(req.body.password);
  const time_available = [];

  // loop over the req.body and create an array of avalabilities to insert in database.
  for ( let availability in req.body ) {
      if( req.body[ availability ] === true ) {
          time_available.push( availability );
      }
  };

  //Transactional query
  const connection = await pool.connect();

  try {
    await connection.query(`BEGIN`);
    
    // User information
    const insertSQL = `INSERT INTO "user" (email, password, first_name, last_name, phone, birthday, type_of_user) 
                       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id;`; 
                      
    // UserId is used to reference user_availability
    const userId = await connection.query(insertSQL, 
                                          [username, password, req.body.firstName, 
                                          req.body.lastName, req.body.phoneNumber, req.body.birthday, 
                                          req.body.type_of_user]);

    // console.log(`user id:`, userId)
    const sqlTextThree = `SELECT "id" FROM "availability" WHERE "availability"."time_available" = $1;`;
    // fourth query inserts user.id and availability id from third query into user_availability
    const sqlTextFour = `INSERT INTO "user_availability" ("user_id", "availability_id") VALUES ($1, $2);`;
    
    // run SQL transaction's
    for( const availability of time_available ) {
        let response = await connection.query( sqlTextThree, [ availability ] );
        await connection.query( sqlTextFour, [ userId.rows[0].id, response.rows[0].id ] );
    }
    await connection.query(`COMMIT`);
    res.sendStatus(200);
  }
  catch (error) {
    console.log( `Error on Register`, error)
    await connection.query(`ROLLBACK`);
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

// POST route to send a registration link to new user
router.post('/register/new', async (req, res) => {
  // get email from req.body
  const email = req.body.email;

  try {
    // create registration token to send in email link, when token is created call sendRegistrationLink
    const token = await createRegistrationToken();
    await sendRegistrationLink( { email, token } );
    res.sendStatus( 200 );
  }
  catch(error) {
    // if error, log to terminal
    console.log( 'Error sending registration link', error );
    res.sendStatus( 500 );
  }
}); // end POST route

module.exports = router;
