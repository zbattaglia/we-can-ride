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


//This holds the id of a shift that is selected to be given up on the my shifts page
// the id is stored in redux state, so it can be used to request other volunteers take the shift
// on the find a sub page
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

//This holds all of the shifts from the database that do not have a user assigned
// OR have a user assigned, but are set as user_wants_to_trade on redux state
// these are shifts to be displayed on the sub page for volunteers to assign themselves to 
// if they are able to sub
const subShifts = (state = [], action) => {
  switch (action.type) {
    case 'SET_SUB_SHIFTS':
      return action.payload;
    default:
      return state;
  }
}

const dayShifts = (state = [], action) => {
  switch(action.type) {
    case 'SET_DAY_SHIFTS':
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
    dayShifts,
  });
