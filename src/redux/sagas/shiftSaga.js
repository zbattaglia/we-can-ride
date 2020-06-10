import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

// worker Saga: will be fired on "FETCH_FOUR_WEEKS_SHIFTS" actions
function* fetchFourWeeksShifts() {
  try {
    const response = yield axios.get('/shift/fourweeks');
    yield put({ type: 'SET_FOUR_WEEKS_SHIFTS', payload: response.data });

  } catch (error) {
    console.log('Error in fetching four weeks of shifts', error);
  }
};

function* fetchMyShifts(action) {
  try {
    const response = yield axios.get(`/shift/myshift/${action.payload.user_id}`);
    yield put({ type: 'SET_MY_SHIFTS', payload: response.data });

  } catch (error) {
    console.log('Error in fetching this users shifts', error);
  }
};

function* fetchMySlots(action) {
  //action.payload is in the form {user_id: 8}
  try{
    const response = yield axios.get(`/shift/myslots/${action.payload.user_id}`);
    yield put({ type: 'SET_MY_SLOTS', payload: response.data});
  }
  catch (error) {
    console.log('error in getting my slots', error);
  }
}


function* giveUpShift(action) {
  try {
    // first update the status of the selected shift to 'looking_to_give_up',
    // then send automated message to admin users notifying them the a shift is being given up
    yield axios.put( `/shift/${action.payload}` );
    yield axios.post( '/message/trade', {shiftId: action.payload } );
    yield put( { type: 'SET_TRADE_SHIFT', payload: action.payload } );
  }
  catch(error) {
    console.log( 'Error giving up shift', error );
  }
}

function* fetchAllShifts(action) {
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
  try {
    yield axios.put( '/shift/sub/shift', { shiftId: action.payload } );
    yield put( { type: 'FETCH_SUB_SHIFTS' } );
  }
  catch(error) {
    console.log( 'Error updating sub shifts', error );
  }
}

function* updateShift(action){
  try{
      yield axios.put('/shift/update/volunteer', action.payload);
      yield put ({type: 'FETCH_ALL_SHIFTS'});
  }
  catch(error){
      console.log('Error in updateShift.', error);
  }
}

function* shiftSaga() {
  yield takeLatest('FETCH_FOUR_WEEKS_SHIFTS', fetchFourWeeksShifts);
  yield takeLatest('FETCH_MY_SHIFTS', fetchMyShifts);
  yield takeLatest( 'SHIFT_TO_TRADE', giveUpShift )
  yield takeLatest('FETCH_ALL_SHIFTS', fetchAllShifts);
  yield takeLatest('FETCH_SUB_SHIFTS', fetchSubShifts);
  yield takeLatest('TAKE_SUB_SHIFT', updateSubShift);
  yield takeLatest('FETCH_MY_SLOTS', fetchMySlots);
  yield takeLatest('UPDATE_SHIFT', updateShift);
};

export default shiftSaga;
