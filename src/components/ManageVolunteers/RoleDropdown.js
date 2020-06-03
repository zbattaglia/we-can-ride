import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
    maxWidth: 300,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: theme.spacing.unit / 4,
  },
  noLabel: {
    marginTop: theme.spacing.unit * 3,
  },
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


class RoleDropdown extends React.Component {
  state = {
    sidewalker: '',
    leader: '',
    barn_aid: '',
    feeder: '',
  }




  handleCheckboxChangeFor = property => (event) => {
    this.setState({
      [property]: event.target.checked,
    });
    console.log('in handleCheckboxChangeFor', this.state)
  }

  // componentDidUpdate( prevProps, prevState ){
  //   console.log('in first if statement')

  //     if(this.props.state.volunteer.userRoles && prevProps.state.volunteer.userRoles !== this.props.state.volunteer.userRoles) {
  //       console.log('in second if statement')
  //       let newState = {};
  //       for(const user of this.props.state.volunteer.userRoles) {
  //         if(user.id === this.props.user_id) {
  //     for ( let userSkill of user.skill ) {
  //       newState[userSkill] = true;
  //     }
  //   }
  //     }
  //     this.setState({
  //       ...this.state,
        
  //       ...newState,
  //     })
    
  //   }
  // };
  


  render() {
    return (
        <div>
          {this.props.state.volunteer.userRoles.map(name => (
            <>
            {(this.props.user_id === name.user_id) && 
                          <ul key={name.id}>
                          <li>
                          {name.title}
                          </li>
                        </ul> 
                        }
            </>
          ))}
          </div>
      )
  }
}

const mapStateToProps = state => ({
  state,
  classes: PropTypes.object.isRequired,
});

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(RoleDropdown));
