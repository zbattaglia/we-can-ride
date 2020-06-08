import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import LogOutButton from '../LogOutButton/LogOutButton';

// this could also be written with destructuring parameters as:
// const UserPage = ({ user }) => (
// and then instead of `props.user.username` you could use `user.username`
const UserPage = (props) => {
  
  // useEffect(() => {
  //   props.dispatch({type: 'FETCH_USER'});
  //   props.dispatch({type: 'FETCH_VOLUNTEERS'});
  //   props.dispatch({type: 'FETCH_ALL_SHIFTS'});
  // })

  return(
  <div>
    {/* {JSON.stringify(props.volunteer)} */}
    <h1 id="welcome">
      Welcome, { props.user.username }!
    </h1>
    <p>Your ID is: {props.user.id}</p>
    <LogOutButton className="log-in" />
  </div>
)};

// Instead of taking everything from state, we just want the user info.
// if you wanted you could write this code like this:
// const mapStateToProps = ({user}) => ({ user });
const mapStateToProps = state => ({
  user: state.user,
  volunteer: state.volunteers,
});

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(UserPage);
