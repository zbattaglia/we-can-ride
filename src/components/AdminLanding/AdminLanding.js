import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction' // needed for dayClick
import listPlugin from '@fullcalendar/list';

import './AdminLanding.css'

export default class AdminLanding extends React.Component {

  calendarComponentRef = React.createRef()
  state = {
    calendarWeekends: true,
    calendarEvents: {
      events: [ // initial event data
      { title: 'LEADER: Mary M. WALKERS: Rina W. - Kris Z.', start: '2020-05-25T10:00:00', color: 'red' },
      { title: 'Your Shift', start: '2020-05-25T11:00:00' },
      { title: 'Your Shift', start: '2020-05-25T12:30:00' },
      { title: 'Your Shift', start: '2020-05-25T13:30:00' },
      { title: 'Your Shift', start: '2020-05-25T14:45:00', color: 'red' },
      { title: 'Your Shift', start: '2020-05-25T17:00:00' },
      { title: 'Your Shift', start: '2020-05-25T18:15:00' },
      { title: 'Your Shift', start: '2020-05-25T19:15:00', color: 'red' },
      { title: 'Your Shift', start: '2020-05-25T20:15:00' },

      { title: 'Your Shift', start: '2020-05-26T10:00:00' },
      { title: 'Your Shift', start: '2020-05-26T11:00:00' },
      { title: 'Your Shift', start: '2020-05-26T12:30:00', color: 'red' },
      { title: 'Your Shift', start: '2020-05-26T13:30:00' },
      { title: 'Your Shift', start: '2020-05-26T14:45:00' },
      { title: 'Your Shift', start: '2020-05-26T17:00:00', color: 'red' },
      { title: 'Your Shift', start: '2020-05-26T18:15:00' },
      { title: 'Your Shift', start: '2020-05-26T19:15:00' },
      { title: 'Your Shift', start: '2020-05-26T20:15:00' },

      { title: 'Your Shift', start: '2020-05-27T10:00:00' },
      { title: 'Your Shift', start: '2020-05-27T11:00:00' },
      { title: 'Your Shift', start: '2020-05-27T12:30:00' },
      { title: 'Your Shift', start: '2020-05-27T13:30:00' },
      { title: 'Your Shift', start: '2020-05-27T14:45:00' },
      { title: 'Your Shift', start: '2020-05-27T17:00:00' },
      { title: 'Your Shift', start: '2020-05-27T18:15:00' },
      { title: 'Your Shift', start: '2020-05-27T19:15:00' },
      { title: 'Your Shift', start: '2020-05-27T20:15:00' },

      { title: 'Your Shift', start: '2020-05-28T10:00:00' },
      { title: 'Your Shift', start: '2020-05-28T11:00:00' },
      { title: 'Your Shift', start: '2020-05-28T12:30:00' },
      { title: 'Your Shift', start: '2020-05-28T13:30:00' },
      { title: 'Your Shift', start: '2020-05-28T14:45:00' },
      { title: 'Your Shift', start: '2020-05-28T17:00:00', color: 'red' },
      { title: 'Your Shift', start: '2020-05-28T18:15:00' },
      { title: 'Your Shift', start: '2020-05-28T19:15:00' },
      { title: 'Your Shift', start: '2020-05-28T20:15:00', color: 'red' },

      { title: 'Your Shift', start: '2020-05-29T10:00:00' },
      { title: 'Your Shift', start: '2020-05-29T11:00:00' },
      { title: 'Your Shift', start: '2020-05-29T12:30:00' },
      { title: 'Your Shift', start: '2020-05-29T13:30:00' },
      { title: 'Your Shift', start: '2020-05-29T14:45:00' },
      { title: 'Your Shift', start: '2020-05-29T17:00:00' },
      { title: 'Your Shift', start: '2020-05-29T18:15:00', color: 'red' },
      { title: 'Your Shift', start: '2020-05-29T19:15:00' },
      { title: 'Your Shift', start: '2020-05-29T20:15:00' },
      ],
      color: 'green',
      textColor: 'white',
    },
  }

  render() {
    return (
      <div className='demo-app'>
        <div className='demo-app-top'>
          <button onClick={ this.toggleWeekends }>toggle weekends</button>&nbsp;
          <button onClick={ this.gotoPast }>go to a date in the past</button>&nbsp;
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

}