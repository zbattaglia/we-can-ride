import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

// worker Saga: will be fired on "FETCH_FOUR_WEEKS_SHIFTS" actions
function* fetchSessions() {
    console.log( 'In fetchShift Saga' );
  try {
    const response = yield axios.get('/session/all');
    yield put({ type: 'SET_SESSIONS', payload: response.data });

  } catch (error) {
    console.log('Error in getting all the sessions', error);
  }
};

function* fetchSessionLessons(action) {
  console.log( 'In fetch session lessons Saga', action.payload );
try {
  const response = yield axios.get(`/session/lessons/${action.payload.session_id}`);
  yield put({ type: 'SET_SESSION_LESSONS', payload: response.data });

} catch (error) {
  console.log('Error in fetching the slots for this session ', error);
}
}; 

function* shiftSaga() {
  yield takeLatest('FETCH_SESSIONS', fetchSessions);
  yield takeLatest('FETCH_SESSION_LESSONS', fetchSessionLessons);

};

export default shiftSaga;
