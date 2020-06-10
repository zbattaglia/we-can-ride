import React, {Component} from 'react';
import {connect} from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import  moment  from 'moment';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import CreateSessionButton from './CreateSessionButton';
import AddLessonButton from './AddLessonButton';
import AssignVolunteerButton from './AssignVolunteerButton';
import AddRoleButton from './AddRoleButton';
import DeleteLessonButton from './DeleteLessonButton';
import DeleteRole from './DeleteRole';
import PublishSessionButton from './PublishSessionButton';
import LetVolunteersViewButton from './LetVolunteersViewButton';


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
  lesson: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.light, 
    width: '200px',
  },
  slot: {
    margin: theme.spacing(1),
    backgroundColor: '#EEEEEE',
  },
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
    display: 'inline-block',
  },
  day: {
    color: theme.palette.secondary,
    display: 'flex',
    alignItems: 'flex-start',
  },
  deleteX: {
    color: theme.palette.text.secondary,
    display: 'inline-block',
    alignItems: 'right',
  },

  margin: {
    margin: theme.spacing(1),
  },

  title: {
    textAlign: 'center',
  },
  button: {
    height: '30px',
  }

});



class StandardSession extends Component {
  
  state = {
    session: '',
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  componentDidMount () {
    this.props.dispatch({type: 'FETCH_USER'});//know which user is looking at the standard session
    this.props.dispatch({type: 'FETCH_SESSIONS'});//get all of the sessions that the user could look at
    this.props.dispatch({type: 'GET_ROLES'});//get all the roles that could be assigned to a lesson
  }
  componentDidUpdate (prevProps, prevState) {
    //if the page just loaded, set the top session in the reducer as the current session
    if ((this.state.session === '') && this.props.state.session.allSessions[0]){
      this.setState({
        session: this.props.state.session.allSessions[0]
      })
    }
    //if we picked a different session, fetch the lessons that are associated with that session
    if(prevState.session.id !== this.state.session.id){
      this.props.dispatch({ type: 'FETCH_SESSION_LESSONS', payload: {session_id: this.state.session.id}})
    }
    //if we just added/deleted a session, set the top session in the reducer as the newest session
    if (prevProps.state.session.allSessions.length !== this.props.state.session.allSessions.length){
      this.setState({
        session: this.props.state.session.allSessions[0]
      });
    }
    //if we didn't create or delete a shift, please show the session you were showing before
    else if((prevProps.state.session.allSessions !== this.props.state.session.allSessions && this.state.session.id)){
      //find the object with the id of this.state.session.id and set that session to be the id.
      let tempSession = this.props.state.session.allSessions.find(x => x.id === this.state.session.id);
        console.log('update',JSON.stringify(this.props.state.session.allSessions.find(x => x.id === this.state.session.id)));
      this.setState({
        session: tempSession
      });
    }
  }



//this component also has a lot of conditional rendering. volunteers can see some of the parts but they
//can't see buttons or add or delete lessons or roles, and they can only change their own roles or open roles
//admins can add/delete lessons and assign volunteers, but only before the session is published. Once it's 
//published, no one can edit it.
  render() {
    const {classes} = this.props;
    //array of weekdays to show the lessons inside of
    const weekdays = [
      {name: 'Sunday', reducer: this.props.state.session.slots.sunday, number: 0},
      {name: 'Monday', reducer: this.props.state.session.slots.monday, number: 1},
      {name: "Tuesday", reducer: this.props.state.session.slots.tuesday, number: 2},
      {name: 'Wednesday', reducer: this.props.state.session.slots.wednesday, number: 3},
      {name: 'Thursday', reducer: this.props.state.session.slots.thursday, number: 4},
      {name: 'Friday', reducer: this.props.state.session.slots.friday, number: 5},
      {name: 'Saturday', reducer: this.props.state.session.slots.saturday, number: 6},
    ];
    return (
      <>
        <h2 className={classes.title}>Standard Session</h2>
        <Grid container>
          <Grid item>
            {/**this is the button to add new lessons, visible when the session isn't published, also not
             * visible to non admins
             */}
             {(this.props.state.user.type_of_user === 'admin') 
              &&
              (this.state.session.ready_to_publish === false)
              &&
              <AddLessonButton session_id={this.state.session.id}/>
             }
          </Grid>
          <Grid item>
            {/**here's the place to select a session from all the sessions in the database */}
            <InputLabel htmlFor="session">Session</InputLabel>
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
            <MenuItem key={item.id} value={item}>{moment(item.start_date).format("MMM Do YYYY")} {item.session_type}</MenuItem>
            ))}
            </Select>
          </Grid>
          <Grid item>
            {/**here's the button to create a new session */}
            {(this.props.state.user.type_of_user === 'admin') && 
            <CreateSessionButton/>
            }

          </Grid>
        </Grid>
        
