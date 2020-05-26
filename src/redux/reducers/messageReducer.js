import { combineReducers } from 'redux';

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