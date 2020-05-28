import React, {Component} from 'react';
import {connect} from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    backgroundColor: 'whitesmoke',
    width: '80%',
  },
  textField: {
    margin: theme.spacing.unit,
    width: '48%',
  },
  title: {
    textAlign: 'center',
    width: '100%',
    textDecoration: 'underline',
    margin: 0,
    padding: 0,
  },
  formContent: {
    width: '100%',
    textAlign: 'center',
  },
  button: {
    margin: theme.spacing.unit,
  },
});

class EditVolunteer extends Component {

  // initial state for the form fields
  state = {
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    birthday: '',
    id: '',
    time_available: [ 'weekday morning', 'weekday evening' ],
    title: [ 'side walker', 'leader', 'barn aid' ],
  }

  // detects a change on an input field and updates the state accordingly
  handleChange = ( event, propName ) => {
    console.log( `Got change on ${propName}`, event.target.value );
    this.setState({
      ...this.state,
      [ propName ]: event.target.value,
    })
  };

  // componentDidUpdate checks if the current state of first name is blank and if the selectedVolunteer has been set from the database
  // if so, set the initial state to the values of the selected volunteer. (have to check if thae prev.state was blank is well, or else
  // the field will be reset when the user completely deletes the information)
  // else, fetch the selected volunteer again.
  componentDidUpdate( prevProps, prevState ){
    if( this.state.first_name === '' && prevState.first_name === '' && this.props.state.volunteer.selectedVolunteer ) {
      this.setState({
        ...this.state,
        first_name: this.props.state.volunteer.selectedVolunteer.first_name,
        last_name: this.props.state.volunteer.selectedVolunteer.last_name,
        phone: this.props.state.volunteer.selectedVolunteer.phone,
        email: this.props.state.volunteer.selectedVolunteer.email,
        birthday: this.props.state.volunteer.selectedVolunteer.birthday,
        id: this.props.state.volunteer.selectedVolunteer.id,
      })
      if(this.state.first_name !== '' && prevState.first_name !== this.state.first_name) {
        this.props.dispatch( { type: 'FETCH_SELECTED_VOLUNTEER', payload: this.props.volunteer.selectedVolunteer.id } );
      }
    }
  }

  handleClick = () => {
    // console.log( 'Got a Click', this.state );
    this.props.dispatch( { type: 'UPDATE_SELECTED_VOLUNTEER', payload: this.state } );
    this.props.history.push( '/managevolunteers');
  }

  render() {
    const { classes } = this.props;
    return (
      <>
        <p>here is the selected volunteers information:</p>
        {JSON.stringify(this.props.state.volunteer.selectedVolunteer)}
        <form className={classes.container}>
          <h2 className={classes.title}>Edit Volunteer Information</h2>
          <div className={classes.formContent}>
          <TextField
            label="First Name"
            className={classes.textField}
            value={this.state.first_name}
            onChange={ (event) => this.handleChange( event, 'first_name')}
          />
          <TextField
            label="Last Name"
            className={classes.textField}
            value={this.state.last_name}
            onChange={ (event) => this.handleChange( event, 'last_name')}
          />
          <TextField
            label="Phone Number"
            className={classes.textField}
            value={this.state.phone}
            onChange={ (event) => this.handleChange( event, 'phone')}
          />
          <TextField
            label="Email"
            className={classes.textField}
            value={this.state.email}
            onChange={ (event) => this.handleChange( event, 'email')}
          />
          <TextField
            label="Password"
            className={classes.textField}
            value="*******"
          />
          <TextField
            label="Birthday"
            className={classes.textField}
            value={this.state.birthday}
            onChange={ (event) => this.handleChange( event, 'birthday')}
          />
          <p>Availability:</p>
          <p>Skills</p>
          </div>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={this.handleClick}
          >
            UPDATE
          </Button>
        </form>
      </>
    )
  }
}


const mapStateToProps = state => ({
    state,
  });

export default connect(mapStateToProps)(withStyles(styles)(EditVolunteer));