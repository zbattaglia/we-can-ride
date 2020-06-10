import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

//this saga gets all the sessions from the server
function* fetchSessions() {
  try {
    const response = yield axios.get('/session/all');
    yield put({ type: 'SET_SESSIONS', payload: response.data });

  } catch (error) {
    console.log('Error in getting all the sessions', error);
  }
};

//this saga is to let the admin decide if volunteers can look at the session or not
function* showSession(action) {
 //payload looks like {session_id: 13, let_volunteer_view: false}
 yield axios.put('/session/view', action.payload);
 //since this edits a session, it is then necessary to get the sessions again
 yield put({type: 'FETCH_SESSIONS'});

}

//this saga lets the admin create a new session
function* createSession(action) {
  yield axios.post('session/new', action.payload);
  yield put({type: 'FETCH_SESSIONS'});

}

//this saga lets the admin convert the standard session view into actual shifts
//filled with actual volunteers on specific days at specific times
function* publishSession(action) {
  //action.payload looks like {session_id: 6}
  console.log('publish session', action.payload);
  //send the session Id to the server and create a bunch of shifts
  yield axios.put(`/session/edit/${action.payload.session_id}`);
  yield put({type: 'FETCH_SESSIONS'});

}

//this saga takes the input of the id of a session, and uses it to get the lessons
//that are associated with that session
function* fetchSessionLessons(action) {
try {
  const response = yield axios.get(`/session/lessons/${action.payload.session_id}`);
  //once the list of lessons is retrieved, the slots are sorted out between the days of the week, and 
  //the lessons are also sorted out, so that there will be a list of just the lessons. The maps in the
  //standard session start with one to make the days of the week, and then one to put the lessons
  //inside each weekday, and then one to put the slots inside each lesson. that's why the lessons
  //are separated out here.
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
    //fill the lessons array with only lesssons, and only one of each
      if(row.lesson_id !== currentLessonId){
          lessons.push({lesson_id: row.lesson_id, start_of_lesson: row.start_of_lesson, end_of_lesson: row.end_of_lesson, weekday: row.weekday, client: row.client});
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
