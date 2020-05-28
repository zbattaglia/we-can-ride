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

// saga will fire when specific volunteer is selected
function* fetchSelectedVolunteer(action) {
  console.log(`In fetchSelectedVolunteer Saga fetching id ${action.payload}`)
  // make an axios get request with selected volunteers id in parameter
  try {
    const response = yield axios.get( `/volunteer/select/${action.payload}` );
    yield put( { type: 'SET_SELECTED_VOLUNTEER', payload: response.data } );
  }
  catch(error) {
    console.log( 'Error getting selected user', error );
  }
}

function* volunteerSaga() {
  yield takeLatest('FETCH_VOLUNTEERS', fetchVolunteer);
  yield takeLatest('FETCH_SELECTED_VOLUNTEER', fetchSelectedVolunteer);
};

export default volunteerSaga;
