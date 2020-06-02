import React, { Component } from 'react';
import { connect } from 'react-redux';

class ForgotPasswordPage extends Component {
    // set initial state for tracking value of email input and if the link has been sent or not
    state = {
        email: '',
        linkSent: false,
    };

    // detect change on email input and update state accordingly
    handleChange = ( event ) => {
        this.setState({
            ...this.state,
            email: event.target.value,
        });
    };

    // detect click on send link button. Dispatch action and set linkSent to true
    handleClick = ( event ) => {
        event.preventDefault();
        // console.log( 'Got click on send link' );
        this.props.dispatch( { type: 'SEND_PASSWORD_LINK', payload: this.state.email } );
        this.setState({
            linkSent: true,
        })
    }

  render() {
    return (
        <div>
        <form>
          <h1>Send Reset Link</h1>
          {/* conditional rendering to show the input field on page load, and a message stating email has been sent after sending */}
          {!this.state.linkSent ?
          <>
          <div>
            <label htmlFor="username">
              Email:
              <input
                type="text"
                name="username"
                onChange={ (event) => this.handleChange( event )}
                value={this.state.email}
              />
            </label>
          </div>
          <div>
            <input
              className="log-in"
              type="submit"
              name="submit"
              value="Send"
              onClick={ (event) => this.handleClick( event ) }
            />
          </div>
          </>
          :
          <>
          <p>Instructions to reset password will be sent to the email provided. If you do not get a link, or are still having issues,
              contact We Can Ride directly.
          </p>
          </>
        }
        </form>
        <center>
          <button
            type="button"
            className="link-button"
            onClick={() => {this.props.dispatch({type: 'SET_TO_LOGIN_MODE'})}}
          >
            Back to Login
          </button>
        </center>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  state,
});

export default connect(mapStateToProps)(ForgotPasswordPage);