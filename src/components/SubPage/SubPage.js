import React, {Component} from 'react';

import {connect} from 'react-redux';


class SubPage extends Component {

  componentDidMount () {
    this.props.dispatch({type: 'FETCH_USER'});
  }

  render() {
    return (
      <>
        <h1>Sub Page</h1>
        <p>here's the user info</p>
        {JSON.stringify(this.props.state.user)}
        <p>this is the sub page. I can't remember how that's different from the find a sub page, but it is</p>
      </>
    )
  }
}


const mapStateToProps = state => ({
    state
  });

export default connect(mapStateToProps)(SubPage);
