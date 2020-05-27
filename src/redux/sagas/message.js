import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

// worker Saga: will be fired on "FETCH_MESSAGE" actions
function* fetchMessage() {
    console.log( 'In fetchMessage Saga' );
  try {

    const response = yield axios.get( '/message' );

    yield put({ type: 'SET_MESSAGE', payload: response.data });
  } catch (error) {
    console.log('Message get request failed', error);
  }
}

// saga will be fired on "DELETE_MESSAGE" actions
function* deleteMessage(action) {
  // console.log( `In delete message saga with messge id: ${action.payload}`);
  try {
    yield axios.delete( `/message/${action.payload}` );

    yield put( { type: 'FETCH_MESSAGE' } );
  }
  catch(error) {
    console.log( 'Error deleting message', error );
  }
}

function* replyToMessage(action) {
  console.log( `Replying to message with id ${action.payload.id} in reply saga with ${action.payload.type}`);
  try {
    yield axios.post( '/message', action.payload );
  }
  catch(error) {
    console.log( `Error replying to message`, error );
  }
}

function* messageSaga() {
  yield takeLatest('FETCH_MESSAGE', fetchMessage);
  yield takeLatest('DELETE_MESSAGE', deleteMessage);
  yield takeLatest('REPLY_TO_MESSAGE', replyToMessage);
}

export default messageSaga;