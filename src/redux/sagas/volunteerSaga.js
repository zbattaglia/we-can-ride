import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

// worker Saga: will be fired on "FETCH_USER" actions
function* fetchVolunteer() {
    console.log( 'In fetchVolunteer Saga' );
  try {
    const response = yield axios.get('/volunteer/volunteer');
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

function* updateSelectedVolunteer(action) {
  console.log( `In updateVolunteer saga`, action.payload );

  try{
    yield axios.put( `/volunteer/${action.payload.id}`, action.payload );

    yield put( { type: 'FETCH_VOLUNTEERS' } );
  }
  catch(error) {
    console.log( 'Error updating selected volunteer information', error );
  }
};

function* disableVolunteer(action) {
  console.log( `In disableVolunteer saga`, action.payload );

  try{
    yield axios.put( `/disable/${action.payload}`, action.payload );

    yield put( { type: 'FETCH_VOLUNTEERS' } );
  }
  catch(error) {
    console.log( 'Error disabling user', error );
  }
}

function* activateVolunteer(action) {
  console.log( `In activateVolunteer saga`, action.payload );

  try{
    yield axios.put( `/activate/${action.payload}`, action.payload );

    yield put( { type: 'FETCH_VOLUNTEERS' } );
  }
  catch(error) {
    console.log( 'Error disabling user', error );
  }
};

function* getUserRoles() {
  console.log( 'In getUserRoles Saga' );
try {
  const response = yield axios.get('/roles');
  yield put({ type: 'SET_USER_ROLES', payload: response.data });

} catch (error) {
  console.log('Error in getUserRoles', error);
}
};

function* volunteerSaga() {
  yield takeLatest('FETCH_VOLUNTEERS', fetchVolunteer);
  yield takeLatest('FETCH_SELECTED_VOLUNTEER', fetchSelectedVolunteer);
  yield takeLatest('UPDATE_SELECTED_VOLUNTEER', updateSelectedVolunteer);
  yield takeLatest('DISABLE_VOLUNTEER', disableVolunteer);
  yield takeLatest('ACTIVATE_VOLUNTEER', activateVolunteer);
  yield takeLatest('GET_USER_ROLES', getUserRoles);
};

export default volunteerSaga;
