import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    backgroundColor: 'whitesmoke',
    width: '80%',
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
    marginBottom: 30
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
  warning: {
    color: 'red'
  }
});

class RegisterPage extends Component {
  state = {
    username: null,
    password: null,
    confirmPassword: null,
    firstName: null,
    lastName: null,
    phoneNumber: null,
    birthday: null,
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
        createError: null,
        first_nameError: null,
        emailError: null,
        birthdayError: null,
        passwordError: null
  };

  componentDidMount() {
    this.props.dispatch( { type: 'DECODE_REGISTRATION_TOKEN', payload: this.props.match.params.token } );
  }

  registerUser = (event) => {
    event.preventDefault();
    console.log(`Dispatching register:`, this.state)
    if (this.state.username && this.state.birthday && this.state.password && (this.state.password === this.state.confirmPassword)) {
      this.props.dispatch({
        type: 'REGISTER',
        payload: {
          username: this.state.username,
          password: this.state.password,
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          phoneNumber: this.state.phoneNumber,
          birthday: this.state.birthday,
          type_of_user: 'volunteer',
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
      this.props.history.push( '/' );
    } else {
      this.setState({
        createError: 'Please fill out all information before registering'
      });    }
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

  clearError = propertyName => (event) => {
    this.setState({
      [propertyName]: null,
      createError: null,
    })
  };

  validate = propertyName => (event) => {
    console.log('error', propertyName);
    if(propertyName === 'first_nameError'){
      if(!this.state.firstName){
        this.setState({
          [propertyName]: 'you need to select a first name'
        });
      }
    }
    if(propertyName === 'emailError'){
      if(!this.state.username){
        this.setState({
          [propertyName]: 'you need to enter an email'
        });
      }
    }
    if(propertyName === 'birthdayError'){
      if(!this.state.birthday){
        this.setState({
          [propertyName]: 'you need to enter a date of birth'
        });
      }
    }
    if(propertyName === 'passwordError'){
      if(!this.state.password){
        this.setState({
          [propertyName]: 'you need to enter a password'
        });
      }
    }
    if(propertyName === 'confirmPasswordError'){
      if(!this.state.confirmPassword){
        this.setState({
          [propertyName]: 'please confirm your password'
        });
      }
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <>
          <h2
            className={classes.warning}
            role="alert"
          >
            {this.state.createError}
          </h2>
        <form className={classes.container} onSubmit={this.registerUser}>
          <div  className={classes.formContent}>
          {this.props.state.loginMode === 'register' ?
            <>
            <h1 className={classes.title}>Register as a Volunteer!</h1>
            <TextField
                required
                type="text"
                label="First Name"
                name="firstName"
                className={classes.textField}
                value={this.state.firstName}
                onBlur={this.validate('first_nameError')}
                onFocus={this.clearError('first_nameError')}
                onChange={this.handleInputChangeFor('firstName')}
              />
              {this.state.first_nameError
                 &&
                <Box className={classes.warning}>{this.state.first_nameError}</Box>
              }
              <TextField
                type="text"
                label="Last Name"
                name="lastName"
                className={classes.textField}
                value={this.state.lastName}
                onChange={this.handleInputChangeFor('lastName')}
              />
              <TextField
                required
                type="email"
                label="Email"
                name="username"
                className={classes.textField}
                onBlur={this.validate('emailError')}
                onFocus={this.clearError('emailError')}
                value={this.state.username}
                onChange={this.handleInputChangeFor('username')}
              />
              {this.state.emailError
                 &&
                  <Box className={classes.warning}>{this.state.emailError}</Box>
              }
              <TextField
                type="tel"
                label="Phone Number"
                name="phoneNumber"
                className={classes.textField}
                value={this.state.phoneNumber}
                onChange={this.handleInputChangeFor('phoneNumber')}
              />
              <TextField
                required
                type="password"
                label="Password"
                name="password"
                className={classes.textField}
                onBlur={this.validate('passwordError')}
                onFocus={this.clearError('passwordError')}
                value={this.state.password}
                onChange={this.handleInputChangeFor('password')}
              />
              {this.state.passwordError
                 &&
                <Box className={classes.warning}>{this.state.passwordError}</Box>
              }
              <TextField
                required
                type="password"
                label="Confirm Password"
                name="confirmPassword"
                className={classes.textField}
                value={this.state.confirmPassword}
                onChange={this.handleInputChangeFor('confirmPassword')}
              />
            <TextField
              required
              label="Birthday"
              id="date"
              type="date"
              value={this.state.birthday}
              onBlur={this.validate('birthdayError')}
              onFocus={this.clearError('birthdayError')}
              onChange={this.handleInputChangeFor('birthday')}
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
            />
            {this.state.birthdayError
                 &&
                <Box className={classes.warning}>{this.state.birthdayError}</Box>
              }
              <Table className={classes.table}>
                <TableHead>
                <TableRow>
                    <TableCell className={classes.tableTitle} colSpan={7}>
                      Add Availability
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.columnTitle}>Sunday</TableCell>
                    <TableCell className={classes.columnTitle}>Monday</TableCell>
                    <TableCell className={classes.columnTitle}>Tuesday</TableCell>
                    <TableCell className={classes.columnTitle}>Wednesday</TableCell>
                    <TableCell className={classes.columnTitle}>Thursday</TableCell>
                    <TableCell className={classes.columnTitle}>Friday</TableCell>
                    <TableCell className={classes.columnTitle}>Saturday</TableCell>
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
              <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={this.registerUser}
          >
            Register
          </Button>
          </>
          :
            <h1>404</h1>
          }
        </div>
      </form>
      </>
    );
  }
}

// Instead of taking everything from state, we just want the error messages.
// if you wanted you could write this code like this:
// const mapStateToProps = ({errors}) => ({ errors });
const mapStateToProps = state => ({
  errors: state.errors,
  state,
});

export default withStyles(styles)(connect(mapStateToProps)(RegisterPage));

