import React, {Component} from 'react';

import {connect} from 'react-redux';


class ManageVolunteers extends Component {

  componentDidMount () {
    this.props.dispatch({type: 'FETCH_VOLUNTEERS'})
  }

  render() {
    return (
      <>
        <h1>Manage Volunteers</h1>
        <p>here are all the users</p>
        {JSON.stringify(this.props.state.volunteer.volunteer)}
        <p>this is the page to manage volunteers</p>
      </>
    )
  }
}


const mapStateToProps = state => ({
    state
  });

export default connect(mapStateToProps)(ManageVolunteers);
