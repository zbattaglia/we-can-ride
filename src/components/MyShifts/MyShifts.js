import React, {Component} from 'react';

import {connect} from 'react-redux';


class MyShifts extends Component {

  componentDidMount () {
    this.props.dispatch({type: 'FETCH_USER'})
  }

  render() {
    return (
      <>
        <h1>My Shifts</h1>
        <p>here's who I am, go find my shifts</p>
        {JSON.stringify(this.props.state.user)}
        <p>this is the page to see my list of shifts</p>
      </>
    )
  }
}


const mapStateToProps = state => ({
    state
  });

export default connect(mapStateToProps)(MyShifts);
