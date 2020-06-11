import React, {Component} from 'react';
import {connect} from 'react-redux';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
// for email modal
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';



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
      headerCell: {
          width: '25%',
      },
      pageTitle: {
          textAlign: 'center',
      },
      emailBody: {
          width: '100%',
      }
});

class PrintADay extends Component {
    // initial state to track data, lessons and volunteers for selected day, and email message from admin
    state = ({
        date: moment().format('yyyy-MM-DD'),
        lessons: [],
        volunteers: [],
        open: false,
        email: '',
    })
    // open email modal
    email = () => {
        this.setState({
            ...this.state,
            open: !this.state.open,
        })
    };

    // track change in text area for email message
    handleEmailChange = ( event ) => {
        this.setState({
            ...this.state,
            email: event.target.value,
        })
    }
    // when send is clicked, dispatch email message, lesson date, and volunteers
    // then close email modal
    sendEmail = () => {
        this.props.dispatch( { type: 'EMAIL_DAY', payload: {message: this.state.email, date: this.state.date, volunteers: this.state.volunteers } } );
        this.setState({
            open: !this.state.open,
            email: '',
        });
    };

    // cancel button to close email modal without sending message
    handleClose = () => {
        this.setState({
            open: !this.state.open,
            email: '',
        });   
    }

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
        document.body.innerHTML = oldPage;
        window.location.reload()
    }

  render() {
    const { classes } = this.props;
    return (
      <>


        <h1 className={classes.pageTitle}>Print A day</h1>
        <p className={classes.pageTitle}>Select a date in the calendar to view and print, or email the daily roster.</p>
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
                            <p>Unassigned</p>
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
            <h2> Sign-in: {moment(this.state.date).format('MMMM Do, YYYY')}</h2>
            <br/>
   <table>
       <tr className={classes.tableRow}>
           <th className={classes.headerCell}>Volunteer</th>
           <th className={classes.headerCell}>Time</th>
           <th className={classes.headerCell}>Role</th>
           <th className={classes.headerCell}>Initials</th>
       </tr>
       {this.props.state.shift.dayShifts.map(shift => (
           <tr>
               <td>{shift.assigned_first_name ? 
               <>{shift.assigned_first_name} {shift.assigned_user_last_initial}</>
               :
               <p>Unassigned</p>
                }
               </td>
               <td>                    {moment(shift.start_of_lesson, "HH:mm:ss").format('hh:mm a')} - {moment(shift.end_of_lesson, "HH:mm:ss").format('hh:mm a')}</td>
               <td>{shift.title}</td>
           </tr>
       ))}
   </table>
            </div>
        </div> {/**end of div to contain what will be printed */}
        <Button variant='contained' color='secondary' onClick={this.printOrder}>Print Day!</Button>
        <Button variant='contained' color='primary' onClick={this.email}>Email Roster</Button>

    {/* dialog only visible when composing email */}
    <Dialog
        open={this.state.open}
    >
        <DialogTitle className={classes.title}>Email Volunteers on {moment(this.state.date).format('MMMM Do, YYYY')}</DialogTitle>
              <DialogContent className={classes.iconContainer}>
                <TextField
                    className={classes.emailBody}
                    multiline
                    rows={6}
                    onChange={ (event) => this.handleEmailChange( event )}
                >                    
                </TextField>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleClose}>
                    Cancel
                </Button>
                <Button onClick={this.sendEmail} color="primary">
                  Send
                </Button>
              </DialogActions>
             </Dialog>
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
