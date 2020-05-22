import { combineReducers } from 'redux';

const volunteer = (state = [], action) => {
    switch (action.type) {
      case 'SET_VOLUNTEERS':
        return action.payload;
      default:
        return state;
    }
  };
  
  export default combineReducers({
    volunteer,
  });