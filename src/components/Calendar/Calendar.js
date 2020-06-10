import React, { Component } from 'react';
import CalendarGrid from '../CalendarGrid/CalendarGrid';
import { connect } from 'react-redux';


class Calendar extends Component {

  componentDidMount() {
    this.props.dispatch({ type: 'FETCH_USER' });
    this.props.dispatch({ type: 'FETCH_MY_SHIFTS', payload: this.props.state.user.id });
    this.props.dispatch( { type: 'FETCH_SELECTED_VOLUNTEER', payload: this.props.state.user.id } );
    this.props.dispatch({type: 'FETCH_ALL_SHIFTS'});
    this.props.dispatch({type: 'FETCH_VOLUNTEERS'});
  }

  render() {
    return (
      <>
        <CalendarGrid />
      </>
    )
  }
}

const mapStateToProps = state => ({
  state
});

export default connect(mapStateToProps)(Calendar);
