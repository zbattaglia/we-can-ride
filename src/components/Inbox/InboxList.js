import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles, StylesProvider } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import DeleteForever from '@material-ui/icons/DeleteForever';
import Check from '@material-ui/icons/Check';
import Clear from '@material-ui/icons/Clear';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import moment from 'moment';
// for confirmation modal
import Button from '@material-ui/core/Button';
import CheckCircle from '@material-ui/icons/CheckCircle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';


import './InboxList.css';

import {connect} from 'react-redux';

const CustomTooltip = withStyles({
    tooltip: {
        color: 'white',
        backgroundColor: 'black',
        fontSize: 14,
    },
})(Tooltip);

const CustomTableCell = withStyles(theme => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontsize: 14,
    }
  }))(TableCell)
  
  const styles = theme => ({
    root: {
      width: '100%',
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
    absolute: {
        position: 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(3),
    },
    from: {
      textAlign: 'center',
      textTransform: 'capitalize',
    },
    received: {
      textAlign: 'center',
    },
    action: {
      textAlign: 'center',
    }, 
    iconContainer: {
      textAlign: 'center',
    },
    success: {
      color: theme.palette.primary.light,
      fontSize: '3rem',
   },
   title: {
    color: theme.palette.primary.light,
  },
});

class InboxList extends Component {

  state = {
    open: false,
  }

    // method to handlce click on any of the inbox buttons.
    handleClick = ( messageId, button ) => {
        // console.log( `Got a click on ${button} to ${messageId}` );
        // if button clicked is delete button, dispatch DELETE_MESSAGE action with specific message id
        if( button === 'delete' ) {
            this.props.dispatch( { type: 'DELETE_MESSAGE', payload: messageId } );
        }
        else {
            this.setState({
              open: true,
            })
            // if a message is "accepted" or "declined" send the preset message
            this.props.dispatch( { type: 'REPLY_TO_MESSAGE', payload: { id: messageId, type: button } } );
        }
    }

    handleClose = () => {
      this.setState({
        open: false,
      })
    }

  render() {
    const { classes } = this.props
    return (
    <>
    {this.props.state.message.message.map(message => {
        return <TableRow className={classes.row} key={ message.id }>
            <CustomTableCell className={classes.from}>
                {message.first_name} {message.last_name}
            </CustomTableCell>
            <CustomTableCell className={classes.received}>
                {moment(message.sent).format('dddd, MMMM Do, YYYY')}
            </CustomTableCell>
            <CustomTableCell className={classes.message}>
                {message.message}
            </CustomTableCell>
            <CustomTableCell className={classes.action}>
                <CustomTooltip title="Accept">
                    <IconButton aria-label="Accept" onClick={ (event) => this.handleClick( message.id, 'accept' )}>
                        <Check className="action"/>
                    </IconButton>
                </CustomTooltip>
                <CustomTooltip title="Decline">
                    <IconButton aria-label="Decline" onClick={ (event) => this.handleClick( message.id, 'decline' )}>
                        <Clear className="action"/>
                    </IconButton>
                </CustomTooltip>
                <CustomTooltip title="Delete">
                    <IconButton aria-label="Delete" onClick={ (event) => this.handleClick( message.id, 'delete' )}>
                        <DeleteForever  className="action"/>
                    </IconButton>
                </CustomTooltip>
            </CustomTableCell>
        </TableRow>
        })}
        <Dialog
          open={this.state.open}
        >
          <DialogTitle className={classes.title}>Replied To Message</DialogTitle>
          <DialogContent className={classes.iconContainer}>
              <CheckCircle className={classes.success} />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
         </Dialog>
    </>
    )
  }
}


const mapStateToProps = state => ({
    state,
    classes: PropTypes.object.isRequired,
  });

export default connect(mapStateToProps)(withStyles(styles)(InboxList));