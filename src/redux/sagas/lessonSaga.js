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
  //TODO actually delete the lesson// action.payload shaped like {session_id: 4, lesson_id: 4}
  const session_id = action.payload.session_id;
  try{
    yield axios.delete('lesson', {data: action.payload});
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
/* function* fetchMyShifts(action) {
  console.log( 'In fetchShift Saga', action.payload );
try {
  const response = yield axios.get(`/shift/myshift/${action.payload.user_id}`);
  yield put({ type: 'SET_MY_SHIFTS', payload: response.data });

} catch (error) {
  console.log('Error in fetching this users shifts', error);
}
}; */

function* shiftSaga() {
  yield takeLatest('DELETE_LESSON', deleteLesson);
  yield takeLatest('CREATE_LESSON', createLesson);
};

export default shiftSaga;
