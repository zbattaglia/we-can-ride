import React, {Component} from 'react';

import {connect} from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
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


class LetVolunteersViewButton extends Component {
    

  handleClick = () => {
      console.log('data to send', 'session_id:', this.props.session_id, "let_volunteer_view:", !this.props.allow)
    this.props.dispatch({ type: 'SHOW_SESSION', payload: {session_id: this.props.session_id, let_volunteer_view:!this.props.allow}});

  };

  handleClose = (task) => {
    if(task === 'delete'){
      console.log('delete', this.props.lesson_id);
      //TODO here's where we send the action
      this.props.dispatch({ type: 'DELETE_LESSON', payload: {lesson_id: this.props.lesson_id, session_id:this.props.session_id}});
    } else {
      console.log('keep')
    }
    this.setState({ open: false });
  };



  render() {
    const { classes } = this.props;
   
return (
  <>
  <Button color='secondary' variant='contained' onClick={this.handleClick}>
       {this.props.session_id}
       {this.props.allow
       ?
        <>Hide this session from volunteers</>
       :
       <>Show this session to volunteers</>
       }
  </Button>
  </>
    )
  }
}

const mapStateToProps = state => ({
    state
  });

export default withStyles(styles)(connect(mapStateToProps)(LetVolunteersViewButton));
