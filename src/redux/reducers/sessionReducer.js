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
    case 'SET_SESSION_SLOTS':
      return action.payload;
    default:
      return state;
  }
};

  export default combineReducers({
    allSessions,
    slots
    
  });