import React, {Component} from 'react';
import {connect} from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import Email from '@material-ui/icons/Email';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
// for success modal
import Button from '@material-ui/core/Button';
import CheckCircle from '@material-ui/icons/CheckCircle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';


import './FindASub.css';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  // absolute: {
  //     position: 'absolute',
  //     bottom: theme.spacing(2),
  //     right: theme.spacing(3),
  // },
  action: {
    textAlign: 'center',
  }, 
  iconContainer: {
    textAlign: 'center',
  },
  success: {
    color: theme.palette.primary.light,
    fontSize: '3rem',
 },
 title: {
  color: theme.palette.primary.light,
  },
});


class FindASub extends Component {

  state = {
    shift: '',
    open: false,
  }

  componentDidMount () {
    this.props.dispatch({type: 'FETCH_VOLUNTEERS'})
    this.props.dispatch( {type: 'FETCH_MY_SHIFTS' } )
  }

  componentDidUpdate( prevProps, prevState ) {
    if( ( this.state.shift === '' ) && this.props.state.shift.tradeShift ) {
      this.getShift( this.props.state.shift.tradeShift );
    }
  }

  // find shift that was selected on the previous shift page
  getShift( tradeShiftId ) {
    console.log( 'looking for shift with id', tradeShiftId )
    for( const shift of this.props.state.shift.myShifts) {
      if( shift.id === tradeShiftId ) {
        this.setState({
          shift: shift,
        })
      }
    }
  };

  formatDate( date ) {
    const formattedDate = moment(date).format('dddd, MMMM Do, YYYY');
    return formattedDate;
  }

  handleClick = ( event, email, first_name, last_name ) => {
    console.log( 'Sending a message', email );
    this.props.dispatch( { type: 'SEND_MESSAGE', payload: {email, first_name, last_name, shift: this.state.shift } } );
    this.setState({
      ...this.state,
      open: true,
    })
  }

  handleClose = () => {
    this.setState({
      ...this.state,
      open: false,
    })
  }

  render() {
    const { classes } = this.props;
    return (
      <>
        <h1>Find a sub for {this.state.shift.role} on  {this.formatDate( this.state.shift.date )} at {this.state.shift.time_to_arrive}</h1>
        <ul>
          {this.props.state.volunteer.volunteer.map( (sub) => 
          <li key={sub.id} className="sub-list-item" value={sub.email}>
              <Tooltip title="Message" classname="tooltip">
                <IconButton aria-label="Accept" onClick={ (event) => this.handleClick( event, sub.email, sub.first_name, sub.last_name )}>
                  <Email className="action"/>
                </IconButton>
              </Tooltip>
            {sub.first_name} {sub.last_name[0]}
          </li>)
          }
        </ul>

        <Dialog
          open={this.state.open}
        >
          <DialogTitle className={classes.title}>Sent Request</DialogTitle>
          <DialogContent className={classes.iconContainer}>
              <CheckCircle className={classes.success} />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Close
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

export default connect(mapStateToProps)(withStyles(styles)(FindASub));