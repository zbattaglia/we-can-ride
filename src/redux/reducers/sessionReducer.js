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

const saturday = (state = [], action) => {
  if(action.type === 'SET_SESSION_SLOTS'){
    let newState = [];
    if(action.payload[0]){
      for (let item of action.payload){
        console.log('checking if slots are on saturday')
        if(item.weekday === 6){
          newState.push(item);
          console.log('adding a slot to saturday', newState);
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
  saturday,
    
});