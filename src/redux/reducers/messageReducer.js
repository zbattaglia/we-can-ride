import { combineReducers } from 'redux';
//this is for the messaging function to allow users to ask each other about shifts
const message = (state = [], action) => {
    switch (action.type) {
      case 'SET_MESSAGE':
        return action.payload;
      default:
        return state;
    }
  };
  
  export default combineReducers({
    message,
  });