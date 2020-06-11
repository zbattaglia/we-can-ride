import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

// worker Saga: will be fired on "FETCH_USER" actions
//this saga is to get all of the volunteers from the database
function* fetchVolunteer() {
  try {
    const response = yield axios.get('/volunteer/volunteer');
    //once they are retrieved, they are sent to the reducer
    yield put({ type: 'SET_VOLUNTEERS', payload: response.data });

  } catch (error) {
    console.log('Error in fetchVolunteer', error);
  }
};

// this saga is for when an admin is looking at a specific volunteer
function* fetchSelectedVolunteer(action) {

  try {
    //the selected volunteer is grabbed from the database
    const response = yield axios.get( `/volunteer/select/${action.payload}` );
    //and sent to the reducer
    yield put( { type: 'SET_SELECTED_VOLUNTEER', payload: response.data } );
  }
  catch(error) {
    console.log( 'Error getting selected user', error );
  }
}

//this saga is for the admin to update a specific volunteer
function* updateSelectedVolunteer(action) {

  try{
    yield axios.put( `/volunteer/${action.payload.id}`, action.payload );
    //once the volunteer has been updated, it's necessary to get the list of
    //volunteers again, as well as to get the selected volunteer again since
    //the data has changed
    yield put( { type: 'FETCH_VOLUNTEERS' } );
    yield put( {type: 'FETCH_SELECTED_VOLUNTEER', payload: action.payload.id})
  }
  catch(error) {
    console.log( 'Error updating selected volunteer information', error );
  }
};

//this saga is to set a user to disabled
function* disableVolunteer(action) {

  try{
    yield axios.put( `/disable/${action.payload}`, action.payload );

    yield put( { type: 'FETCH_VOLUNTEERS' } );
  }
  catch(error) {
    console.log( 'Error disabling user', error );
  }
}

//this saga is to set a disabled volunteer to active
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

//Saga fired on getUserRoles when editing a users profile
function* getUserRoles() {
  // get request to get all roles a user can fill and store in response variable
  try {
  const response = yield axios.get('/roles');
  // dispatche response.data with SET_USER_ROLES action to put roles on redux state
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