            {this.state.session.length_in_weeks 
            &&
            <Box>This is a {this.state.session.length_in_weeks.days/7} week long session</Box>}
            {(this.props.state.user.type_of_user === 'admin') 
            &&
            <Box>
            {this.state.session.let_volunteer_view
              
              &&
              this.state.session.let_volunteer_view
              ?
              <Box>Volunteers can see this session</Box>
              :
              <Box>Volunteers can't see this session</Box>
              }   
              </Box>
            }
            {(this.props.state.user.type_of_user === 'admin')
            &&
            <LetVolunteersViewButton allow={this.state.session.let_volunteer_view} session_id={this.state.session.id}/>
            }

            
        <Grid 
          container
          className={classes.root}
          spacing={4}
          direction='row'
          justify='flex-start'
          alignItems='stretch'
        //   style={{minHeight: '100vh'
        // }}
          
        >
          <Grid item xs={12} className={classes.day}>
            {/**here we make the weekdays */}
            {weekdays.map( day => (
              <Paper key={day.number} className={classes.paper}>
                {day.name}
                {/**here's where we get the lessons in a day */}
                {this.props.state.session.slots.lessons && this.props.state.session.slots.lessons.map( lesson => (
                  <>
                  {(lesson.weekday === day.number) && 
                  <Box className={classes.lesson} key={lesson.id}>
                    <Box>
                      {lesson.start_of_lesson} - {lesson.end_of_lesson} {lesson.client}
                      {/**here's where we get the information about each lesson */}
                      {day.reducer && day.reducer.map( slot => (
                        <>
                        {(slot.lesson_id === lesson.lesson_id) &&
                        <Box id={slot.lesson_id} className={classes.slot}>
                          <Box>
                          <Grid container
                            direction="row"
                            justify="flex-start"
                            alignItems="flex-start"
                            spacing={24}
                          >

                            <Grid item xs className={classes.button}>
                            {slot.title.replace( '_', ' ')}:
                            </Grid>
                            <Grid justify='right' item>
                            {(this.props.state.user.type_of_user === 'admin')
                            &&
                            (this.state.session.ready_to_publish === false)
                            &&
                            <DeleteRole session_id={this.state.session.id} slot_id={slot.slot_id}/>
                            }
                            </Grid>
                          </Grid>


                          </Box>
                          {slot.expected_user == null
                          ?
                          <Box>
                            {(this.props.state.user.type_of_user === 'admin')
                            &&
                            (this.state.session.ready_to_publish === false)
                            &&
                            <AssignVolunteerButton  name='Assign A Volunteer' session_id={this.state.session.id} slot_id={slot.slot_id}/>
                            
                            }
                            {(this.props.state.user.type_of_user === 'volunteer')
                            &&
                            (this.state.session.ready_to_publish === false)
                            &&
                            <AssignVolunteerButton  name='Sign Up' user_id={this.props.state.user.id} session_id={this.state.session.id} slot_id={slot.slot_id}/>
                            
                            }
                          </Box>
                          :
                          <Box style={{backgroundColor: '#a9f097'}}id={slot.expected_user}>
                            {slot.first_name} {slot.last_name}
                            {(this.props.state.user.type_of_user === 'admin')
                            &&
                            (this.state.session.ready_to_publish === false)
                            &&
                            <AssignVolunteerButton  name='Remove A Volunteer' session_id={this.state.session.id} slot_id={slot.slot_id} />
                            }
                            {(this.props.state.user.type_of_user === 'volunteer')
                            &&
                            (this.state.session.ready_to_publish === false)
                            &&
                            (this.props.state.user.id === slot.expected_user)
                            &&
                            <AssignVolunteerButton  name='Remove Yourself' user_id={this.props.state.user.id} session_id={this.state.session.id} slot_id={slot.slot_id}/>
                            }
                          </Box>
                          }
                        </Box>
                        }
                        </>
                      ))}
                      {(this.props.state.user.type_of_user === 'admin')
                      &&
                      (this.state.session.ready_to_publish === false)
                      &&
                      <>
                      {/**here's the button to add a role */}
                      <AddRoleButton lesson_id={lesson.lesson_id} session_id={this.state.session.id}/>
                      {/**here's the button to delete a lesson */}
                      <DeleteLessonButton lesson_id={lesson.lesson_id} session_id={this.state.session.id} />
                      </>}
                    </Box>
                  </Box>}
                  </>
                ))
                }

              </Paper>
            ))}
          </Grid>
        </Grid>
        {/* TODO-- add conditional rendering for volunteer */}
        {this.state.session.ready_to_publish === false && (this.props.state.user.type_of_user === 'admin') &&
          <PublishSessionButton session_id={this.state.session.id}/>
        }

      
      </>
    )
  }
}

const mapStateToProps = state => ({
    state
  });

export default withStyles(styles)(connect(mapStateToProps)(StandardSession));
