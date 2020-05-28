import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';


const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 200,
  },
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
});

class RegisterPage extends Component {
  state = {
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    birthday: '',
      amSunday: false,
      pmSunday: false,
      amMonday: false,
      pmMonday: false,
      amTuesday: false,
      pmTuesday: false,
      amWednesday: false,
      pmWednesday: false,
      amThursday: false,
      pmThursday: false,
      amFriday: false,
      pmFriday: false,
      amSaturday: false,
      pmSaturday: false,
  };

  registerUser = (event) => {
    event.preventDefault();
    console.log(`Dispatching register:`, this.state)
    if (this.state.username && (this.state.password === this.state.confirmPassword)) {
      this.props.dispatch({
        type: 'REGISTER',
        payload: {
          username: this.state.username,
          password: this.state.password,
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          phoneNumber: this.state.phoneNumber,
          birthday: this.state.birthday,
          amSunday: this.state.amSunday,
          pmSunday: this.state.pmSunday,
          amMonday: this.state.amMonday,
          pmMonday: this.state.pmMonday,
          amTuesday: this.state.amTuesday,
          pmTuesday: this.state.pmTuesday,
          amWednesday: this.state.amWednesday,
          pmWednesday: this.state.pmWednesday,
          amThursday: this.state.amThursday,
          pmThursday: this.state.pmThursday,
          amFriday: this.state.amFriday,
          pmFriday: this.state.pmFriday,
          amSaturday: this.state.amSaturday,
          pmSaturday: this.state.pmSaturday
        },
      });
    } else {
      this.props.dispatch({ type: 'REGISTRATION_INPUT_ERROR' });
    }
  }; // end registerUser

  handleInputChangeFor = propertyName => (event) => {
    this.setState({
      [propertyName]: event.target.value,
    });
  };

  handleCheckboxChangeFor = propertyName => (event) => {
    this.setState({
      [propertyName]: event.target.checked,
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        {this.props.errors.registrationMessage && (
          <h2
            className="alert"
            role="alert"
          >
            {this.props.errors.registrationMessage}
          </h2>
        )}
        <form onSubmit={this.registerUser}>
          <h1>Register as a Volunteer!</h1>
          <div>
            <TextField
              type="email"
              label="Email"
              name="username"
              value={this.state.username}
              onChange={this.handleInputChangeFor('username')}
            />
          </div>
          <div>
            <TextField
              type="password"
              label="Password"
              name="password"
              value={this.state.password}
              onChange={this.handleInputChangeFor('password')}
            />
          </div>
          <div>
            <TextField
              type="password"
              label="Confirm Password"
              name="confirmPassword"
              value={this.state.confirmPassword}
              onChange={this.handleInputChangeFor('confirmPassword')}
            />
          </div>
          <div>
            <TextField
              type="text"
              label="First Name"
              name="firstName"
              value={this.state.firstName}
              onChange={this.handleInputChangeFor('firstName')}
            />
          </div>
          <div>
            <TextField
              type="text"
              label="Last Name"
              name="lastName"
              value={this.state.lastName}
              onChange={this.handleInputChangeFor('lastName')}
            />
          </div>
          <div>
            <TextField
              type="tel"
              label="Phone Number"
              name="phoneNumber"
              value={this.state.phoneNumber}
              onChange={this.handleInputChangeFor('phoneNumber')}
            />
          </div>
          <div>
          <TextField
            id="date"
            label="Date of Birth"
            type="date"
            value={this.state.birthday}
            onChange={this.handleInputChangeFor('birthday')}
            InputLabelProps={{
              shrink: false,
            }}
          />
          </div>
          <div>
          <Paper>
            <Table  className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Sunday</TableCell>
                  <TableCell>Monday</TableCell>
                  <TableCell>Tuesday</TableCell>
                  <TableCell>Wednesday</TableCell>
                  <TableCell>Thursday</TableCell>
                  <TableCell>Friday</TableCell>
                  <TableCell>Saturday</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                  <TableRow>
                    <TableCell>
                      AM
                        <Checkbox
                          checked={this.state.amSunday}
                          onChange={this.handleCheckboxChangeFor('amSunday')}
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
          </Paper>
          </div>
          <div>
            <input
              className="register"
              type="submit"
              name="submit"
              value="Register"
            />
          </div>

        </form>
        {/* <center>
          <button
            type="button"
            className="link-button"
            onClick={() => {this.props.dispatch({type: 'SET_TO_LOGIN_MODE'})}}
          >
            Login
          </button>
        </center> */}
      </div>
    );
  }
}

// Instead of taking everything from state, we just want the error messages.
// if you wanted you could write this code like this:
// const mapStateToProps = ({errors}) => ({ errors });
const mapStateToProps = state => ({
  errors: state.errors,
});

export default withStyles(styles)(connect(mapStateToProps)(RegisterPage));

