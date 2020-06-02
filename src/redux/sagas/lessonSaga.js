import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';
/* 
function* fetchSessionLessons(action) {
    console.log( 'In fetch the lessons for this day of the session Saga' );
  try {
    const response = yield axios.get(`/lesson/day/${action.payload.weekday_number}`);
    yield put({ type: 'SET_WEEKDAY_LESSONS', payload: response.data });

  } catch (error) {
    console.log('Error in fetching lessons for this day', error);
  }
};
 */
function* deleteLesson(action) {
  console.log( 'in delete a lesson by id saga', action.payload);
  // action.payload shaped like {session_id: 4, lesson_id: 4}
  const session_id = action.payload.session_id;
  try{
    yield axios.delete('lesson/lesson', {data: action.payload});
    yield put({ type: 'FETCH_SESSION_LESSONS', payload: {session_id}});
  }
  catch (error) {
    console.log('error in deleting a lesson', error);
  }
  
}

function* createLesson(action) {
  console.log('saga for create a lesson', action.payload);
    try {
      const response = yield axios.post(`lesson/create`, action.payload );
//  go get the lessons for the session again - so the post needs to return the session id from the query
// TODO get the session_id back from the database
      yield console.log( 'the session_id back from the database', response.data);
      yield put({ type: 'FETCH_SESSION_LESSONS', payload: response.data});
    } catch (error) {
      console.log('error in creating a lesson', error);
    }
}
function* deleteRole(action) {
  console.log('saga for deleting a role/slot', action.payload);
  //action.payload is shaped like {slot_id: 38, session_id: 12}
  const session_id = action.payload.session_id;
  try {
    //go to delete a slot in the lesson
    yield axios.delete('lesson/slot', {data: action.payload});
    //send the session id on to the fetch session lessons saga to get the page re rendered
    yield put({ type: 'FETCH_SESSION_LESSONS', payload: {session_id}});
  } catch (error) {
    console.log('error in deleting a slot', error);
  }
}
function* getRoles() {
  console.log('saga for getting the possible roles from the server');
  //TODO actually get the roles from the server.
  const response = yield axios.get('lesson/roles');
  yield console.log('response to getting roles from server', response.data);
  yield put({ type: 'SET_ROLES', payload: response.data});
}

function* addRole(action) {
  // action.payload look like this: {lesson_id: 35, session_id:6, skill_id:3}
  const session_id = action.payload.session_id;
  try{
    yield axios.post('lesson/roles', action.payload);
    yield put({ type: 'FETCH_SESSION_LESSONS', payload: {session_id}});
  }
  catch (error) { 
    console.log('error in adding a role to the lesson saga', error);
  }
};

function* assignVolunteer(action) {
  console.log('In assignVolunteer saga with:', action.payload)
  // action.payload look like this: {volunteer: 1, session: 1, slot_id: 2}
  const session_id = action.payload.session_id;
  const slot_id = action.payload.slot_id;
  const user_id = action.payload
  try{
    yield axios.post('lesson/assign', action.payload);
    yield put({ type: 'FETCH_SESSION_LESSONS', payload: {session_id}});
  }
  catch (error) { 
    console.log('error in adding a role to the lesson saga', error);
  }
};


function* shiftSaga() {
  yield takeLatest('DELETE_LESSON', deleteLesson);
  yield takeLatest('CREATE_LESSON', createLesson);
  yield takeLatest('DELETE_ROLE', deleteRole);
  yield takeLatest('GET_ROLES', getRoles);
  yield takeLatest('ADD_ROLE_TO_LESSON', addRole);
  yield takeLatest('ASSIGN_VOLUNTEER', assignVolunteer);

};

export default shiftSaga;
