import React, {Component} from 'react';
import {connect} from 'react-redux';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Paper from '@material-ui/core/Paper'
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';



const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
      },
      textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
      },
});

class PrintADay extends Component {

    state = ({
        date: moment().format('yyyy-MM-DD'),
        lessons: [],
    })

    componentDidUpdate(prevProps, prevState){
        //if a different date is selected, get the lessons for that date
        if(prevState.date !== this.state.date){
            //go get the shifts on this date
            this.props.dispatch( { type: 'GET_DAYS_SHIFTS', payload: this.state } );
        }
        //if a different set of lessons have appeared, put them in state
        if((this.props.state.shift.dayShifts) !== prevProps.state.shift.dayShifts){
            //if the reducer got filled ---
            //make an array of lesson ids and put it in state
            const lessons = this.props.state.shift.dayShifts.map(lesson => ({lesson_id:lesson.lesson_id, start_of_lesson:lesson.start_of_lesson, end_of_lesson:lesson.end_of_lesson}))
            let uniqueLessons = [];
            for(let i=0; i<lessons.length; i++){
                if(i === 0){
                    uniqueLessons.push(lessons[i]);
                }
                else if(lessons[i].lesson_id !== lessons[(i-1)].lesson_id){
                    uniqueLessons.push(lessons[i]);
                }
            }
            this.setState({lessons: uniqueLessons});
            //make a lesson array in state
        

        }
    }

    handleChange = event => {
        this.setState({ date: moment(event.target.value).format('yyyy-MM-DD') });
      };

  render() {
    const { classes } = this.props;
    return (
      <>


        <h1>Print A day!!!</h1>
        {JSON.stringify(this.props.state.shift.dayShifts)}
        <h2>state</h2>
        {JSON.stringify(this.state)}

        <form className={classes.container} noValidate>
      <TextField
        id="date"
        label="Date"
        type="date"
        value={this.state.date}
        className={classes.textField}
        onChange={(event) => this.handleChange(event)}
        InputLabelProps={{
          shrink: true,
        }}
      />
    </form>
        
        {this.state.lessons.map(lesson => <Paper key={lesson}></Paper>)}
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>

                    </TableCell>
                </TableRow>
            </TableHead>
        </Table>


        <h2 style={{textAlign: 'center'}}>Print A Day!!!</h2>
       {/*  <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <CustomTableCell className={classes.dateHeader}>
                Date 
                </CustomTableCell >
                <CustomTableCell className={classes.arrive}>
                Time To Arrive 
                </CustomTableCell >
                <CustomTableCell className={classes.role}>
                Role 
                </CustomTableCell >
                <CustomTableCell className={classes.action}>
                  Action
                </CustomTableCell >
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.state.shift.myShifts.map( (row) =>(
                <TableRow key={row.id}>
                  <CustomTableCell className={classes.tableCell}>
                    {moment(row.date).format('dddd, MMMM Do, YYYY')}
                  </CustomTableCell >
                  <CustomTableCell className={classes.tableCell}>
                  {moment(row.time_to_arrive, "HH:mm:ss").format('hh:mm a')}
                  </CustomTableCell >
                  <CustomTableCell className={classes.tableCell}>
                    {row.role}
                  </CustomTableCell >
                  <CustomTableCell className={classes.tableCell}>
                    <Button variant="contained" className={classes.button} onClick={ (event) => this.handleClick( event, row.id ) }>Give Up</Button>
                  </CustomTableCell >
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper> */

/*         <h2 style={{textAlign: 'center'}}>Sessions I've signed up for</h2> */
                /**here's where the slots I've signed up for show up(the ones that haven't started yet) */}
      {/*   <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <CustomTableCell className={classes.role}>
                Session Start Date 
                </CustomTableCell >
                <CustomTableCell className={classes.role}>
                Weekday
                </CustomTableCell >
                <CustomTableCell className={classes.role}>
                Time
                </CustomTableCell >
                <CustomTableCell className={classes.role}>
                Session Length in Weeks
                </CustomTableCell >
                <CustomTableCell className={classes.role}>
                Role
                </CustomTableCell >
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.state.shift.mySlots.map( (row) =>(
                <TableRow key={row.id}>
                  <CustomTableCell className={classes.tableCell}>
                    {moment(row.session_start_date).format('dddd, MMMM Do, YYYY')}
                  </CustomTableCell >
                  <CustomTableCell className={classes.tableCell}>
                    {row.weekday}
                  </CustomTableCell >
                  <CustomTableCell className={classes.tableCell}>
                    {moment(row.start_of_lesson, "HH:mm:ss").format('hh:mm a')} - {moment(row.end_of_lesson, "HH:mm:ss").format('hh:mm a')}
                  </CustomTableCell >
                  <CustomTableCell className={classes.tableCell}>
                    {row.length_in_weeks.days/7}
                  </CustomTableCell >
                  <CustomTableCell className={classes.tableCell}>
                    {row.title}
                  </CustomTableCell >
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>} */}
      </>
    )
  }
}

PrintADay.propTypes = {
    classes: PropTypes.object.isRequired,
  };

const mapStateToProps = state => ({
    state
  });

export default connect(mapStateToProps)(withStyles(styles)(PrintADay));
