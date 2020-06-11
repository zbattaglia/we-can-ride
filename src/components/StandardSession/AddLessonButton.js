import React, {Component} from 'react';

import {connect} from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';



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
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
    display: 'inline-block'
  },
  warning: {
    color: 'red'
  }
});

//this takes care of creating a lesson within a session. 
//the session id is passed in as props and the rest of the information is edited in the modal
class AddLessonButton extends Component {
  state = {
    open: false,
    start_time: null,
    day: null,
    duration: null,
    client: null,
    createError: null,
    start_timeError: null,
    dayError: null,
    durationError: null,
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = (blob) => {
    if(blob === 'create'){
      //if you have the required data, it can be sent to the server to create a lesson
      if(this.state.start_time && this.state.day && this.state.duration){
        this.props.dispatch({ 
          type: 'CREATE_LESSON', payload: {
            client: this.state.client, 
            day: this.state.day, 
            duration: this.state.duration, 
            start_time: this.state.start_time, 
            session_id: this.props.session_id
          }
        });
        //clear out the inputs
        this.setState({
          open: false,
          start_time: null,
          day: null,
          duration: null,
          client: null,
          createError: null,
          start_timeError: null,
          dayError: null,
          durationError: null,
        });
      }else{
        //if you don't have all the data, it will not be sent to the database, the modal will not close
        //and instead a message will appear to let you know what is needed
        this.setState({
          createError: 'Please fill out all information before creating a lesson'
        });
      } 
    }else{
      //setState
      //this is for if you click cancel or click away from the modal - the information is simply erased
      this.setState({
        open: false,
        start_time: null,
        day: null,
        duration: null,
        client: null,
        createError: null,
        start_timeError: null,
        dayError: null,
        durationError: null,
      });
    }
  };

  handleInputChangeFor = propertyName => (event) => {
    this.setState({
      [propertyName]: event.target.value,
    });
  };

  handleCheckboxChangeFor = propertyName => (event) => {
    this.setState({
      [propertyName]: event.target.checked,
    });
  };

  //this is so that errors can be cleared when you start typing in the correct box
  clearError = propertyName => (event) => {
    this.setState({
      [propertyName]: null,
      createError: null,
    })
  }

  //this checks to see if you have filled in the required fields. if you click on a required field and then
  //click away without filling it in, a warning will appear to tell you what to do
  validate = propertyName => (event) => {

    if(propertyName === 'start_timeError'){
      if(!this.state.start_time){
        this.setState({
          [propertyName]: 'you need to select a start time'
        });
      }
    }
    if(propertyName === 'dayError'){
      if(!this.state.day){
        this.setState({
          [propertyName]: 'you need to select a day of the week'
        });
      }
    }
    if(propertyName === 'durationError'){
      if(!this.state.duration){
        this.setState({
          [propertyName]: 'you need choose how long the lesson will be'
        });
      }
    }
  };

  //this array keeps the weeks so that we can send the associated dates to the database
  //the days are stored as days in january 1996 because it was a leap year and monday was on the 
  //1st of january that year, so the dates are easy to match with the days of the week
  //we store them as dates because sql can easily do math with dates and figure out the weekday from them
  render() {
    const { classes } = this.props;
    const weekdays = [
      {day: 'Monday', sqlDate: '1996-01-01'},
      {day: 'Tuesday', sqlDate: '1996-01-02'},
      {day: 'Wednesday', sqlDate: '1996-01-03'},
      {day: 'Thursday', sqlDate: '1996-01-04'},
      {day: 'Friday', sqlDate: '1996-01-05'},
      {day: 'Saturday', sqlDate: '1996-01-06'},
      {day: 'Sunday', sqlDate: '1996-01-07'}
    ]
   
return (
  <>
  <Button color='secondary' variant='contained' onClick={this.handleClickOpen} >Add a Lesson</Button>
  <Dialog
  open={this.state.open}
  onClose={this.handleClose}
  aria-labelledby="create-lesson"
>
  <DialogTitle id="create-lesson">Create A Lesson</DialogTitle>
  <DialogContent>
    <DialogContentText>
      Create a new lesson
      {this.state.createError
              &&
              <Box className={classes.warning}>{this.state.createError}</Box>
              }
    </DialogContentText>
      <Select
        label='day'
        required
        value={this.state.day}
        onChange={this.handleInputChangeFor('day')}
        onBlur={this.validate('dayError')}
        onFocus={this.clearError('dayError')}
        inputProps={{
          name: 'day',
          id: 'day',
        }}
      >
        <MenuItem value={null}>
          <em>None</em>
        </MenuItem>
        {weekdays.map( weekday => (
          <MenuItem key={weekday.day} value={weekday.sqlDate}>{weekday.day}</MenuItem>
        ))}
      </Select>
      {this.state.dayError
      &&
      <Box className={classes.warning}>{this.state.dayError}</Box>
      }

      <TextField
        label='Client'
        type='text'
        onChange={this.handleInputChangeFor('client')}
      />

      <TextField
      required
      label='Lesson Length in Minutes'
      type='number'
      InputLabelProps={{
        shrink: true,
      }}
      onChange={this.handleInputChangeFor('duration')}
      onBlur={this.validate('durationError')}
      onFocus={this.clearError('durationError')}
     />
           {this.state.durationError
      &&
      <Box className={classes.warning}>{this.state.durationError}</Box>
      }
      <TextField
        required
        id="time"
        label="Lesson Start Time"
        type="time"
        value={this.state.start_time}
        onChange={this.handleInputChangeFor('start_time')}
        onBlur={this.validate('start_timeError')}
        onFocus={this.clearError('start_timeError')}
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          step: 300, // 5 min
        }}
      />
            {this.state.start_timeError
      &&
      <Box className={classes.warning}>{this.state.start_timeError}</Box>
      }



  </DialogContent>
  <DialogActions>
    <Button onClick={this.handleClose} color="primary">
      Cancel
    </Button>
    <Button onClick={() => this.handleClose('create')} color="primary">
      Create Lesson
    </Button>
  </DialogActions>
</Dialog>
</>
  )
  }
}
AddLessonButton.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    state
  });

export default withStyles(styles)(connect(mapStateToProps)(AddLessonButton));
