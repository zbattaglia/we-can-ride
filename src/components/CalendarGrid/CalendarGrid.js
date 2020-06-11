import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction' // needed for dayClick
import listPlugin from '@fullcalendar/list';
import { connect } from 'react-redux';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import './CalendarGrid.css';

class CalendarGrid extends React.Component {

  calendarComponentRef = React.createRef()
  state = {
    calendarWeekends: true,
    calendarEvents: {
      events: [],
    },
    open: false,
    eventId: '',
  }

  componentDidUpdate(prevProps, prevState){
    if((this.props.state.shift.allShifts.length > 1) && prevProps.state.shift.allShifts !== this.props.state.shift.allShifts){
      this.setState({
        calendarEvents: {
          events: this.eventConstructor(this.props.state.shift.allShifts),
        }
      });
    }
  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  emptyState = () => {
    this.setState({
      eventId: '',
    });
  }

  handleSave = () => {
    let update = {
      selectUser: this.props.state.user.id,
      eventId: this.state.eventId,
    }
    this.props.dispatch({type: 'UPDATE_SHIFT', payload: update});
    this.emptyState();
    this.handleClose();
  }

  handleEventClick = (info) => {
    this.setState({eventId: Number(info.event.id)});
    this.handleOpen();
  }

  eventConstructor = (allShiftsArray) => {
    let parsedEvents = [];

    for(let event of allShiftsArray){
      let dateSum = moment(event.date).add(event.start_of_lesson, 'h');
      let parseDate = new Date(dateSum);
      if(event.assigned_user === this.props.state.user.id){
        switch (event.title) {
          case 'leader':
            parsedEvents.push({ title: 'Leader', start: parseDate, color: 'goldenrod', id: event.id});
            break;
          case 'side walker':
            parsedEvents.push({ title: 'Walker', start: parseDate, color: 'forestgreen', id: event.id});
            break;
          case 'barn aid':
            parsedEvents.push({ title: 'Barn Aid', start: parseDate, id: event.id});
            break;
          case 'feeder':
            parsedEvents.push({ title: 'Feeder', start: parseDate, color: '#6C3483', id: event.id});
            break;
          default:
            parsedEvents.push({ title: 'Unknown role', start: parseDate, id: event.id});
            break;
        }
      }
      else if(event.assigned_user === null){
        switch (event.title) {
          case 'leader':
            parsedEvents.push({ title: 'Leader', start: parseDate, color: 'crimson', id: event.id});
            break;
          case 'side walker':
            parsedEvents.push({ title: 'Walker', start: parseDate, color: 'crimson', id: event.id});
            break;
          case 'barn aid':
            parsedEvents.push({ title: 'Barn Aid', start: parseDate, color: 'crimson', id: event.id});
            break;
          case 'feeder':
            parsedEvents.push({ title: 'Feeder', start: parseDate, color: 'crimson', id: event.id});
            break;
          default:
            parsedEvents.push({ title: 'Open', start: parseDate, color: 'crimson', id: event.id});
            break;
        }
      }
    }
    return parsedEvents;
  }

  render() {
    return (
      <div className='demo-app'>
        <div className='demo-app-top'>
        </div>
        <div className='demo-app-calendar'>
          <FullCalendar
            defaultView="dayGridMonth"
            header={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
            }}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            ref={this.calendarComponentRef}
            weekends={this.state.calendarWeekends}
            events={this.state.calendarEvents}
            dateClick={this.handleDateClick}
            eventClick={this.handleEventClick}
          />
        </div>

        <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Assign Volunteer</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to pick up this shift?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  state,
});

export default connect(mapStateToProps)(CalendarGrid);