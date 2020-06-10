import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import './ManageVolunteers.css';
import ManageVolunteersList from './ManageVolunteersList';
import SendRegistration from './SendRegistration';

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: 'lightgrey',
    color: 'black',
  },
  body: {
    fontsize: 14,
  },
}))(TableCell)

const styles = theme => ({
  root: {
    width: '99%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
});


class ManageVolunteers extends Component {

  componentDidMount () {
    this.props.dispatch({type: 'FETCH_VOLUNTEERS'});
    this.props.dispatch ({ type: 'GET_USER_ROLES'});

  }
  componentDidUpdate(prevProps) {
    //if the volunteer has changed in the redux store, get the roles for that volunteer again
    if(prevProps.state.volunteer.volunteer !== this.props.state.volunteer.volunteer)
    this.props.dispatch ({ type: 'GET_USER_ROLES'});
  }

  render() {
    const { classes } = this.props
    return (
      <>
        <h2 id="managevolunteers-title">Manage Volunteers</h2>
        <Paper className={classes.root} id="registration-content">
          <SendRegistration />
        </Paper>
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <CustomTableCell id="name">
                  Name
                </CustomTableCell>
                <CustomTableCell id="age">
                  Age
                </CustomTableCell>
                <CustomTableCell id="hours">
                  Hours
                </CustomTableCell>
                <CustomTableCell id="role">
                  Role
                </CustomTableCell>
                <CustomTableCell id="action">
                  Actions
                </CustomTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                <ManageVolunteersList history={this.props.history}/>
            </TableBody>
            </Table>
            </Paper>
      </>
    )
  }
}


const mapStateToProps = state => ({
    state,
    classes: PropTypes.object.isRequired,
  });

  export default connect(mapStateToProps)(withStyles(styles)(ManageVolunteers));
