import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

// worker Saga: will be fired on "FETCH_USER" actions
function* fetchVolunteer() {
    console.log( 'In fetchVolunteer Saga' );
  try {
    const response = yield axios.get('/volunteer');
    yield put({ type: 'SET_VOLUNTEERS', payload: response.data });

  } catch (error) {
    console.log('Error in fetchVolunteer', error);
  }
};

function* volunteerSaga() {
  yield takeLatest('FETCH_VOLUNTEERS', fetchVolunteer);
};

export default volunteerSaga;
