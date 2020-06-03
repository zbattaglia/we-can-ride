// module for createing webtokens to be sent via email
const jwt = require( 'jwt-simple' );

module.exports = createToken = ( tokenInfo ) => {
    // get required info for creating token from tokenInfo
    const userId = tokenInfo.id;
    const key = tokenInfo.key;

    // console.log( 'Got token info in token module', userId, key );

    // payload is what will be encrypted in web token
    // since jwt-simple does not include an expiration feature, we include one in the payload
    const payload = { userId, iat: Math.round(Date.now() / 1000), exp: Math.round(Date.now() / 1000 + 1 * 60 * 60 )  };
    // jwt.encode creates web token and encrypts using key provided. Set to expire in 1 hour here
    const token = jwt.encode( payload, key );

    // return the new token to be used.
    return token;

}; // end createToken
