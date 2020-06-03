// module for createing webtokens to be sent via email for registration
const jwt = require( 'jwt-simple' );

module.exports = createRegistrationToken = ( email ) => {
    // use session secret stored in .env file as key
    const key = process.env.SERVER_SESSION_SECRET;

    // payload just contains expiration information
    const payload = { iat: Math.round(Date.now() / 1000), exp: Math.round(Date.now() / 1000 + 72 * 60 * 60 )  };

    // jwt.encode creates web token and encrypts using key provided.
    // key is stored in .env for security
    // set to expire in 3 days here
    const token = jwt.encode( payload, key );

    // return the new token to be used.
    console.log( 'created new token', token );
    return token;

}; // end createToken