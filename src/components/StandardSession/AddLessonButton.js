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
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
    display: 'inline-block'
  }
});


class AddLessonButton extends Component {
  state = {
    open: false,
    time: '',
    day: '',
    length: '',
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = (blob) => {
    if(blob === 'create'){
      this.props.dispatch({ type: 'CREATE_SESSION', payload: {date: this.state.date, yearlong: this.state.yearlong, length: this.state.length}});
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
  <>
  <Button color='secondary' variant='contained' onClick={this.handleClickOpen} >Add a Lesson{this.props.session_id}</Button>
  <Dialog
  open={this.state.open}
  onClose={this.handleClose}
  aria-labelledby="create-lesson"
>
  <DialogTitle id="create-lesson">Create A Lesson</DialogTitle>
  <DialogContent>
    <DialogContentText>
      Create a new lesson
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
<TextField 
id='length'
label='Session length in weeks'
type='number'
value={this.state.length}
onChange={this.handleInputChangeFor('length')}
InputLabelProps={{
  shrink: true,
}}
/>
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
