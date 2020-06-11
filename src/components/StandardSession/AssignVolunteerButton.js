
import React, {Component} from 'react';
import {connect} from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    flexGrow: 1,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  slot: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.light,
    width: '200px'
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  button: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    height: '30px',
    marginBottom: '7px',
  },
});

class AssignVolunteerButton extends Component {

  state = {
    open: false,
    volunteer: ''
  };

  componentDidMount() {
    this.props.dispatch({ type: 'FETCH_VOLUNTEERS' })
  }

  // Opens the modal
  handleClickOpen = () => {
    this.setState({ open: true });
  };

  // Conditionally closes the modal and either assigns or removes a volunteer
  handleClose = (blob) => {
    if (blob === 'create') {
      if (this.props.user_id) {
        if (this.props.name === 'Remove Yourself') {
          this.props.dispatch({
            type: 'ASSIGN_VOLUNTEER',
            payload: {
              volunteer_id: this.state.volunteer.id,
              session_id: this.props.session_id,
              slot_id: this.props.slot_id
            }
          });
        } else {
          this.props.dispatch({
            type: 'ASSIGN_VOLUNTEER',
            payload: {
              volunteer_id: this.props.user_id,
              session_id: this.props.session_id,
              slot_id: this.props.slot_id
            }
          });
        }
      }
      else {
        this.props.dispatch({
          type: 'ASSIGN_VOLUNTEER',
          payload: {
            volunteer_id: this.state.volunteer.id,
            session_id: this.props.session_id,
            slot_id: this.props.slot_id
          }
        });
      }
    }
    this.setState({ open: false });
  };

  handleInputChangeFor = propertyName => (event) => {
    this.setState({
      [propertyName]: event.target.value,
    });
  };

  render() {

    const { classes } = this.props;

    //this component has a lot of conditional rendering because it is used for both admins and users,
    //and to assign volunteers and to remove them. admins can assign and remove anyone, while users can only assign
    //and remove themselves

return (
  <div>
    <Button size="small" color='secondary' variant='contained' className={classes.button} onClick={this.handleClickOpen} >{this.props.name}</Button>
    <Dialog
  open={this.state.open}
  onClose={this.handleClose}
  aria-labelledby="assign-volunteer"
>
<DialogTitle id="assign-volunteer">{this.props.name}</DialogTitle>
  <DialogContent>
    {this.props.user_id
    ?
    <>
    <DialogContentText>
      You are {(this.props.name === 'Remove Yourself')?<>removing yourself from</>:<>accepting</> } this role for the whole session
    </DialogContentText>
    </>
    :
    <>
    <DialogContentText>
      {/* {JSON.stringify(this.state)} */}
    Choose which volunteer will be taking this role.
  </DialogContentText>
  <Autocomplete
      value={this.state.volunteer}
      id="assign-volunteer"
      options={this.props.state.volunteer.volunteer}
      getOptionLabel={(option) => option.first_name}
      style={{ width: 300 }}
      onChange={(event, value) => this.setState({volunteer: value})}
      renderInput={(params) => <TextField {...params} label="none" variant="outlined" ></TextField>}
    />
    </>
    }


  </DialogContent>
  <DialogActions>
    <Button onClick={this.handleClose} color="primary">
      Cancel
    </Button>
    <Button onClick={() => this.handleClose('create')} color="primary">
      {this.props.user_id
      ?
      <>Accept</>
      :
      <>Assign Volunteer</>
      }
    </Button>
  </DialogActions>
</Dialog>
  </div>

    return (
      <div>
        <Button size="small" color='secondary' variant='contained' className={classes.button} onClick={this.handleClickOpen} >{this.props.name}</Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="assign-volunteer"
        >
          <DialogTitle id="assign-volunteer">{this.props.name}</DialogTitle>
          <DialogContent>
            {this.props.user_id
              ?
              <>
                <DialogContentText>
                  You are {(this.props.name === 'Remove Yourself') ? <>removing yourself from</> : <>accepting</>} this role for the whole session
                </DialogContentText>
              </>
              :
              <>
                <DialogContentText>
                  Choose which volunteer will be taking this role.
                </DialogContentText>
                <Autocomplete
                  value={this.state.volunteer}
                  id="assign-volunteer"
                  options={this.props.state.volunteer.volunteer}
                  getOptionLabel={(option) => option.first_name}
                  style={{ width: 300 }}
                  onChange={(event, value) => this.setState({ volunteer: value })}
                  renderInput={(params) => <TextField {...params} label="none" variant="outlined" ></TextField>}
                />
              </>
            }
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={() => this.handleClose('create')} color="primary">
              {this.props.user_id
                ?
                <>Accept</>
                :
                <>Assign Volunteer</>
              }
            </Button>
          </DialogActions>
        </Dialog>
      </div>

    )
  }
}

AssignVolunteerButton.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  state
});

export default withStyles(styles)(connect(mapStateToProps)(AssignVolunteerButton));
