import { combineReducers } from 'redux';

const fourWeeksShifts = (state = [], action) => {
    switch (action.type) {
      case 'SET_FOUR_WEEKS_SHIFTS':
        return action.payload;
      default:
        return state;
    }
  };
  
  export default combineReducers({
    fourWeeksShifts,
  });