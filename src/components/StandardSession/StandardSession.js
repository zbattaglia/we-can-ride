import React, {Component} from 'react';

import {connect} from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import  moment  from 'moment';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    flexGrow: 1,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  slot: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.light, 
    width: '200px'
  },
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary
  }
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

        {this.props.state.session.slots.map( slot => (
          <Box className={classes.slot} style={{height: `${slot.length_of_lesson*10}`}}  key={slot.id}>
            <Box>{slot.start_of_lesson} - {slot.end_of_lesson} 
              {slot.expected_user == null
              ?
                <Box><Button onClick={() => console.log('fill slot id', slot.slot_id) }>Assign Volunteer</Button></Box>
              :
              <Box id={slot.expected_user}>{slot.first_name} {slot.last_name}</Box>
              }
              {slot.title}
            </Box>
            
          </Box>
        ))}

        {this.state.session.ready_to_publish === true
        ?
        <div>can't add lessons to a published session right now</div>
        :  
        <Button color='primary' onClick={() => console.log('add a lesson to session id', this.state.session.id)}>Add New Lesson</Button>
        }
        
        
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              Here's a something wide
            </Paper>
          </Grid>

        </Grid>
        
      </>
    )
  }
}

const mapStateToProps = state => ({
    state
  });

export default withStyles(styles)(connect(mapStateToProps)(StandardSession));
