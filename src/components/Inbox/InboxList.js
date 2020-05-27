import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Delete_forever from '@material-ui/icons/DeleteForever';
import Reply from '@material-ui/icons/Reply';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

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
      marginTop: theme.spacing.unit * 3,
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
        bottom: theme.spacing.unit * 2,
        right: theme.spacing.unit * 3,
    },
  });

class InboxList extends Component {

    handleClick = ( messageId, button ) => {
        console.log( `Got a click on ${button} to ${messageId}` );
    }

  render() {
    const { classes } = this.props
    return (
    <>
    {this.props.state.message.message.map(message => {
        return <TableRow className={classes.row} key={ message.id }>
            <CustomTableCell>
                {message.first_name} {message.last_name}
            </CustomTableCell>
            <CustomTableCell>
                {message.message}
            </CustomTableCell>
            <CustomTableCell>
                <CustomTooltip title="Reply">
                    <IconButton aria-label="Reply" onClick={ (event) => this.handleClick( message.id, 'reply' )}>
                        <Reply className="action"/>
                    </IconButton>
                </CustomTooltip>
                <CustomTooltip title="Delete">
                    <IconButton aria-label="Delete" onClick={ (event) => this.handleClick( message.id, 'delete' )}>
                        <Delete_forever  className="action"/>
                    </IconButton>
                </CustomTooltip>
            </CustomTableCell>
        </TableRow>
        })}
    </>
    )
  }
}


const mapStateToProps = state => ({
    state,
    classes: PropTypes.object.isRequired,
  });

export default connect(mapStateToProps)(withStyles(styles)(InboxList));