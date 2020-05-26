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

function* shiftSaga() {
  yield takeLatest('FETCH_FOUR_WEEKS_SHIFTS', fetchFourWeeksShifts);
};

export default shiftSaga;
