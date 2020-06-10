import React, {Component} from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import SubmitEditButton from './SubmitEditButton';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    backgroundColor: 'whitesmoke',
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: '30px',
    marginTop: '30px'
  },
  textField: {
    margin: theme.spacing(1),
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
    margin: theme.spacing(1),
  },
  tableTitle: {
    textAlign: 'center',
    textDecoration: 'underline',
    fontWeight: 'bold',
    fontSize: '1.5rem',
  },
  columnTitle: {
    textAlign: 'center',
  },
  table: {
    backgroundColor: 'whitesmoke',
    width: '83%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});

class EditProfile extends Component {
    // initial state for the form fields
    state = {
      first_name: null,
      last_name: null,
      phone: null,
      email: null,
      birthday: null,
      id: null,
      amSunday: null,
      pmSunday: null,
      amMonday: null,
      pmMonday: null,
      amTuesday: null,
      pmTuesday: null,
      amWednesday: null,
      pmWednesday: null,
      amThursday: null,
      pmThursday: null,
      amFriday: null,
      pmFriday: null,
      amSaturday: null,
      pmSaturday: null,
      notification: null, 
    }

  componentDidMount () {
    this.props.dispatch( {type: 'FETCH_SELECTED_VOLUNTEER', payload: this.props.state.user.id } )
  }
  // detects a change on an input field and updates the state accordingly
  handleChange = ( event, propName ) => {
    //console.log( `Got change on ${propName}`, event.target.value );
    this.setState({
      ...this.state,
      [ propName ]: event.target.value,
    })
  };

  handleCheckboxChangeFor = propertyName => ( event ) => {
    this.setState({
      [propertyName]: event.target.checked,
    });
  }

  // componentDidUpdate checks if the current state of first name is blank and if the selectedVolunteer has been set from the database
  // if so, set the initial state to the values of the selected volunteer. (have to check if thae prev.state was blank is well, or else
  // the field will be reset when the user completely deletes the information)
  // else, fetch the selected volunteer again.
  componentDidUpdate( prevProps, prevState ){
      // if the selected volunteer has changed at all
    
      if( prevProps.state.volunteer.selectedVolunteer !== this.props.state.volunteer.selectedVolunteer ) {
        let newState = {};
        //if the user has availabilies, get them. if not, leave them all blank
        if(this.props.state.volunteer.selectedVolunteer.availability[0]){

        }
        for ( let userAvailability of this.props.state.volunteer.selectedVolunteer.availability ) {
          newState[userAvailability] = true;
        }
        this.setState({
          ...this.state,
          first_name: this.props.state.volunteer.selectedVolunteer.first_name,
          last_name: this.props.state.volunteer.selectedVolunteer.last_name,
          phone: this.props.state.volunteer.selectedVolunteer.phone,
          email: this.props.state.volunteer.selectedVolunteer.email,
          birthday: moment(this.props.state.volunteer.selectedVolunteer.birthday).format('yyyy-MM-DD'),
          id: this.props.state.volunteer.selectedVolunteer.id,
          notification: this.props.state.volunteer.selectedVolunteer.notification,
          ...newState,
      })
    }
  };

  handleClick = () => {
    // console.log( 'Got a Click', this.state );
    this.props.dispatch( { type: 'UPDATE_SELECTED_VOLUNTEER', payload: this.state } );
  }

  render() {
    const { classes } = this.props;
    return (
      <>
        <form className={classes.container}>
          <h2 className={classes.title}>Edit Volunteer Information</h2>
          <div className={classes.formContent}>
          <TextField
            label="First Name"
            className={classes.textField}
            value={this.state.first_name}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={ (event) => this.handleChange( event, 'first_name')}
          />
          <TextField
            label="Last Name"
            className={classes.textField}
            value={this.state.last_name}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={ (event) => this.handleChange( event, 'last_name')}
          />
          <TextField
            label="Phone Number"
            className={classes.textField}
            value={this.state.phone}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={ (event) => this.handleChange( event, 'phone')}
          />
          <TextField
            label="Email"
            className={classes.textField}
            value={this.state.email}
            InputLabelProps={{
              shrink: true,
            }}
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
            InputLabelProps={{
              shrink: true,
            }}
            onChange={ (event) => this.handleChange( event, 'birthday')}
          />
          Notifications
          <Checkbox
            checked={this.state.notification}
            onChange={this.handleCheckboxChangeFor( 'notification')}
            value="notification"
          />
          </div>
          </form>
          {/* TABLE BELOW */}
            <Table  className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tableTitle} colSpan={7}>

                    {/* {JSON.stringify(this.state)} */}

                    Edit Availability
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell  className={classes.columnTitle}>Sunday</TableCell>
                  <TableCell  className={classes.columnTitle}>Monday</TableCell>
                  <TableCell  className={classes.columnTitle}>Tuesday</TableCell>
                  <TableCell  className={classes.columnTitle}>Wednesday</TableCell>
                  <TableCell  className={classes.columnTitle}>Thursday</TableCell>
                  <TableCell  className={classes.columnTitle}>Friday</TableCell>
                  <TableCell  className={classes.columnTitle}>Saturday</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                  <TableRow>
                    <TableCell>
                      AM
                        <Checkbox
                          checked={this.state.amSunday}
                          onChange={this.handleCheckboxChangeFor( 'amSunday')}
                          value="amSunday"
                        />
                      PM
                        <Checkbox
                          checked={this.state.pmSunday}
                          onChange={this.handleCheckboxChangeFor('pmSunday')}
                          value="pmSunday"
                        />
                    </TableCell>
                    <TableCell>
                      AM
                        <Checkbox
                          checked={this.state.amMonday}
                          onChange={this.handleCheckboxChangeFor('amMonday')}
                          value="amMonday"
                        />
                      PM
                        <Checkbox
                          checked={this.state.pmMonday}
                          onChange={this.handleCheckboxChangeFor('pmMonday')}
                          value="pmMonday"
                        />
                    </TableCell>
                    <TableCell>
                      AM
                        <Checkbox
                          checked={this.state.amTuesday}
                          onChange={this.handleCheckboxChangeFor('amTuesday')}
                          value="amTuesday"
                        />
                      PM
                        <Checkbox
                          checked={this.state.pmTuesday}
                          onChange={this.handleCheckboxChangeFor('pmTuesday')}
                          value="pmTuesday"
                        />
                    </TableCell>
                    <TableCell>
                      AM
                        <Checkbox
                          checked={this.state.amWednesday}
                          onChange={this.handleCheckboxChangeFor('amWednesday')}
                          value="amWednesday"
                        />
                      PM
                        <Checkbox
                          checked={this.state.pmWednesday}
                          onChange={this.handleCheckboxChangeFor('pmWednesday')}
                          value="pmWednesday"
                        />
                    </TableCell>
                    <TableCell>
                      AM
                        <Checkbox
                          checked={this.state.amThursday}
                          onChange={this.handleCheckboxChangeFor('amThursday')}
                          value="amThursday"
                        />
                      PM
                        <Checkbox
                          checked={this.state.pmThursday}
                          onChange={this.handleCheckboxChangeFor('pmThursday')}
                          value="pmThursday"
                        />
                    </TableCell>
                    <TableCell>
                      AM
                        <Checkbox
                          checked={this.state.amFriday}
                          onChange={this.handleCheckboxChangeFor('amFriday')}
                          value="amFriday"
                        />
                      PM
                        <Checkbox
                          checked={this.state.pmFriday}
                          onChange={this.handleCheckboxChangeFor('pmFriday')}
                          value="pmFriday"
                        />
                    </TableCell>
                    <TableCell>
                      AM
                        <Checkbox
                          checked={this.state.amSaturday}
                          onChange={this.handleCheckboxChangeFor('amSaturday')}
                          value="amSaturday"
                        />
                      PM
                        <Checkbox
                          checked={this.state.pmSaturday}
                          onChange={this.handleCheckboxChangeFor('pmSaturday')}
                          value="pmSaturday"
                        />
                    </TableCell>
                  </TableRow>
              </TableBody>
            </Table>
          {/* TABLE ABOVE */}
          <div onClick={this.handleClick}>
            <SubmitEditButton />
          </div>
      </>

    )
  }
}


const mapStateToProps = state => ({
    state
  });

export default connect(mapStateToProps)(withStyles(styles)(EditProfile));