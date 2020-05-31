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
});



//TODO use button to open a modal to create a new session

class CreateSession extends Component {
    
  state = {
    open: false,
    date: '',
    yearlong: false,
  };

  
  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = (blob) => {
    if(blob === 'create'){
      this.props.dispatch({ type: 'CREATE_SESSION', payload: {date: this.state.date, yearlong: this.state.yearlong}});
    }
    this.setState({ open: false });
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
  

  render() {
    const { classes } = this.props;
   
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
            </DialogContentText>
      <TextField
        id="date"
        label="Start Date"
        type="date"
        value={this.state.date}
        onChange={this.handleInputChangeFor('date')}
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
      />
      {JSON.stringify(this.state)}
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
