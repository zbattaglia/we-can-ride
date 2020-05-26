import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

// worker Saga: will be fired on "FETCH_USER" actions
function* fetchMessage() {
    console.log( 'In fetchMessage Saga' );
  try {

    const response = yield axios.get( '/message' );

    yield put({ type: 'SET_MESSAGE', payload: response.data });
  } catch (error) {
    console.log('Message get request failed', error);
  }
}

function* messageSaga() {
  yield takeLatest('FETCH_MESSAGE', fetchMessage);
}

export default messageSaga;