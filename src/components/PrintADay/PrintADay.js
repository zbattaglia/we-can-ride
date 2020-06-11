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
        volunteers: [],
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
            //make a volunteer array in state
            const volunteers = this.props.state.shift.dayShifts.map(({assigned_user}) => assigned_user)
            let uniqueVolunteers = [...new Set(volunteers)];
            this.setState({volunteers: uniqueVolunteers});
        

        }
    }

    handleChange = event => {
        this.setState({ date: moment(event.target.value).format('yyyy-MM-DD') });
      };

      printOrder = () => {
          console.log('in print order')
        const printableElements = document.getElementById('printarea').innerHTML;
        const orderHTML = '<html><head><title></title></head><body>' + printableElements + '</body></html>'
        console.log('orderHTML', orderHTML)
        const oldPage = document.body.innerHTML;
        document.body.innerHTML = orderHTML;
        window.print();
        document.body.innerHTML = oldPage
    }

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
        
        {this.state.lessons.map(lesson => (<TableBody key={lesson.lesson_id}>
                {lesson.start_of_lesson} - {lesson.end_of_lesson}
                {this.props.state.shift.dayShifts.map(shift => (
                    <>
                    {lesson.lesson_id === shift.lesson_id 
                    && 
                    <TableRow>
                        <TableCell>
                            {shift.assigned_user
                            ?
                            <>
                                {shift.assigned_first_name} {shift.assigned_user_last_initial}
                            </>
                            :
                            <>
                            </>
                            }

                        </TableCell>
                        <TableCell>{shift.title}</TableCell>
                        <TableCell style={{width:'200px'}}></TableCell>
                    </TableRow>
                    }

                </>
                ))}
            </TableBody>))}
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>

                    </TableCell>
                </TableRow>
            </TableHead>
        </Table>
        <div id='printarea' style={{display:'none'}}>
            <div style={{fontSize:'16', textAlign:'center'}}>
            {this.state.date}
            <br/>
   <table>
       <tr>
           <th>Volunteer</th>
           <th>Time</th>
           <th>Role</th>
       </tr>
       {this.props.state.shift.dayShifts.map(shift => (
           <tr>
               <td>{shift.assigned_first_name} {shift.assigned_user_last_initial}</td>
               <td>                    {moment(shift.start_of_lesson, "HH:mm:ss").format('hh:mm a')} - {moment(shift.end_of_lesson, "HH:mm:ss").format('hh:mm a')}</td>
               <td>{shift.title}</td>
           </tr>
       ))}
   </table>
            </div>
        </div> {/**end of div to contain what will be printed */}
        <Button variant='contained' color='secondary' onClick={this.printOrder}>Print Day!</Button>
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
