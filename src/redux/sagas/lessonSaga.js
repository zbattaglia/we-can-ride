import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

function* fetchDayOfWeekLessons(action) {
    console.log( 'In fetch the lessons for this day of the session Saga' );
  try {
    const response = yield axios.get(`/lesson/day/${action.payload.weekday_number}`);
    yield put({ type: 'SET_WEEKDAY_LESSONS', payload: response.data });

  } catch (error) {
    console.log('Error in fetching lessons for this day', error);
  }
};

/* function* fetchMyShifts(action) {
  console.log( 'In fetchShift Saga', action.payload );
try {
  const response = yield axios.get(`/shift/myshift/${action.payload.user_id}`);
  yield put({ type: 'SET_MY_SHIFTS', payload: response.data });

} catch (error) {
  console.log('Error in fetching this users shifts', error);
}
}; */

function* shiftSaga() {
  yield takeLatest('FETCH_DAY_OF_SESSION_LESSONS', fetchDayOfWeekLessons);
};

export default shiftSaga;
