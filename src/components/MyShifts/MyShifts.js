import React, {Component} from 'react';

import {connect} from 'react-redux';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


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
        <h1>My Shifts</h1>
        <p>here's who I am, go find my shifts</p>
        {JSON.stringify(this.props.state.user)}
        <p>this is the page to see my list of shifts</p>
        {JSON.stringify(this.props.state.shift.myShifts)}
        {JSON.stringify(this.props)}
        <TableContainer>
          <TableHead>
            <TableRow>
              <TableCell>
               Date 
              </TableCell>
              <TableCell>
               Time To Arrive 
              </TableCell>
              <TableCell>
               Role 
              </TableCell>
              <TableCell>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.state.shift.myShifts.map( (row) =>(
              <TableRow key={row.id}>
                <TableCell>
                  {moment(row.date).format('dddd, MMMM Do, YYYY')}
                </TableCell>
                <TableCell>
                  {row.time_to_arrive}
                </TableCell>
                <TableCell>
                  {row.role}
                </TableCell>
                <TableCell>
                  <button onClick={ (event) => this.handleClick( event, row.id ) }>Give Up</button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableContainer>
      </>
    )
  }
}


const mapStateToProps = state => ({
    state
  });

export default connect(mapStateToProps)(MyShifts);
