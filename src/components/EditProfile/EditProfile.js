import React, {Component} from 'react';

import {connect} from 'react-redux';


class EditProfile extends Component {

  componentDidMount () {
    this.props.dispatch({type: 'FETCH_USER'})
  }

  render() {
    return (
      <>
        <h1>EditProfile</h1>
        <p>here is the users information</p>
        {JSON.stringify(this.props.state.user)}
        <p>this is the page where you can edit your profile</p>
      </>
    )
  }
}


const mapStateToProps = state => ({
    state
  });

export default connect(mapStateToProps)(EditProfile);
