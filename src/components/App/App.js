import React, {Component} from 'react';
import {
  HashRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';

import {connect} from 'react-redux';

import Nav from '../Nav/Nav';
import SideBar from '../SideBar/SideBar';
import Footer from '../Footer/Footer';

import ProtectedRoute from '../ProtectedRoute/ProtectedRoute'

import AboutPage from '../AboutPage/AboutPage';
import Calendar from '../Calendar/Calendar';
import EditProfile from '../EditProfile/EditProfile';
import FindASub from '../FindASub/FindASub';
import Inbox from '../Inbox/Inbox';
import ManageVolunteers from '../ManageVolunteers/ManageVolunteers';
import MyShifts from '../MyShifts/MyShifts';
import StandardSession from '../StandardSession/StandardSession';
import SubPage from '../SubPage/SubPage';
import Schedule from '../Schedule/Schedule';
import EditVolunteer from '../ManageVolunteers/EditVolunteer';
import ResetPasswordPage from '../ResetPasswordPage/ResetPasswordPage';
import RegisterPage from '../RegisterPage/RegisterPage';
import PrintADay from '../PrintADay/PrintADay';

import './App.css';

class App extends Component {

  // determines if side nav is open or close (for mobile)
  state = {
    open: false,
  }

  componentDidMount () {
    this.props.dispatch({type: 'FETCH_USER'});
    this.props.dispatch({type: 'FETCH_VOLUNTEERS'});
    this.props.dispatch({type: 'FETCH_ALL_SHIFTS'});
  }

  // toggles side nav on click
  toggleSide = () => {
    console.log( 'Toggle Side Bar', this.state.open );
    this.setState({
      open: !this.state.open,
    })
  }

  render() {
    return (
      <Router>
        <div className={this.props.user.id ? "" : "login-mode"}>
          <Nav />
          <div onClick={ () => this.toggleSide()}>
            <SideBar open={this.state.open}/>
          </div>
          <div className="content">
            <Switch>
              {/* Visiting localhost:3000 will redirect to localhost:3000/home */}
              <Redirect exact from="/" to="/inbox" /> {/**TODO!!! */}
              {/* Visiting localhost:3000/about will show the about page.
              This is a route anyone can see, no login necessary */}
              <Route
                exact
                path="/about"
                component={AboutPage}
              />
              
              <ProtectedRoute
                exact
                path="/calendar"
                component={Calendar}
              />
              <ProtectedRoute
                exact
                path="/editprofile"
                component={EditProfile}
              />
              <ProtectedRoute
                exact
                path="/findasub"
                component={FindASub}
              />
              <ProtectedRoute
                exact
                path="/inbox"
                component={Inbox}
              />
              <ProtectedRoute
                exact
                path="/managevolunteers"
                component={ManageVolunteers}
              />
              <ProtectedRoute
                exact
                path="/printaday"
                component={PrintADay}
              />
              <ProtectedRoute
                exact
                path="/editVolunteer/:id"
                component={EditVolunteer}
              />
              <ProtectedRoute
                exact
                path="/myshifts"
                component={MyShifts}
              />
              <ProtectedRoute
                exact
                path="/standardsession"
                component={StandardSession}
              />
              <ProtectedRoute
                exact
                path="/subpage"
                component={SubPage}
              />
              <ProtectedRoute
                exact
                path="/schedule"
                component={Schedule}
              />
              {/* We do not want this route to be protected because it will be verified with web token
              It also should not be on an exact path because the token will be in the URL paramaters
              */}
              <Route
                path="/reset/:id/:token"
                component={ResetPasswordPage}
              />
              <Route
                path="/register/:token"
                component={RegisterPage}
              />
              {/* If none of the other routes matched, we will show a 404. */}
              <Route render={() => <h1>404</h1>} />
            </Switch>
          </div>
          <Footer />
        </div>
      </Router>
  )}
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(App);
