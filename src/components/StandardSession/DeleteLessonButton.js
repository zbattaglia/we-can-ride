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
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    flexGrow: 1,
  },


});

//TODO use button to open a modal to add a lesson to the session

class DeleteLessonButton extends Component {
    
  state = {
    open: false,
  };

  handleClickOpen = () => {
    console.log('delete lesson:', this.props.lesson_id);
    this.setState({ open: true });
  };

  handleClose = (task) => {
    if(task === 'delete'){
      console.log('delete')
    } else {
      console.log('keep')
    }
    this.setState({ open: false });
  };



  render() {
    const { classes } = this.props;
   
return (
  <>
  <Button color='secondary' variant='contained' onClick={this.handleClickOpen} >Delete a Lesson</Button>
  <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              This will delete this lesson and all associated roles
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.handleClose('keep')} color="primary">
              Cancel
            </Button>
            <Button onClick={() => this.handleClose('delete')} color="primary" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
  </>
    )
  }
}

const mapStateToProps = state => ({
    state
  });

export default withStyles(styles)(connect(mapStateToProps)(DeleteLessonButton));
