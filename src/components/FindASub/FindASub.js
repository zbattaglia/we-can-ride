import React, {Component} from 'react';

import {connect} from 'react-redux';
import moment from 'moment';
import Email from '@material-ui/icons/Email';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import './FindASub.css';


class FindASub extends Component {

  state = {
    shift: '',
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
  }

  render() {
    return (
      <>
        <h1>Find a sub for {this.state.shift.role} on  {this.formatDate( this.state.shift.date )} at {this.state.shift.time_to_arrive}</h1>
        <p>this is the page where you can find a sub</p>
        {/* {JSON.stringify( this.props.state.myShifts ) }; */}
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
      </>
    )
  }
}

const mapStateToProps = state => ({
    state
  });

export default connect(mapStateToProps)(FindASub);

// {moment(this.state.shift.date).format('dddd, MMMM Do, YYYY')} at {this.state.shift.time_to_arrive}