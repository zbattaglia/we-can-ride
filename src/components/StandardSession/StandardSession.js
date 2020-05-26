import React, {Component} from 'react';

import {connect} from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import  moment  from 'moment';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});



class StandardSession extends Component {

  state = {
    session: '',
    time: moment(),
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  componentDidMount () {
    this.props.dispatch({type: 'FETCH_USER'});
    this.props.dispatch({type: 'FETCH_SESSIONS'});
  }
  componentDidUpdate (prevProps, prevState) {
    if (this.state.session === '' && this.props.state.session.allSessions[0]){this.setState({
      session: this.props.state.session.allSessions[0]
    })}
    if (prevState.session !== this.state.session){
      this.props.dispatch({type: 'FETCH_SESSION_SLOTS', payload: {session_id: this.state.session.id}});
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <>
        <h1>Standard Session</h1>
        <InputLabel htmlFor="age-simple">Session</InputLabel>
          <Select
            value={this.state.session}
            onChange={this.handleChange}
            inputProps={{
              name: 'session',
              id: 'select-session',
            }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {this.props.state.session.allSessions.map(item => (
              <MenuItem key={item.id} value={item}>{item.start_date} {item.session_type}</MenuItem>
            ))}
          </Select>

        <p>you can look at the user to see if it's an admin to decide how to show this page</p>
        {JSON.stringify(this.props.state.user)}
        {JSON.stringify(this.state)}
        <p>this is the page to see the standard session view</p>
        <p>the below should let us pick a session to view</p>
        {JSON.stringify(this.props.state.session.allSessions)}
        {JSON.stringify(this.props.state.session.slots)}
        <p> pick a session by its type and start date.
          get the slots of that session back from the database
        </p>


        
      </>
    )
  }
}

const mapStateToProps = state => ({
    state
  });

export default withStyles(styles)(connect(mapStateToProps)(StandardSession));
