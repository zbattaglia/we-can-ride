import React, {Component} from 'react';

import {connect} from 'react-redux';


class Calendar extends Component {

  render() {
    return (
      <>
        <h1>Calendar</h1>
        <p>this is the page where the calendar will be</p>
      </>
    )
  }
}

const mapStateToProps = state => ({
    state
  });

export default connect(mapStateToProps)(Calendar);
