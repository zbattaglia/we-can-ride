import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: theme.spacing(1 / 4),
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
  rolesListDiv: {
    textAlign: 'center',
    listStyle: 'none',
    display: 'inline',
  },
  rolesListDiv2: {
    listStyle: 'none',
    display: 'inline',
  },
  rolesList: {
    display: 'inline',
    margin: '-15px',
  },
});

class RoleDropdown extends React.Component {

  state = {
    sidewalker: '',
    leader: '',
    barn_aid: '',
    feeder: '',
  }

  handleCheckboxChangeFor = property => (event) => {
    this.setState({
      [property]: event.target.checked,
    });
  }

  componentDidMount() {
    this.props.dispatch({ type: "GET_USER_ROLES" })
  }


  render() {
    const { classes } = this.props;
    return (
      <div className={classes.rolesListDiv}>
        {this.props.state.volunteer.userRoles.map(name => (
          <>
            {/**show the roles that apply to this volunteer */}
            {(this.props.user_id === name.user_id) &&
              <ul key={name.id} className={classes.rolesListDiv2}>
                <li className={classes.rolesList}>
                  {name.title.replace('_', ' ')}
                </li>
              </ul>
            }
          </>
        ))}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  state,
  classes: PropTypes.object.isRequired,
});

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(RoleDropdown));