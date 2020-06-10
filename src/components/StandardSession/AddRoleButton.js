import React, {Component} from 'react';

import {connect} from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
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
  },
  button: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    marginBottom: '7px',
  },
});



class AddRoleButton extends Component {
    

  state = {
    open: false,
    role: '',
  };
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = (blob) => {
    if(blob === 'add role'){
      this.props.dispatch({type: 'ADD_ROLE_TO_LESSON', payload: {lesson_id: this.props.lesson_id, session_id: this.props.session_id, skill_id: this.state.role}});
    }
   this.setState({ open: false });
  };

  handleClick = () => {
    console.log('add role to lesson id:', this.props.lesson_id, this.props.session_id);
  }


  render() {
    const { classes } = this.props;
   
return (
  <>
  <Button size="small" className={classes.button} color='secondary' variant='contained' onClick={this.handleClickOpen} >Add Role</Button>
  <Dialog
  open={this.state.open}
  onClose={this.handleClose}
  aria-labelledby="add-role"
>
  <DialogTitle id="add-role">Add Role</DialogTitle>
  <DialogContent>
    <DialogContentText>
     Choose a job title to add to this lesson
    </DialogContentText>
{/*     {JSON.stringify(this.state)} */}
    <Select
            value={this.state.role}
            onChange={this.handleChange}
            inputProps={{
              name: 'role',
              id: 'role',
            }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {this.props.state.skill.skills && this.props.state.skill.skills.map( item => (
              <MenuItem value={item.id}>{item.title}</MenuItem>
            ))}
          </Select>
  </DialogContent>
  <DialogActions>
    <Button onClick={this.handleClose} color="primary">
      Cancel
    </Button>
    <Button onClick={() => this.handleClose('add role')} color="primary">
      Add Role
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

export default withStyles(styles)(connect(mapStateToProps)(AddRoleButton));
