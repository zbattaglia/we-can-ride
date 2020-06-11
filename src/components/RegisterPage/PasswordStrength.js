import React from "react";
import TextField from '@material-ui/core/TextField';

import "./passwordstrength.css";

const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
const mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");

class PasswordStrength extends React.Component {

    constructor() {
        super();
        this.state = {
            allowedDispatch: false,
            backgroundColor: "#4285F4"
        }
        this.analyze = this.analyze.bind(this);
    };

//TODO Max - is this actually being used?

    analyze(event) {
        if(strongRegex.test(event.target.value)) {
            this.setState({ allowedDispatch: true, backgroundColor: "#0F9D58" });
        } else if(mediumRegex.test(event.target.value)) {
            this.setState({ allowedDispatch: true, backgroundColor: "#F4B400" });
        } else {
            this.setState({ backgroundColor: "#DB4437" });
        }
    };

    confirm(event) {
        //console.log('matches');
    }

    render() {

        return (
            <div style={{ backgroundColor: this.state.backgroundColor }}>
                <div>
                <TextField
                label="Password"
                type="password"
                name="password"
                value={this.state.password}
                onChange={this.analyze}/>
                </div>
                <div>
                <TextField
                label="Confirm Password"
                type="password"
                name="password"
                value={this.state.confirmPassword}
                onChange={this.confirm}/>
                </div>
            </div>
        );
    }

}

export default PasswordStrength;