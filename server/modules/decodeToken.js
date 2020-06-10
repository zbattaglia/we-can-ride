// module for decoding webtokens for forgot password
// jwt-simple required for decoding tokens
// called from password.router
const jwt = require( 'jwt-simple' );

module.exports = decodeToken = ( tokenInfo ) => {
    // extract components from tokenInfo
    // need to convert userId passed in from string to a number for comparison with id in decoded token
    const userId = Number( tokenInfo.id );
    const token = tokenInfo.token;
    // hashed password is used as a key
    const key = tokenInfo.key;

    // try to decode token, if successful check that decoded token is not expired
    // if not expired, return userId to allow access to reset password page
    try {
        const decodedToken = jwt.decode( token, key );
        if ( Date.now() <= decodedToken.exp * 1000 ) {
            return userId;
        }
    }
    catch(error) {
        // if error, return false
        console.log( 'error decoding token', error );
        return false;
    }
}; // end decode token