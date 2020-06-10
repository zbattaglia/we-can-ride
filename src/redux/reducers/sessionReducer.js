import { combineReducers } from 'redux';
//this holds all the sessions
const allSessions = (state = [], action) => {
    switch (action.type) {
      case 'SET_SESSIONS':
        return action.payload;
      default:
        return state;
    }
};

//this holds the slots for a session, which means it shows the lessons and who is assigned to them
const slots = (state = [], action) => {
  switch (action.type) {
    case 'SET_SESSION_LESSONS':
      return action.payload;
    default:
      return state;
  }
};


export default combineReducers({
  allSessions,
  slots,
});