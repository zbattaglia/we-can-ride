import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    flexGrow: 1,
  },
});


class LetVolunteersViewButton extends Component {

  handleClick = () => {
    //clicking the button will change whether the volunteers are allowed to see the session
    this.props.dispatch({
      type: 'SHOW_SESSION',
      payload: { session_id: this.props.session_id, let_volunteer_view: !this.props.allow }
    });
  };

  render() {
    return (
      <>
        <Button color='secondary' variant='contained' onClick={this.handleClick}>
          {this.props.allow
            ?
            <>Hide this session from volunteers</>
            :
            <>Show this session to volunteers</>
          }
        </Button>
      </>
    )
  }
}

const mapStateToProps = state => ({
  state
});

export default withStyles(styles)(connect(mapStateToProps)(LetVolunteersViewButton));
