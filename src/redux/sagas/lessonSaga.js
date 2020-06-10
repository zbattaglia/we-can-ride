import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

//this is the saga to delete the lesson based on its id
function* deleteLesson(action) {
  console.log( 'in delete a lesson by id saga', action.payload);
  // action.payload shaped like {session_id: 4, lesson_id: 4}
  const session_id = action.payload.session_id;
  try{
    yield axios.delete('lesson/lesson', {data: action.payload});
    //once a lesson has been deleted, it is necessary to get the lessons 
    //for the session again, since they have changed
    yield put({ type: 'FETCH_SESSION_LESSONS', payload: {session_id}});
  }
  catch (error) {
    console.log('error in deleting a lesson', error);
  }
  
}

//this is the saga to create a lesson
function* createLesson(action) {
  console.log('saga for create a lesson', action.payload);
    try {
      const response = yield axios.post(`lesson/create`, action.payload );
//here, the session id is being passed back from the database
      yield console.log( 'the session_id back from the database', response.data);
      //then the session id is used to go get the lessons for the session since they've changed
      yield put({ type: 'FETCH_SESSION_LESSONS', payload: response.data});
    } catch (error) {
      console.log('error in creating a lesson', error);
    }
}

//this is the saga to delete a role in a lesson
function* deleteRole(action) {
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

//this is the saga to get the possible skills from the server
function* getRoles() {
  const response = yield axios.get('lesson/roles');
//once they are retrieved from the server they're sent to the reducer
  yield put({ type: 'SET_ROLES', payload: response.data});
}

//this is the saga to add a role to a lesson
function* addRole(action) {
  // action.payload look like this: {lesson_id: 35, session_id:6, skill_id:3}
  const session_id = action.payload.session_id;
  try{
    //send the lesson and skill needed to the database
    yield axios.post('lesson/roles', action.payload);
    //since the lessons for the session have changed, go get the session lessons again
    yield put({ type: 'FETCH_SESSION_LESSONS', payload: {session_id}});
  }
  catch (error) { 
    console.log('error in adding a role to the lesson saga', error);
  }
};

//this is the saga to apply a volunteer to a role in a session
function* assignVolunteer(action) {
  // action.payload look like this: {volunteer: 1, session: 1, slot_id: 2}
  const session_id = action.payload.session_id;
  try{
    //send the slot id and the volunteer id to the server
    yield axios.post('lesson/assign', action.payload);
    //since the lessons have changed, use the session id to get the lessons again
    yield put({ type: 'FETCH_SESSION_LESSONS', payload: {session_id}});
  }
  catch (error) { 
    console.log('error in assigning volunteer', error);
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
