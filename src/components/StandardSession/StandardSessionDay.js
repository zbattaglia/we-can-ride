import React, {Component} from 'react';

import {connect} from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import  moment  from 'moment';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Slot from './Slot';

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
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  slot: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.light, 
    width: '200px'
  },
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
    display: 'inline-block'
  }
});



class StandardSessionDay extends Component {
    

 

  render() {
    const { classes } = this.props;
   
return (
      <>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
          
          <Paper className={classes.paper}>
          {this.props.day}

          {/**these are the slots back from the database that associate with this session saturday */}
    {this.props.lessons.map( slot => (
      <Box className={classes.slot} style={{height: `${slot.length_of_lesson*10}`}}  key={slot.id}>
        <Box>{slot.start_of_lesson} - {slot.end_of_lesson} 
        <Slot lesson_id={slot.lesson_id}/>
          {slot.expected_user == null
          ?
            <Box><Button onClick={() => console.log('fill slot id', slot.slot_id) }>Assign Volunteer</Button></Box>
          :
          <Box id={slot.expected_user}>{slot.first_name} {slot.last_name}</Box>
          }

        </Box>
        
      </Box>
    ))}

        </Paper>
        
             </Grid>

        </Grid>
        
      </>
    )
  }
}

const mapStateToProps = state => ({
    state
  });

export default withStyles(styles)(connect(mapStateToProps)(StandardSessionDay));
