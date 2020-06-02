// module for decoding webtokens
const jwt = require( 'jsonwebtoken' );

module.exports = decodeToken = ( tokenInfo ) => {
    // extract components from tokenInfo
    // need to convert userId passed in from string to a number for comparison with id in decoded token
    const userId = Number( tokenInfo.id );
    const token = tokenInfo.token;
    const key = tokenInfo.key;
    console.log( 'Decoding token', userId, token, key );
    // create decoded token using token passed in params and current password as key
    const decodedToken = jwt.decode( token, key );

    console.log( 'Decoded token successfully', decodedToken );
    // verify that token was successfully decoded AND is not expired
    if( decodedToken.userId === userId && Date.now() <= decodedToken.exp * 1000 ) {
        return userId;
    }
    else {
        return false;
    }
}