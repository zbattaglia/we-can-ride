import React, {Component} from 'react';

import {connect} from 'react-redux';


class Inbox extends Component {

  componentDidMount () {
    this.props.dispatch({type: 'FETCH_USER'})
  }

  render() {
    return (
      <>
        <h1>Inbox</h1>
        <p>here is this users information</p>
        {JSON.stringify(this.props.state.user)}
        <p>this is the page that is your inbox</p>
      </>
    )
  }
}


const mapStateToProps = state => ({
    state
  });

export default connect(mapStateToProps)(Inbox);
