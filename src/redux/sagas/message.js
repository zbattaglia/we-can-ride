import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

// worker Saga: will be fired on "FETCH_MESSAGE" actions
// when a user opens their inbox to display all their messages
function* fetchMessage() {
  try {
    // make GET request and store response in variable
    const response = yield axios.get( '/message' );
    // Dispatch response.data in SET_MESSAGE to put messages on redux state
    yield put({ type: 'SET_MESSAGE', payload: response.data });
  } catch (error) {
    console.log('Message get request failed', error);
  }
}

// saga will be fired on "DELETE_MESSAGE" actions
function* deleteMessage(action) {
  try {
    // DELETE request with id of message to be deleted
    yield axios.delete( `/message/${action.payload}` );
    // dispatch FETCH_MESSAGE action to get all remaining messages and update redux state
    yield put( { type: 'FETCH_MESSAGE' } );
  }
  catch(error) {
    console.log( 'Error deleting message', error );
  }
}

// fired when reply action is executed when a user replies to a message in their inbox
function* replyToMessage(action) {
  // POST request, payload contains id of message being replied to and type of reply (ACCEPT or REJECT)
  try {
    yield axios.post( '/message', action.payload );
  }
  catch(error) {
    console.log( `Error replying to message`, error );
  }
}

// fired whenever a message gets sent to a user requesting they cover a shift
function* sendMessage(action) {
  // POST request with id of user message is being sent to as the action payload
  try {
   yield axios.post( '/message/request', action.payload )
  }
  catch(error) {
    console.log( 'Error sending message', error );
  }
}

// saga will be fired whenever admin emails all volunteers on a given day from print a day component
function* emailDay(action) {
  // POST with action payload
  try {
    yield axios.post( '/message/day', action.payload );
  }
  catch(error) {
    console.log( 'Error emailing daily roster', error );
  }
}

function* messageSaga() {
  yield takeLatest('FETCH_MESSAGE', fetchMessage);
  yield takeLatest('DELETE_MESSAGE', deleteMessage);
  yield takeLatest('REPLY_TO_MESSAGE', replyToMessage);
  yield takeLatest('SEND_MESSAGE', sendMessage);
  yield takeLatest('EMAIL_DAY', emailDay)
;}

export default messageSaga;