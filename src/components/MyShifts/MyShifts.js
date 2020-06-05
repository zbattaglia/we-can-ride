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
});

class MyShifts extends Component {

  componentDidMount () {
    this.props.dispatch({type: 'FETCH_USER'});
    this.props.dispatch({type: 'FETCH_MY_SHIFTS', payload: {user_id:this.props.state.user.id}});
  }

  handleClick = ( event, shiftId ) => {
    console.log( 'Got click to give up shift with id', shiftId)
    this.props.dispatch( { type: 'SHIFT_TO_TRADE', payload: shiftId } );
    this.props.history.push( '/findasub' );
  };

  render() {
    return (
      <>
        <h2 id="myShifts-title">My Shifts</h2>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <CustomTableCell >
                Date 
                </CustomTableCell >
                <CustomTableCell >
                Time To Arrive 
                </CustomTableCell >
                <CustomTableCell >
                Role 
                </CustomTableCell >
                <CustomTableCell >
                  Action
                </CustomTableCell >
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.state.shift.myShifts.map( (row) =>(
                <TableRow key={row.id}>
                  <CustomTableCell >
                    {moment(row.date).format('dddd, MMMM Do, YYYY')}
                  </CustomTableCell >
                  <CustomTableCell >
                    {row.time_to_arrive}
                  </CustomTableCell >
                  <CustomTableCell >
                    {row.role}
                  </CustomTableCell >
                  <CustomTableCell >
                    <button onClick={ (event) => this.handleClick( event, row.id ) }>Give Up</button>
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
