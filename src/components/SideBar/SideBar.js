import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import './SideBar.css';

const SideBar = (props) => (
  <div>
      {props.user.id && (
        <>
        <ul className="SideBar">
          {props.user.type_of_user === 'volunteer' ?
          <>
            <li>
                <Link className="side-link" to="/calendar">
                    Calendar
                </Link>
            </li>
            <li>
                <Link className="side-link" to="/myshifts">
                    My Shifts
                </Link>
            </li>
            <li>
              <Link className="side-link" to="/standardsession">
                Standard Session
              </Link>
            </li>
            <li>
                <Link className="side-link" to="/subpage">
                    Sub Page
                </Link>
            </li>
                <Link className="side-link" to="/inbox">
                  Inbox
                </Link>
            <li>
                <Link className="side-link" to="/editprofile">
                    Edit Profile
                </Link>
            </li>
          </>
            :
            <>
              <Link className="side-link" to="/schedule">
                Schedule
              </Link>
              <Link className="side-link" to="/standardsession">
                Standard Session
              </Link>
              <Link className="side-link" to="/managevolunteers">
                Manage Volunteers
              </Link>
              <Link className="side-link" to="/inbox">
                Inbox
              </Link>
            </>
          }
        </ul>
        </>
      )}
  </div>
);

// Instead of taking everything from state, we just want the user
// object to determine if they are logged in
// if they are logged in, we show them a few more links 
// if you wanted you could write this code like this:
// const mapStateToProps = ({ user }) => ({ user });
const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps)(SideBar);