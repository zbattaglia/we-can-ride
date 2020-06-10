import { combineReducers } from 'redux';

//this holds all the shifts for the next four weeks
const fourWeeksShifts = (state = [], action) => {
  switch (action.type) {
    case 'SET_FOUR_WEEKS_SHIFTS':
      return action.payload;
    default:
      return state;
  }
};

//this holds the shifts for the logged in user
const myShifts = (state = [], action) => {
  switch (action.type) {
    case 'SET_MY_SHIFTS':
      return action.payload;
    default:
      return state;
  }
};  

//this holds the slots for the logged in user that are still scheduled for the future
//this is different than their shifts because they could have signed up for a session
//that hasn't been published yet, so there aren't any shifts to view, but they would still 
//like to know when they have agreed to show up
const mySlots = (state = [], action) => {
  switch (action.type) {
    case 'SET_MY_SLOTS':
      return action.payload;
    default:
      return state;
  }
};  


//TODO zach
const tradeShift = (state = '', action) => {
  switch (action.type) {
    case 'SET_TRADE_SHIFT':
      return action.payload;
    default:
      return state;
  }
};

//holds all the shifts that exist, for use in the calendar
const allShifts = (state = [], action) => {
  switch (action.type) {
    case 'SET_ALL_SHIFTS':
      return action.payload;
    default:
      return state;
  }
}

//TODO zach
const subShifts = (state = [], action) => {
  switch (action.type) {
    case 'SET_SUB_SHIFTS':
      return action.payload;
    default:
      return state;
  }
}

  export default combineReducers({
    fourWeeksShifts,
    myShifts,
    tradeShift,
    allShifts,
    subShifts,
    mySlots,
  });
