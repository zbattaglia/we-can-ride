import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import {connect} from 'react-redux';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Paper from '@material-ui/core/Paper'
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import moment from 'moment';

import './MyShifts.css';

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
  dateHeader: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  arrive: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  role: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  action: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  tableCell: {
    textAlign: 'center',
  },
  shiftTableContainer: {
    width: '60%',
    margin: 'auto',
  }
});

class MyShifts extends Component {

  componentDidMount () {
    this.props.dispatch({type: 'FETCH_USER'});
    this.props.dispatch({type: 'FETCH_MY_SHIFTS', payload: {user_id:this.props.state.user.id}});
    this.props.dispatch({type: 'FETCH_MY_SLOTS', payload: {user_id:this.props.state.user.id}});
  }

  handleClick = ( event, shiftId ) => {
    console.log( 'Got click to give up shift with id', shiftId)
    this.props.dispatch( { type: 'SHIFT_TO_TRADE', payload: shiftId } );
    this.props.history.push( '/findasub' );
  };


  render() {
    const { classes } = this.props;
    return (
      <>
        <h2 id="myShifts-title">My Shifts</h2>
        <Paper className={classes.shiftTableContainer}>
          <Table>
            <TableHead>
              <TableRow>
                <CustomTableCell className={classes.dateHeader}>
                Date 
                </CustomTableCell >
                <CustomTableCell className={classes.arrive}>
                Time To Arrive 
                </CustomTableCell >
                <CustomTableCell className={classes.role}>
                Role 
                </CustomTableCell >
                <CustomTableCell className={classes.action}>
                  Action
                </CustomTableCell >
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.state.shift.myShifts.map( (row) =>(
                <TableRow key={row.id}>
                  <CustomTableCell className={classes.tableCell}>
                    {moment(row.date).format('dddd, MMMM Do, YYYY')}
                  </CustomTableCell >
                  <CustomTableCell >
                  {moment(row.time_to_arrive, "HH:mm:ss").format('hh:mm a')}
                  </CustomTableCell >
                  <CustomTableCell className={classes.tableCell}>
                    {row.role}
                  </CustomTableCell >
                  <CustomTableCell className={classes.tableCell}>
                    <button onClick={ (event) => this.handleClick( event, row.id ) }>Give Up</button>
                  </CustomTableCell >
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>

        <br/>
                {/**here's where the slots I've signed up for show up(the ones that haven't started yet) */}
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <CustomTableCell >
                Session Start Date 
                </CustomTableCell >
                <CustomTableCell >
                Weekday
                </CustomTableCell >
                <CustomTableCell >
                Time
                </CustomTableCell >
                <CustomTableCell >
                Session Length in Weeks
                </CustomTableCell >
                <CustomTableCell >
                Role
                </CustomTableCell >
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.state.shift.mySlots.map( (row) =>(
                <TableRow key={row.id}>
                  <CustomTableCell >
                    {moment(row.session_start_date).format('dddd, MMMM Do, YYYY')}
                  </CustomTableCell >
                  <CustomTableCell >
                    {row.weekday}
                  </CustomTableCell >
                  <CustomTableCell >
                    {moment(row.start_of_lesson, "HH:mm:ss").format('hh:mm a')} - {moment(row.end_of_lesson, "HH:mm:ss").format('hh:mm a')}
                  </CustomTableCell >
                  <CustomTableCell >
                    {row.length_in_weeks.days/7}
                  </CustomTableCell >
                  <CustomTableCell >
                    {row.title}
                  </CustomTableCell >
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </>
    )
  }
}


const mapStateToProps = state => ({
    state
  });

export default connect(mapStateToProps)(withStyles(styles)(MyShifts));
