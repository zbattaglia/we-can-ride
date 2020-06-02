import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

// worker Saga: will be fired on "SEND_PASSWORD_LINK" actions to verify user is existing and send link to appropriate email
function* sendPasswordLink(action) {
    console.log( 'In sendPasswordLink saga', action );

    try {
        // "POST" link to server
        yield axios.post( '/resetPassword', {email: action.payload } );
    }
    catch(error) {
        console.log( 'Errror sending password link', error );
    }
}

// saga will be fired when a reset password page is loaded
function* decodeResetToken(action) {
    console.log( 'In decodeToken saga', action );

    const response = yield axios.get( `/resetPassword/${action.payload.id}/${action.payload.token}`);
    console.log( 'Decoded token successfully', response.data );
    yield put( { type: 'SET_TEMP_USER', payload: response.data.userId } )
};

// saga will be fired when reset password action is dispatched
function* resetPassword(action) {
    console.log( 'In reset password saga', action );
    // send put request to server to update password
    yield axios.put( `/resetPassword/${action.payload.id}`, {password: action.payload.password } );
}


function* resetPasswordSaga() {
  yield takeLatest('SEND_PASSWORD_LINK', sendPasswordLink);
  yield takeLatest('DECODE_RESET_TOKEN', decodeResetToken);
  yield takeLatest('RESET_PASSWORD', resetPassword);
}

export default resetPasswordSaga;