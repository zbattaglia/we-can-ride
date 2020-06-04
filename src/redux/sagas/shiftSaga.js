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


function* giveUpShift(action) {
  try {
    yield axios.put( `/shift/${action.payload}` )
    yield put( { type: 'SET_TRADE_SHIFT', payload: action.payload } );
  }
  catch(error) {
    console.log( 'Error giving up shift', error );
  }
}

function* fetchAllShifts(action) {
  console.log( 'In fetchShift Saga', action.payload );
  try {
    const response = yield axios.get(`/shift/all`);
    yield put({ type: 'SET_ALL_SHIFTS', payload: response.data });

  } catch (error) {
    console.log('Error in fetching all shifts', error);
  }
};

// saga get's all shifts that are open for subs
function* fetchSubShifts(action) {
  try {
    const response = yield axios.get( '/shift/sub' );
    // console.log( `Got sub shifts back in saga`, response.data )
    yield put( { type: 'SET_SUB_SHIFTS', payload: response.data } );
  }
  catch(error) {
    console.log( 'Error getting open sub shifts' );
  }
}

// saga will be fired when volunteer takes an open sub shift
function* updateSubShift(action) {
  console.log( 'In update sub shiftsaga  with shift id', action.payload );
  try {
    yield axios.put( '/shift/sub/shift', { shiftId: action.payload } );
    yield put( { type: 'FETCH_SUB_SHIFTS' } );
  }
  catch(error) {
    console.log( 'Error updating sub shifts', error );
  }
}

function* shiftSaga() {
  yield takeLatest('FETCH_FOUR_WEEKS_SHIFTS', fetchFourWeeksShifts);
  yield takeLatest('FETCH_MY_SHIFTS', fetchMyShifts);
  yield takeLatest( 'SHIFT_TO_TRADE', giveUpShift )
  yield takeLatest('FETCH_ALL_SHIFTS', fetchAllShifts);
  yield takeLatest('FETCH_SUB_SHIFTS', fetchSubShifts);
  yield takeLatest('TAKE_SUB_SHIFT', updateSubShift);
};

export default shiftSaga;
