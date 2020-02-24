import React from 'react';
import 'moment/locale/en-gb';
import $ from 'jquery';
import 'fullcalendar/dist/fullcalendar.css';
import 'fullcalendar/dist/fullcalendar.js';
import 'fullcalendar/dist/locale/en-gb';
import AppConstants from '../../../common/AppConstants';

class CalendarPage extends React.Component {

    componentDidMount() {
        document.title = `Calendar | ${AppConstants.APP_NAME}`;
        const {calendar} = this.refs;

        $(calendar).fullCalendar({
            events: [],
            nowIndicator: true,
            header: {
                left: 'title',
                center:  'month,agendaWeek,agendaDay',
                right: 'today prevYear,prev,next,nextYear',
            },
            views: {
                listWeek: { buttonText: 'list week' },
                listMonth: { buttonText: 'list month' },
            },
            selectable: true,
            locale: 'en-gb',
            defaultView: $(window).width() > 576 ? 'agendaWeek' : 'listWeek',
            windowResize: (view) => {
                const currentView = view['name'];
                const expectedView = $(window).width() > 576 ? 'agendaWeek' : 'listWeek';
                if (currentView !== expectedView) {
                    $(calendar).fullCalendar('changeView', expectedView);
                }
            }

        });
    }

    render() {
        return <div ref='calendar' style={{paddingTop: '20px'}}/>
    }
}

export default CalendarPage;
