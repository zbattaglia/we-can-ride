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
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import Checkbox from '@material-ui/core/Checkbox';


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
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  warning: {
    color: 'red'
  }
});



//TODO use button to open a modal to create a new session

class CreateSession extends Component {
    
  state = {
    open: false,
    date: null,
    yearlong: false,
    length: null,
    createError: null,
    dateError: null, 
    lengthError: null,
  };

  
  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = (blob) => {
    if(blob === 'create'){
      if(this.state.date && this.state.length){
        this.props.dispatch({ type: 'CREATE_SESSION', payload: {date: this.state.date, yearlong: this.state.yearlong, length: this.state.length}});
        this.setState({ 
          open: false,
          date: null,
          yearlong: false,
          length: null,
          createError: null,
          dateError: null, 
          lengthError: null,
        })
      } else{
          this.setState({
            createError: 'please fill out the information before attempting to submit the new sesion'
          });
        }
     
    } else{
      this.setState({ 
        open: false,
        date: null,
        yearlong: false,
        length: null,
        createError: null,
        dateError: null, 
        lengthError: null,
      });
    }

  };

  handleInputChangeFor = propertyName => (event) => {
    this.setState({
      [propertyName]: event.target.value,
    });
  };
  clearError = propertyName => (event) => {
    console.log('focus', propertyName);
    //on focus, clear the error from this input
    this.setState({
      [propertyName]: null,
      createError: null,
    })
  }

  validate = propertyName => (event) => {
    console.log('blur', propertyName);
    if(propertyName === 'lengthError'){
      if(!this.state.length){
        this.setState({
          [propertyName]: 'you need to select how long the session is'
        });
      }
    }
    if(propertyName === 'dateError'){
      if(!this.state.date){
        this.setState({
          [propertyName]: 'you need to select a start date'
        });
      }
    }
  };

  handleCheckboxChangeFor = propertyName => (event) => {
    this.setState({
      [propertyName]: event.target.checked,
    });
  };
  

  render() {
    const { classes } = this.props;
    let lengthError = this.state.lengthError;
    let dateError = this.state.dateError;
   
return (
  <div>

        <Button variant='contained' color='secondary' onClick={this.handleClickOpen}>
          Create a Session
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="create-session"
        >
          <DialogTitle id="create-session">Create A Session</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Create a new session
              {this.state.createError
              &&
              <Box className={classes.warning}>{this.state.createError}</Box>
              }
            </DialogContentText>
      <TextField
        id="date"
        label="Start Date"
        type="date"
        value={this.state.date}
        onChange={this.handleInputChangeFor('date')}
        onBlur={this.validate('dateError')}
        onFocus={this.clearError('dateError')}
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
      />
      {this.state.dateError
      &&
      <Box className={classes.warning}>{this.state.dateError}</Box>
      }
      <TextField 
        id='length'
        label='Session length in weeks'
        type='number'
        value={this.state.length}
        onChange={this.handleInputChangeFor('length')}
        onBlur={this.validate('lengthError')}
        onFocus={this.clearError('lengthError')}
        InputLabelProps={{
          shrink: true,
        }}
      />
      {this.state.lengthError
      &&
      <Box className={classes.warning}>{this.state.lengthError}</Box>
      }
        yearlong?
      <Checkbox 
        id='yearlong'
        label='yearlong'
        checked={this.state.yearlong}
        onChange={this.handleCheckboxChangeFor('yearlong')}
        value="yearlong"
      />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={() => this.handleClose('create')} color="primary">
              Create New Session
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

CreateSession.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    state
  });

export default withStyles(styles)(connect(mapStateToProps)(CreateSession));
