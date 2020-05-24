import React, {Component} from 'react';

import {connect} from 'react-redux';


class FindASub extends Component {

  componentDidMount () {
    this.props.dispatch({type: 'FETCH_VOLUNTEERS'})
  }

  render() {
    return (
      <>
        <h1>Find a Sub</h1>
        <p>here are the volunteers:</p>
        {JSON.stringify(this.props.state.volunteer)}
        <p>this is the page where you can find a sub</p>
      </>
    )
  }
}


const mapStateToProps = state => ({
    state
  });

export default connect(mapStateToProps)(FindASub);
