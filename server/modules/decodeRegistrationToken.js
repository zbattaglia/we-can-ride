// module for decoding registration webtokens
// calle from user.router
// require jwt-simple for decoding tokens
const jwt = require( 'jwt-simple' );

module.exports = decodeToken = ( token ) => {
    // try to decode token, if successful check that decoded token is not expired
    try {
        const decodedToken = jwt.decode( token, process.env.SERVER_SESSION_SECRET );
        console.log( 'decoded registration token successfully', decodedToken );
        if ( Date.now() <= decodedToken.exp * 1000 ) {
            return true;
        }
    }
    catch(error) {
        // if error, return false
        console.log( 'error decoding token', error );
        return false;
    }
}; // end decodeRegistrationToken