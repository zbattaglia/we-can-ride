import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class SendRegistration extends Component {

    state = {
        email: '',
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
            })
        }
    }

    render() {
        return (
            <div>
                <p>Send Registration Link to new volunteer:</p>
                <button
                    onClick={ (event) => this.handleClick( event )}>
                        Send
                </button>
                <input
                    placholder="email"
                    value={this.state.email}
                    onChange={ (event) => this.handleChange( event )}>
                </input>
            </div>
        )
    }
}


const mapStateToProps = state => ({
    state,
    classes: PropTypes.object.isRequired,
});

export default connect(mapStateToProps)(SendRegistration);