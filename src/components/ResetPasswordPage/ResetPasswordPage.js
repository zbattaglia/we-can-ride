import React, { Component } from 'react';
import { connect } from 'react-redux';

class ResetPasswordPage extends Component {

    // state to track new / confirm new password
    state = {
        password: '',
        confirmPassword: '',
        submitted: false,
    };

    // on page load decode token to see if it is valid
    componentDidMount(){
        // console.log( 'Trying to access reset password page' );
        // console.log( 'accessing request paramaters', this.props.match.params.id, this.props.match.params.token );
        // dispatch an action with user id and web token from url paramaters
        this.props.dispatch( { type: 'DECODE_RESET_TOKEN', payload: { id: this.props.match.params.id, token: this.props.match.params.token } } );
    };

    // detect change on password inputs and update state
    handleChange = ( event, propName ) => {
        // console.log( 'Got change on', propName, event.target.value );
        this.setState({
            ...this.state,
            [ propName ]: event.target.value,
        });
    };

    // handleClick to reset password on button click
    handleClick = ( event ) => {
        event.preventDefault();
        // if password and confirm password match, dispatch new password and reset state
        if( this.state.password === this.state.confirmPassword && this.state.password !== '') {
            // console.log( 'Resetting password to', this.state.password );
            this.props.dispatch( { type: 'RESET_PASSWORD', payload: { id: this.props.state.user, password: this.state.password } } );
            this.props.dispatch( { type: 'UNSET_USER' } );
            this.setState({
                password: '',
                confirmPassword: '',
                submitted: true,
            })
        }
        else if (this.state.password === '') {
            alert( 'Please provide a new password' );
        }
        else {
            alert( 'Passwords do not match' );
        }
    }

  render() {
    return (
        <div>
        {/*
        conditional rendering to show reset password page if token is decoded,
        else show a 404 error
        */}
        {this.props.state.user ?
            <>
            <form>
            {!this.state.submitted ?
            <>
            <h1>Reset Password</h1>
            <div>
                <label htmlFor="password">
                New Password:
                <input
                    type="text"
                    name="password"
                    onChange={ (event) => this.handleChange( event, 'password' )}
                    value={this.state.password}
                />
                </label>
                <label htmlFor="password">
                Confirm Password:
                <input
                    type="text"
                    name="confirmPassword"
                    onChange={ (event) => this.handleChange( event, 'confirmPassword' )}
                    value={this.state.confirmPassword}
                />
                </label>
            </div>
            <div>
                <input
                className="log-in"
                type="submit"
                name="submit"
                value="Reset"
                onClick={ (event) => this.handleClick( event )}
                />
            </div>
            </>
            :
            <p>Password updated successfully</p>
            }
            </form>
            </>
            :
            <h1>404</h1>
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  state,
});

export default connect(mapStateToProps)(ResetPasswordPage);