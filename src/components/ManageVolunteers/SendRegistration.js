import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// for confirmation dialog box
import { withStyles } from '@material-ui/core/styles';
import CheckCircle from '@material-ui/icons/CheckCircle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

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
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    TextField: {
        marginLeft: 5,
    },
    title: {
        color: theme.palette.primary.light,
        textAlign: 'center',
        border: 'solid'
    },
    success: {
        color: theme.palette.primary.light,
        fontSize: '3rem',
    },
    iconContainer: {
        textAlign: 'center',
    }
  });

class SendRegistration extends Component {

    state = {
        email: '',
        open: false,
    };

    handleChange = event => {
        this.setState({
            email: event.target.value
        });
    };

    handleClick = () => {
        // console.log( 'Got click on send' );
        if( this.state.email !== '' ) {
            this.props.dispatch( { type: 'SEND_REGISTRATION', payload: this.state.email } );
            this.setState({
                email: '',
                open: true,
            })
        }
    };

    handleClose = () => {
        this.setState({
            open: false,
            error: false,
        })
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <p>Send Registration Link to new volunteer:</p>
                <Button variant='contained' color='secondary'
                    onClick={ (event) => this.handleClick( event )}>
                        Send
                </Button>
                <TextField
                    label="email"
                    marginLeft="2rem"
                    value={this.state.email}
                    onChange={ (event) => this.handleChange( event )}>
                </TextField>
                <Dialog
                    open={this.state.open}
                >
                <DialogTitle className={classes.title}>
                    Link Sent
                </DialogTitle>
                <DialogContent className={classes.iconContainer}>
                        <CheckCircle className={classes.success} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
                </Dialog>
            </div>
        )
    }
}


const mapStateToProps = state => ({
    state,
    classes: PropTypes.object.isRequired,
});

export default withStyles(styles)(connect(mapStateToProps)(SendRegistration));