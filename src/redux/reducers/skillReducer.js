import { combineReducers } from 'redux';

const skills = (state = [], action) => {
    switch (action.type) {
      case 'SET_ROLES':
        return action.payload;
      default:
        return state;
    }
  };

  export default combineReducers({
    skills,
  });