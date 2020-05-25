import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

// worker Saga: will be fired on "FETCH_USER" actions
function* fetchVolunteer() {
    console.log( 'In fetchShift Saga' );
  try {
    const response = yield axios.get('/shift');
    yield put({ type: 'SET_SHIFTS', payload: response.data });

  } catch (error) {
    console.log('Error in fetchVolunteer', error);
  }
};

function* shiftSaga() {
  yield takeLatest('FETCH_ALL_SHIFTS', fetchVolunteer);
};

export default shiftSaga;
