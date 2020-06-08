import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction' // needed for dayClick
import listPlugin from '@fullcalendar/list';
import { connect } from 'react-redux';
import moment from 'moment';

import './AdminLanding.css'

class AdminLanding extends React.Component {

  calendarComponentRef = React.createRef()
  state = {
    calendarWeekends: true,
    calendarEvents: {
      events: [],
    },
  }

  componentDidMount(){
    this.props.dispatch({type: 'FETCH_ALL_SHIFTS'});

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

  render() {
    return (
      <div className='demo-app'>
        <div className='demo-app-top'>
          {/* <button onClick={ this.toggleWeekends }>toggle weekends</button>&nbsp;
          <button onClick={ this.gotoPast }>Test</button>&nbsp;
          {JSON.stringify(this.state)}
          {JSON.stringify(new Date())} */}
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
      let dateSum = moment(event.date).add(event.start_of_lesson, 'h');
      let parseDate = new Date(dateSum);
      if(event.assigned_user === null){
        switch(event.title){
          case 'leader':
            parsedEvents.push({title: 'Leader', start:parseDate, color: 'crimson'});
            break;
          case 'side walker':
            parsedEvents.push({title: 'Walker', start:parseDate, color: 'crimson'});
            break;
          default:
            parsedEvents.push({title: 'Open', start:parseDate, color: 'crimson'});
            break;
        }
      }
      else if(event.user_wants_to_trade){
        let parseName = event.first_name + ' ' + event.last_name;
        switch(event.title){
          case 'leader':
            parsedEvents.push({title: parseName, start:parseDate, color: 'gray', borderColor: 'goldenrod'});
            break;
          case 'side walker':
            parsedEvents.push({title: parseName, start:parseDate, color: 'gray', borderColor: 'forestgreen'});
            break;
          default:
            parsedEvents.push({title: parseName, start:parseDate, color: 'gray', borderColor: 'forestgreen'});
            break;
        }
      }
      else{
        let parseName = event.first_name + ' ' + event.last_name;
        switch(event.title){
          case 'leader':
            parsedEvents.push({title: parseName, start:parseDate, color: 'goldenrod'});
            break;
          case 'side walker':
            parsedEvents.push({title: parseName, start:parseDate, color: 'forestgreen'});
            break;
          default:
            parsedEvents.push({title: parseName, start:parseDate, color: 'forestgreen'});
            break;
        }
      }
    }
    return parsedEvents;
    }
    

}

const mapStateToProps = state => ({
  allShifts: state.shift.allShifts,
});

export default connect(mapStateToProps)(AdminLanding);