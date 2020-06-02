// module for createing webtokens to be sent via email
const jwt = require( 'jsonwebtoken' );

module.exports = createToken = ( tokenInfo ) => {
    // get required info for creating token from tokenInfo
    const userId = tokenInfo.id;
    const key = tokenInfo.key;

    // console.log( 'Got token info in token module', userId, key );

    // payload is what will be encrypted in web token
    const payload = { userId };
    // jwt.sign creates web token and encrypts using key provided. expiresIn set's time from creation that token will expire.
    // set to expire in 1 hour here
    const token = jwt.sign( payload, key, { expiresIn: '1h' } );

    // return the new token to be used.
    return token;

}; // end createToken
