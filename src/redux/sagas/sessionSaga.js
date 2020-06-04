import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

function* fetchSessions() {
    console.log( 'In fetchShift Saga' );
  try {
    const response = yield axios.get('/session/all');
    yield put({ type: 'SET_SESSIONS', payload: response.data });

  } catch (error) {
    console.log('Error in getting all the sessions', error);
  }
};

function* showSession(action) {
 console.log('in show session saga', action.payload);
 //payload looks like {session_id: 13, let_volunteer_view: false}
 
}

function* createSession(action) {
  yield axios.post('session/new', action.payload);
  yield put({type: 'FETCH_SESSIONS'});
}
function* publishSession(action) {
  //action.payload looks like {session_id: 6}
  console.log('publish session', action.payload);
  //send the session Id to the server and create a bunch of shifts
  yield axios.put(`/session/edit/${action.payload.session_id}`);
  yield put({ type: 'FETCH_SESSION_LESSONS', payload: action.payload});

}
function* fetchSessionLessons(action) {
try {
  const response = yield axios.get(`/session/lessons/${action.payload.session_id}`);
  let monday=[];
  let tuesday=[];
  let wednesday=[];
  let thursday=[];
  let friday=[];
  let saturday=[];
  let sunday=[];
  let lessons = [];
  let currentLessonId = 0;
  for(let row of response.data){
      if(row.lesson_id !== currentLessonId){
          lessons.push({lesson_id: row.lesson_id, start_of_lesson: row.start_of_lesson, end_of_lesson: row.end_of_lesson, weekday: row.weekday});
          currentLessonId = row.lesson_id;
      }
      switch (row.weekday) {
          case 0 :
            sunday.push(row);
            break;
          case 1 :
            monday.push(row);
            break;
          case 2 :
            tuesday.push(row);
            break;
          case 3 :
            wednesday.push(row);
            break;
          case 4 :
            thursday.push(row);
            break;
          case 5 :
            friday.push(row);
            break;
          case 6 :
            saturday.push(row);
            break;
        }
  }
  let object = {saturday, sunday, monday, tuesday, wednesday, thursday, friday, lessons}
  yield put({ type: 'SET_SESSION_LESSONS', payload: object });

} catch (error) {
  console.log('Error in fetching the slots for this session ', error);
}
}; 

function* shiftSaga() {
  yield takeLatest('FETCH_SESSIONS', fetchSessions);
  yield takeLatest('FETCH_SESSION_LESSONS', fetchSessionLessons);
  yield takeLatest('CREATE_SESSION', createSession);
  yield takeLatest('PUBLISH_SESSION', publishSession);
  yield takeLatest('SHOW_SESSION', showSession);

};

export default shiftSaga;
