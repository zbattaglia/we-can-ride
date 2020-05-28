import { combineReducers } from 'redux';

const allSessions = (state = [], action) => {
    switch (action.type) {
      case 'SET_SESSIONS':
        return action.payload;
      default:
        return state;
    }
};

const slots = (state = [], action) => {
  switch (action.type) {
    case 'SET_SESSION_LESSONS':
      return action.payload;
    default:
      return state;
  }
};

const lessons = (state = [], action) => {
  if(action.type === 'SET_SESSION_LESSONS'){
    if(action.payload[0]){
      let array = [];
      let currentLessonId = 0;
      for (let item of action.payload){
        if(item.lesson_id !== currentLessonId){
          array.push({lesson_id: item.lesson_id, start_of_lesson: item.start_of_lesson, end_of_lesson: item.end_of_lesson});
          currentLessonId = item.lesson_id;
        }
      }
      return array;
    }
  }
  return state;
}

const saturday = (state = [], action) => {
  if(action.type === 'SET_SESSION_LESSONS'){
    let newState = [];
    if(action.payload[0]){
      for (let item of action.payload){
        if(item.weekday === 6){
          newState.push(item);
        }
      }
      return newState
    }
    return state;
  }
  else{
    return state
  }
}
const sunday = (state = [], action) => {
  if(action.type === 'SET_SESSION_LESSONS'){
    let newState = [];
    if(action.payload[0]){
      for (let item of action.payload){
        if(item.weekday === 0 || item.weekday === 7 ){
          newState.push(item);
        }
      }
      return newState
    }
    return state;
  }
  else{
    return state
  }
}
const monday = (state = [], action) => {
  if(action.type === 'SET_SESSION_LESSONS'){
    let newState = [];
    if(action.payload[0]){
      for (let item of action.payload){
        if(item.weekday === 1){
          newState.push(item);
        }
      }
      return newState
    }
    return state;
  }
  else{
    return state
  }
}
const tuesday = (state = [], action) => {
  if(action.type === 'SET_SESSION_LESSONS'){
    let newState = [];
    if(action.payload[0]){
      for (let item of action.payload){
        if(item.weekday === 2){
          newState.push(item);
        }
      }
      return newState
    }
    return state;
  }
  else{
    return state
  }
}
const wednesday = (state = [], action) => {
  if(action.type === 'SET_SESSION_LESSONS'){
    let newState = [];
    if(action.payload[0]){
      for (let item of action.payload){
        if(item.weekday === 3){
          newState.push(item);
        }
      }
      return newState
    }
    return state;
  }
  else{
    return state
  }
}
const thursday = (state = [], action) => {
  if(action.type === 'SET_SESSION_LESSONS'){
    let newState = [];
    if(action.payload[0]){
      for (let item of action.payload){
        if(item.weekday === 4){
          newState.push(item);
        }
      }
      return newState
    }
    return state;
  }
  else{
    return state
  }
}
const friday = (state = [], action) => {
  if(action.type === 'SET_SESSION_LESSONS'){
    let newState = [];
    if(action.payload[0]){
      for (let item of action.payload){
        if(item.weekday === 5){
          newState.push(item);
        }
      }
      return newState
    }
    return state;
  }
  else{
    return state
  }
}


export default combineReducers({
  allSessions,
  slots,
  lessons,
  saturday,
  sunday,
  monday, 
  tuesday,
  wednesday,
  thursday,
  friday,
    
});