import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction' // needed for dayClick
import listPlugin from '@fullcalendar/list';
import { connect } from 'react-redux';

import './AdminLanding.css'

class AdminLanding extends React.Component {

  calendarComponentRef = React.createRef()
  state = {
    calendarWeekends: true,
    calendarEvents: {
      events: [],
      color: 'green',
      textColor: 'white',
    },
  }

  componentDidMount(){
    this.props.dispatch({type: 'FETCH_ALL_SHIFTS'});
    this.setState({
      calendarEvents: {
        events: this.eventConstructor(this.props.allShifts),
      }
    });
  }

  render() {
    return (
      <div className='demo-app'>
        <div className='demo-app-top'>
          <button onClick={ this.toggleWeekends }>toggle weekends</button>&nbsp;
          <button onClick={ this.gotoPast }>Test</button>&nbsp;
          {JSON.stringify(this.props.allShifts)}
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

  eventConstructor = (eventsArray) => {
    let parsedEvents = [];
    for(let event of eventsArray){
      if(event.assigned_user === null || event.user_wants_to_trade){
        let obj = {title: 'Open spot(s)', start:event.date, color: 'red'}
        parsedEvents.push(obj);
      }
      else{
        let obj = {title: event.assigned_user, start:event.date}
        parsedEvents.push(obj);
      }
    }
    return parsedEvents;
  }

}

const mapStateToProps = state => ({
  allShifts: state.shift.allShifts,
});

export default connect(mapStateToProps)(AdminLanding);