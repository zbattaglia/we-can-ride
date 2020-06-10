import { combineReducers } from 'redux';

//holds all the volunteers
const volunteer = (state = [], action) => {
    switch (action.type) {
      case 'SET_VOLUNTEERS':
        return action.payload;
      default:
        return state;
    }
  };

  //holds the volunteer that the admin is editing
  const selectedVolunteer = (state = {}, action ) => {
    switch ( action.type ) {
      case 'SET_SELECTED_VOLUNTEER':
        return action.payload;
      default:
        return state;
    }
  };

  //holds the skills that apply to the user
  const userRoles = (state = [], action ) => {
    switch ( action.type ) {
      case 'SET_USER_ROLES':
        return action.payload;
      default:
        return state;
    }
  };
  
  export default combineReducers({
    volunteer,
    selectedVolunteer,
    userRoles,
  });