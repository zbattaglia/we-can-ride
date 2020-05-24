import React, {Component} from 'react';

import {connect} from 'react-redux';


class StandardSession extends Component {

  componentDidMount () {
    this.props.dispatch({type: 'FETCH_USER'});
  }

  render() {
    return (
      <>
        <h1>Standard Session</h1>
        <p>you can look at the user to see if it's an admin to decide how to show this page</p>
        {JSON.stringify(this.props.state.user)}
        <p>this is the page to see the standard session view</p>
      </>
    )
  }
}


const mapStateToProps = state => ({
    state
  });

export default connect(mapStateToProps)(StandardSession);
