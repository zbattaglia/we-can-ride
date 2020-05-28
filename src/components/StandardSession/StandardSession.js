import React, {Component} from 'react';

import {connect} from 'react-redux';

import StandardSessionDay from './StandardSessionDay';
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
    color: theme.palette.text.secondary,
    display: 'inline-block',
  },
  day: {
    display: 'inline-block',
  }
});



class StandardSession extends Component {

  state = {
    session: '',
    direction: 'row',
    justify: 'center',
    alignItems: 'center',
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
      this.props.dispatch({type: 'FETCH_SESSION_LESSONS', payload: {session_id: this.state.session.id}});
    }
  }
/*   {slot.lesson_id = lesson
    ?

      {slot.title}
    :
    <p>no</p>
    }))} */


  render() {
    const { classes } = this.props;
    const newWeekdays = [
      {name: 'Sunday', reducer: this.props.state.session.sunday},
      {name: 'Monday', reducer: this.props.state.session.monday},
      {name: "Tuesday", reducer: this.props.state.session.tuesday},
      {name: 'Wednesday', reducer: this.props.state.session.wednesday},
      {name: 'Thursday', reducer: this.props.state.session.thursday},
      {name: 'Friday', reducer: this.props.state.session.friday},
      {name: 'Saturday', reducer: this.props.state.session.saturday},
    ]
    const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return (
      <>
        <h1>Standard Session</h1>

        {/**this is the button to add new lessons, visible when the session isn't published */}
        {this.state.session.ready_to_publish === true
        ?
        <div>can't add lessons to a published session right now</div>
        :  
        <Button color='primary' onClick={() => console.log('add a lesson to session id', this.state.session.id)}>Add New Lesson</Button>
        }

        {/**here's the button to create a new session */}
        <Button onclick={() => console.log('create a new session')}>Create Session</Button>

        {/**here's the place to select a session from all the sessions in the database */}
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


        {/**here's some random junk to help me see what I'm doing
         * checking to see which user it is so that you can only do all th
         * TODO check if the user is an admin to choose how to display the page
         */}
        {JSON.stringify(this.props.state.user)}
        {JSON.stringify(this.state)}

        {JSON.stringify(this.props.state.session.allSessions)}
        {JSON.stringify(this.props.state.session.slots)}
        {JSON.stringify(this.props.state.session)}


         
        

        
        
        <Grid 
        container 
        spacing={3}   
        direction={`${this.state.direction}`}
        justify={`${this.state.justify}`}
        alignItems={`${this.state.alignItems}`}>
          <Grid item xs={12}>
          {newWeekdays.map( day => (
          <Paper className={classes.paper}>
          {day.name}

          {/**these are the slots back from the database that associate with this session saturday */}
    {day.reducer.map( lesson => (
      <Box className={classes.slot} style={{height: `${lesson.length_of_lesson*10}`}}  key={lesson.id}>
        <Box>{lesson.start_of_lesson} - {lesson.end_of_lesson} 

          {/**in here I should map through the days reducer and show things with this lesson id... */}
          {day.reducer.map( slot => (
            <>
              {slot.lesson_id = lesson &&
      
              <Box id={slot.lesson_id}>
                {slot.title}: 
                {slot.expected_user == null
                ?
                <Box><Button onClick={() => console.log('fill slot id', slot.slot_id) }>Assign Volunteer</Button></Box>
                :
                <Box id={slot.expected_user}>{slot.first_name} {slot.last_name}</Box>
                } 
                
              </Box>
            
              }
            </>
          ))}
  
        </Box>
        
      </Box>
    ))}

        </Paper>
        ))}
             </Grid>

        </Grid>
        

      <Box className={classes.day}>
{/*       <StandardSessionDay session_id={this.state.session.id} day_number='0' day='Sunday' lessons={this.props.state.session.sunday}/>
      <StandardSessionDay session_id={this.state.session.id} day_number='1' day='Monday' lessons={this.props.state.session.monday}/>
      <StandardSessionDay session_id={this.state.session.id} day_number='2' day='Tuesday' lessons={this.props.state.session.tuesday}/>
      <StandardSessionDay session_id={this.state.session.id} day_number='3' day='Wednesday' lessons={this.props.state.session.wednesday}/>
      <StandardSessionDay session_id={this.state.session.id} day_number='4' day='Thursday' lessons={this.props.state.session.thursday}/>
      <StandardSessionDay session_id={this.state.session.id} day_number='5' day='Friday' lessons={this.props.state.session.friday}/>
      <StandardSessionDay session_id={this.state.session.id} day_number='6' day='Saturday' lessons={this.props.state.session.saturday}/>
      */}
      </Box>  
 </>
    )
  }
}

const mapStateToProps = state => ({
    state
  });

export default withStyles(styles)(connect(mapStateToProps)(StandardSession));
