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
import Chip from '@material-ui/core/Chip';

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
  
  const names = [
    'sidewalker',
    'leader',
    'barn aid',
    'feeder',
  ];  

  class RoleDropdown extends React.Component {
    state = {
        name: [],
      };
    
      


      handleChange = event => {
        this.setState({ name: event.target.value });
        console.log('In handleChange', event.target.value);
      };
    
      handleChangeMultiple = event => {
        const { options } = event.target;
        const value = [];
        for (let i = 0, l = options.length; i < l; i += 1) {
          if (options[i].selected) {
            value.push(options[i].value);
          }
        }
        this.setState({
          name: value,
        });
      };
    
      render() {
        const { classes } = this.props;
        return (
          <div className={classes.root}>
            <FormControl className={classes.formControl}>
          <InputLabel htmlFor="select-multiple-checkbox">Role</InputLabel>
          <Select
            multiple
            value={this.state.name}
            onChange={this.handleChange}
            input={<Input id="select-multiple-checkbox" />}
            renderValue={selected => selected.join(', ')}
            MenuProps={MenuProps}
          >
            {this.props.state.volunteer.userRoles.map(name => (
              <>
              {(this.props.user_id === name.user_id) && 
                            <MenuItem key={name.id} value={name.title}>
                            <Checkbox checked={this.state.name.indexOf(name.title) > -1} />
                            <ListItemText primary={name.title} />
                          </MenuItem> }
 
              </>
              
            ))}
          </Select>
        </FormControl>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    state,
    classes: PropTypes.object.isRequired,
});

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(RoleDropdown));
