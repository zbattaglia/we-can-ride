import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

// worker Saga: will be fired on "FETCH_FOUR_WEEKS_SHIFTS" actions
function* fetchFourWeeksShifts() {
    console.log( 'In fetchShift Saga' );
  try {
    const response = yield axios.get('/shift/fourweeks');
    yield put({ type: 'SET_FOUR_WEEKS_SHIFTS', payload: response.data });

  } catch (error) {
    console.log('Error in fetching four weeks of shifts', error);
  }
};

function* fetchMyShifts(action) {
  console.log( 'In fetchShift Saga', action.payload );
try {
  const response = yield axios.get(`/shift/myshift/${action.payload.user_id}`);
  yield put({ type: 'SET_MY_SHIFTS', payload: response.data });

} catch (error) {
  console.log('Error in fetching this users shifts', error);
}
};

function* shiftSaga() {
  yield takeLatest('FETCH_FOUR_WEEKS_SHIFTS', fetchFourWeeksShifts);
  yield takeLatest('FETCH_MY_SHIFTS', fetchMyShifts);
};

export default shiftSaga;
