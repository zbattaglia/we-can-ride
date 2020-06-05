import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import './Inbox.css';

import {connect} from 'react-redux';

import InboxList from './InboxList';

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

class Inbox extends Component {

  componentDidMount () {
    this.props.dispatch({type: 'FETCH_USER'})
    this.props.dispatch( {type: 'FETCH_MESSAGE' } );
  }

  render() {
    const { classes } = this.props
    return (
      <>
        <h2 id="inbox-title">Inbox</h2>
        <Paper className={classes.root}>
          <Table className={classes.table} id="inbox">
            <TableHead>
              <TableRow>
                <CustomTableCell id="from">
                  From
                </CustomTableCell>
                <CustomTableCell id="received">
                  Received
                </CustomTableCell>
                <CustomTableCell id="message">
                  Message
                </CustomTableCell>
                <CustomTableCell id="action">
                  Action
                </CustomTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.state.message.length === 0 ?
              <p>You have no messages</p>
              :
                <InboxList />
              }
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

export default connect(mapStateToProps)(withStyles(styles)(Inbox));
