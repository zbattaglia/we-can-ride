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
    if(action.payload[0] && action.payload[0].id){
      for (let item of action.payload){
        if(item.weekday === 6){
          newState.push(item);
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