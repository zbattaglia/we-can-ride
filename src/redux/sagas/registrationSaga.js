import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

// worker Saga: will be fired on "REGISTER" actions
function* registerUser(action) {
  try {
    // clear any existing error on the registration page
    yield put({ type: 'CLEAR_REGISTRATION_ERROR' });

    // passes the username and password from the payload to the server
    yield axios.post('/api/user/register', action.payload);

    // automatically log a user in after registration
    yield put({ type: 'LOGIN', payload: action.payload });
    
    // set to 'login' mode so they see the login screen
    // after registration or after they log out
    yield put({type: 'SET_TO_LOGIN_MODE'});
  } catch (error) {
      console.log('Error with user registration:', error);
      yield put({type: 'REGISTRATION_FAILED'});
  }
}

function* sendRegistrationLink(action) {
  yield axios.post( `/api/user/register/new`, { email: action.payload } );
}

// saga will fire on decode registration action
function* decodeRegistrationToken(action) {
  // console.log( 'In decodeRegistrationToken saga', action );
  try {
  const response = yield axios.get( `/api/user/register/${action.payload}`);
  yield put( { type: 'SET_TO_REGISTER_MODE' } );
  }
  catch( error ) {
    console.log( 'Error decoding Token ', error );
  }
}

function* registrationSaga() {
  yield takeLatest('REGISTER', registerUser);
  yield takeLatest('SEND_REGISTRATION', sendRegistrationLink );
  yield takeLatest('DECODE_REGISTRATION_TOKEN', decodeRegistrationToken);
}

export default registrationSaga;
