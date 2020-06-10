import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction' // needed for dayClick
import listPlugin from '@fullcalendar/list';
import { connect } from 'react-redux';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import './AdminLanding.css'

class AdminLanding extends React.Component {

  calendarComponentRef = React.createRef()
  state = {
    calendarWeekends: true,
    calendarEvents: {
      events: [],
    },
    open: false,
    selectUser: '',
    eventId: '',
  }

  componentDidMount(){
    this.props.dispatch({type: 'FETCH_ALL_SHIFTS'});
    this.props.dispatch({type: 'FETCH_VOLUNTEERS'});
  }
  
  componentDidUpdate(prevProps, prevState){
    if((this.props.allShifts.length >1) && prevProps.allShifts !== this.props.allShifts){
      this.setState({
        calendarEvents: {
          events: this.eventConstructor(this.props.allShifts),
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

  handleChange = (propertyName) => (event) => {
    this.setState({
      [propertyName]: event.target.value,
    });
  }

  emptyState = () => {
    this.setState({
      selectUser: '',
      eventId: '',
    });
  }

  handleSave = () => {
    let update = {
      selectUser: this.state.selectUser,
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

  eventConstructor = (eventsArray) => {
      let parsedEvents = [];
    for(let event of eventsArray){
      let dateSum = moment(event.date).add(event.start_of_lesson, 'h');
      let parseDate = new Date(dateSum);
      if(event.assigned_user === null){
        switch(event.title){
          case 'leader':
            parsedEvents.push({title: 'Leader', start:parseDate, color: 'crimson', id: event.id});
            break;
          case 'side walker':
            parsedEvents.push({title: 'Walker', start:parseDate, color: 'crimson', id: event.id});
            break;
          default:
            parsedEvents.push({title: 'Open', start:parseDate, color: 'crimson', id: event.id});
            break;
        }
      }
      else if(event.user_wants_to_trade){
        let parseName = event.first_name + ' ' + event.last_name;
        switch(event.title){
          case 'leader':
            parsedEvents.push({title: parseName, start:parseDate, color: 'gray', borderColor: 'goldenrod', id: event.id});
            break;
          case 'side walker':
            parsedEvents.push({title: parseName, start:parseDate, color: 'gray', borderColor: 'forestgreen', id: event.id});
            break;
          default:
            parsedEvents.push({title: parseName, start:parseDate, color: 'gray', borderColor: 'forestgreen', id: event.id});
            break;
        }
      }
      else{
        let parseName = event.first_name + ' ' + event.last_name;
        switch(event.title){
          case 'leader':
            parsedEvents.push({title: parseName, start:parseDate, color: 'goldenrod', id: event.id});
            break;
          case 'side walker':
            parsedEvents.push({title: parseName, start:parseDate, color: 'forestgreen', id: event.id});
            break;
          default:
            parsedEvents.push({title: parseName, start:parseDate, color: 'forestgreen', id: event.id});
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
            defaultView="timeGridWeek"
            header={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
            }}
            plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin ]}
            ref={ this.calendarComponentRef }
            weekends={ this.state.calendarWeekends }
            events={ this.state.calendarEvents }
            dateClick={ this.handleDateClick }
            eventClick={this.handleEventClick}
            />
        </div>

        <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Assign volunteer</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Choose a volunteer to assign to this shift:
          </DialogContentText>
          <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={this.state.selectUser}
          onChange={this.handleChange('selectUser')}
          fullWidth
          label="Volunteer">
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {this.props.volunteer.map((v) => 
          <MenuItem key={v.id} value={v.id}>{v.first_name + ' ' + v.last_name}</MenuItem>)}
        </Select>
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
  allShifts: state.shift.allShifts,
  volunteer: state.volunteer.volunteer,
});

export default connect(mapStateToProps)(AdminLanding);