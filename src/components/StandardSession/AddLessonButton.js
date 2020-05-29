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
    color: theme.palette.text.secondary,
    display: 'inline-block'
  }
});

//TODO use button to open a modal to add a lesson to the session

class AddLessonButton extends Component {
    


  render() {
    const { classes } = this.props;
   
return (
  <Button color='secondary' variant='contained' onClick={() => console.log('add lesson to session:', this.props.session_id)} >Add a Lesson</Button>
    )
  }
}

const mapStateToProps = state => ({
    state
  });

export default withStyles(styles)(connect(mapStateToProps)(AddLessonButton));
