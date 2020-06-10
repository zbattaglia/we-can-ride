import React, {Component} from 'react';

import {connect} from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CheckCircle from '@material-ui/icons/CheckCircle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
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
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  title: {
      color: theme.palette.primary.light,
  },
  success: {
      color: theme.palette.primary.light,
      fontSize: '3rem',
  },
  iconContainer: {
      textAlign: 'center',
  }
});


class SubmitEditButton extends Component {
    
  state = {
    open: false,
  };

  
  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = (blob) => {
    this.setState({
        open: false,
    })
  };

  render() {
    const { classes } = this.props;
   
    return (
        <div>

            <Button variant='contained' color='secondary' onClick={this.handleClickOpen}>
            Update
            </Button>
            <Dialog
            open={this.state.open}
            >
            <DialogTitle className={classes.title}>Updated Successfully</DialogTitle>
            <DialogContent className={classes.iconContainer}>
                <CheckCircle className={classes.success} />
            </DialogContent>
            <DialogActions>
                <Button onClick={this.handleClose} color="primary">
                Close
                </Button>
            </DialogActions>
            </Dialog>
        </div>
        )
    }
    }

const mapStateToProps = state => ({
    state
  });

export default withStyles(styles)(connect(mapStateToProps)(SubmitEditButton));
