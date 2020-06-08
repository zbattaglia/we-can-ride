import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction' // needed for dayClick
import listPlugin from '@fullcalendar/list';
import { connect } from 'react-redux';
import moment from 'moment';

import './CalendarGrid.css'

class CalendarGrid extends React.Component {

  calendarComponentRef = React.createRef()
  state = {
    calendarWeekends: true,
    calendarEvents: {
      events: [],
    },
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

  render() {
    return (
      <div className='demo-app'>
        <div className='demo-app-top'>
          {/* <button onClick={this.toggleWeekends}>toggle weekends</button>&nbsp;
          <button onClick={console.log('test')}>test</button>&nbsp; */}
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
      </div>
    )
  }

  toggleWeekends = () => {
    this.setState({ // update a property
      calendarWeekends: !this.state.calendarWeekends
    })
  }

  gotoPast = () => {
    let calendarApi = this.calendarComponentRef.current.getApi()
    calendarApi.gotoDate('2000-01-01') // call a method on the Calendar object
  }

  handleDateClick = (arg) => {
    // confirm('Would you like to add an event to ' + arg.dateStr + ' ?')
    // if (true) {
    //   this.setState({  // add new event data
    //     calendarEvents: this.state.calendarEvents.concat({ // creates a new array
    //       title: 'New Event',
    //       start: arg.date,
    //       allDay: arg.allDay
    //     })
    //   })
    // }
  }

  handleEventClick = (info) => {
    console.log('Clicked on', info.event);
  }

  eventConstructor = (allShiftsArray) => {
    let parsedEvents = [];

    for(let event of allShiftsArray){
      let dateSum = moment(event.date).add(event.start_of_lesson, 'h');
      let parseDate = new Date(dateSum);
      if(event.assigned_user === this.props.state.user.id){
        switch (event.title) {
          case 'leader':
            parsedEvents.push({ title: 'Leader', start: parseDate, color: 'goldenrod' });
            break;
          case 'side walker':
            parsedEvents.push({ title: 'Walker', start: parseDate, color: 'forestgreen' });
            break;
          default:
            parsedEvents.push({ title: this.props.state.user.first_name, start: parseDate, color: 'forestgreen' });
            break;
        }
      }
      else if(event.assigned_user === null){
        switch (event.title) {
          case 'leader':
            parsedEvents.push({ title: 'Leader', start: parseDate, color: 'crimson' });
            break;
          case 'side walker':
            parsedEvents.push({ title: 'Walker', start: parseDate, color: 'crimson' });
            break;
          default:
            parsedEvents.push({ title: 'Open', start: parseDate, color: 'crimson' });
            break;
        }
      }
    }
    return parsedEvents;
  }

}

const mapStateToProps = state => ({
  state,
});

export default connect(mapStateToProps)(CalendarGrid);