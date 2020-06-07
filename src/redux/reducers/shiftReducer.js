import { combineReducers } from 'redux';

const fourWeeksShifts = (state = [], action) => {
  switch (action.type) {
    case 'SET_FOUR_WEEKS_SHIFTS':
      return action.payload;
    default:
      return state;
  }
};
const myShifts = (state = [], action) => {
  switch (action.type) {
    case 'SET_MY_SHIFTS':
      return action.payload;
    default:
      return state;
  }
};  
const mySlots = (state = [], action) => {
  switch (action.type) {
    case 'SET_MY_SLOTS':
      return action.payload;
    default:
      return state;
  }
};  

const tradeShift = (state = '', action) => {
  switch (action.type) {
    case 'SET_TRADE_SHIFT':
      return action.payload;
    default:
      return state;
  }
};

const allShifts = (state = [], action) => {
  switch (action.type) {
    case 'SET_ALL_SHIFTS':
      return action.payload;
    default:
      return state;
  }
}

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
