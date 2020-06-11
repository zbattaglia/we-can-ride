import { combineReducers } from 'redux';

const skills = (state = [], action) => {
    switch (action.type) {
      case 'SET_ROLES':
        return action.payload;
      default:
        return state;
    }
  };

  const mySkills = (state = [], action) => {
    switch (action.type) {
      case 'SET_MY_SKILLS':
        return action.payload;
      default:
        return state;
    }
  };

  export default combineReducers({
    skills,
    mySkills
  });