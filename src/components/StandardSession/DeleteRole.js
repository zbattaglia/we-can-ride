import React, {Component} from 'react';

import {connect} from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

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
  pointer: {
    cursor: 'default',
    justify:'flex-start',
    alignItems: 'flex-start',
    
  },
});



class DeleteRole extends Component {
    


 handleClick = () => {
   console.log('slot id of role to remove', this.props.slot_id);
   this.props.dispatch({type: 'DELETE_ROLE', payload: {slot_id: this.props.slot_id, session_id: this.props.session_id}});
 }
  render() {
    const { classes } = this.props;
   
return (
    <Box className={classes.pointer} onClick={this.handleClick}>
      <h4>
        X
      </h4>
     
    </Box>
    )
  }
}

const mapStateToProps = state => ({
    state
  });

export default withStyles(styles)(connect(mapStateToProps)(DeleteRole));
