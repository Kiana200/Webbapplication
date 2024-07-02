import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import React from 'react';
import FullCalendar from '@fullcalendar/react' // must go before plugins
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid'
import rrulePlugin from '@fullcalendar/rrule'

//Own files.
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { createActivity, deleteAnActivity, getUserActivities, showSnackbar, updateAnActivity } from '@/redux/slices/auth';

import Navbar from '@/components/Navbar';
import { Oval } from 'react-loader-spinner';
import { eventClickedData, eventDraggedData, selectionInfo } from '@/constants/types';
import { ParsedEvent } from '@/constants/interfaces';
import { AlertSeverity, ErrorMessages } from '@/constants/enums';

const Calendar = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const calendarRef = React.createRef<FullCalendar>();

    const { isAuthenticated, user, loading, events } = useAppSelector(state => state.persistedReducers.auth);

    // If not authenticated, be redirected to home page instead.
    if (typeof window !== 'undefined' && !isAuthenticated) {
        router.push('/');
    }

    const [eventData, setEventData] = useState({
        title: '',
        start: '',
        end: '', 
        repeat: 'never',
        until: ''
    });

    const [allDayEvent, setAllDayEvent] = useState(false);
    const [oldEventClicked, setEventHasBeenClicked] = useState(false);
    const [clickedEventId, setClickedEventId] = useState('');

    const {
        title,
        start,
        end,
        repeat,
        until
    } = eventData;

    useEffect(() => {
        if (dispatch && dispatch !== null && dispatch !== undefined) {
            dispatch(getUserActivities());
        }
    }, []);

    // Below is calendar interaction functions.

    /*
        Function that is called when an user clicks on an already existing event. Will show an modal view with the information about the event.
    */
    const eventClicked = (e: eventClickedData) => {
        setEventHasBeenClicked(true);

        const { Modal } = require('bootstrap');
        const activityModal = new Modal('#activityModal');

        let clickedEvent: ParsedEvent | null = null;
        for (let index = 0; index < events.length; index++) { // Go through the redux state events, which contains all events in the user's calendar. This if for getting the information about that event.
            const event: ParsedEvent = events[index];
            if(event.id == e.event.id) {
                clickedEvent = event;
                setClickedEventId(clickedEvent.id); // Save the id to be used in update api call.
                break;
            }
        }

        if(clickedEvent) {
            const repeat = clickedEvent.rrule === undefined ? 'never' : clickedEvent.rrule.freq;
            const until = clickedEvent.rrule === undefined ? '' : clickedEvent.rrule.until;

            setEventData({
                title: clickedEvent.title,
                start: clickedEvent.start,
                end: clickedEvent.end, 
                repeat: repeat,
                until: until,
            });
            setAllDayEvent(clickedEvent.allDay);

            activityModal.show();
        }
        else {
            dispatch(showSnackbar({
                severity: AlertSeverity.Error,
                open: true,
                message: ErrorMessages.ClickingOnEventMsg,
            }));
        }
    };

    /*
        Function that is called when an user drags an already existing event. Will update the event when the user lets go of the event.
    */
    const eventDragged = (e: eventDraggedData) => {
        const draggedEventInfo = e.event;

        let oldEventInfo: ParsedEvent | null = null;
        for (let index = 0; index < events.length; index++) {
            const event: ParsedEvent = events[index];
            if(event.id == e.event.id) {
                oldEventInfo = event;
                setClickedEventId(oldEventInfo.id); // Save the id to be used in update api call.
                break;
            }
        }

        if(oldEventInfo) {
            const repeat = oldEventInfo.rrule === undefined ? 'never' : oldEventInfo.rrule.freq;
            const until = oldEventInfo.rrule === undefined ? '' : oldEventInfo.rrule.until;

            const startDate = draggedEventInfo.start;
            const endDate = draggedEventInfo.end;
            const allDay = e.event.allDay

            if(startDate === null || (endDate === null && allDay === false)) {
                dispatch(showSnackbar({
                    severity: AlertSeverity.Error,
                    open: true,
                    message: ErrorMessages.DraggingEvent,
                }));
            }
            else { // Handles events that are not all day.
                if(!allDay && endDate !== null) { // Just extra check to catch if endDate is empty for some reason.
                    const duration = calcEventDuration(startDate, endDate);

                    const body = {
                        uuid: draggedEventInfo.id,
                        allDay: draggedEventInfo.allDay, 
                        start: startDate.toLocaleString(),
                        end: endDate.toLocaleString(),
                        title: draggedEventInfo.title,
                        duration: duration,
                        freq: repeat,
                        dtstart: repeat ? draggedEventInfo.start!.toLocaleString(): '',
                        until: until,
                        email: user!.email,
                    };

                    if (dispatch && dispatch !== null && dispatch !== undefined) {
                        dispatch(updateAnActivity(body));
                    }
                }
                else if(allDay) { // Handles events that goes all day.
                    const body = {
                        uuid: draggedEventInfo.id,
                        allDay: draggedEventInfo.allDay, 
                        start: startDate.toLocaleString(),
                        end: '',
                        title: draggedEventInfo.title,
                        duration: '',
                        freq: repeat,
                        dtstart: repeat ? draggedEventInfo.start!.toLocaleString(): '',
                        until: until,
                        email: user!.email,
                    };

                    if (dispatch && dispatch !== null && dispatch !== undefined) {
                        dispatch(updateAnActivity(body));
                    }
                }
            }
        }
    };

    /*
        Function that is called when an user clicks on the all day choice in the activity modal. Will update the hook setAllDayEvent with the correct value.
    */
    const handleAllDayChecked = (e: any) => {
        e.target.checked ? setAllDayEvent(true) : setAllDayEvent(false);

        clearEndDate();
    };

    /*
        Function that will create a new activity.
    */
    const createNewActivity = (e: React.FormEvent) => {
        e.preventDefault();

        const startDate = new Date(start);
        const endDate = new Date(end);

        if(endDate > startDate || allDayEvent) {
            let duration = calcEventDuration(startDate, endDate);

            const body = {
                allDay: allDayEvent, 
                start: eventData.start,
                end: eventData.end,
                title: eventData.title,
                duration: duration,
                freq: eventData.repeat,
                dtstart: repeat ? eventData.start : '',
                until: eventData.until,
                email: user!.email,
            };

            if (dispatch && dispatch !== null && dispatch !== undefined) {
                dispatch(
                    createActivity(body)
                );
            }
        }
        else { // Start date is later than end date, not ok.
            dispatch(showSnackbar({
                severity: AlertSeverity.Error,
                open: true,
                message: ErrorMessages.StartDateLaterEndDateMsg,
            }));
        }
        
        resetActivityModal();
    };

    /*
        Function that is called when an user wants to update an event.
    */
    const updateEvent = (e: React.FormEvent) => {
        e.preventDefault();

        if(clickedEventId === '') {
            dispatch(showSnackbar({
                severity: AlertSeverity.Error,
                open: true,
                message: ErrorMessages.UpdateEventMsg,
            }));
        }

        const startDate = new Date(start);
        const endDate = new Date(end);

        if(endDate > startDate || allDayEvent) {
            let duration = calcEventDuration(startDate, endDate);

            const body = {
                uuid: clickedEventId,
                allDay: allDayEvent, 
                start: eventData.start,
                end: eventData.end,
                title: eventData.title,
                duration: duration,
                freq: eventData.repeat,
                dtstart: repeat ? eventData.start : '',
                until: eventData.until,
                email: user!.email,
            };

            if (dispatch && dispatch !== null && dispatch !== undefined) {
                dispatch(updateAnActivity(body));
            }
        }
        else { // Start date is later than end date, not ok.
            dispatch(showSnackbar({
                severity: AlertSeverity.Error,
                open: true,
                message: ErrorMessages.StartDateLaterEndDateMsg,
            }));
        }
        
        resetActivityModal();
    };

    /*
        Function that is called when an user clicks on the delete button when clicked on an already existin event.
        Will delete the event from the calendar and from the backend.
    */
    const deleteEvent = (e: React.FormEvent) => {
        e.preventDefault();

        if(clickedEventId === '') {
            dispatch(showSnackbar({
                severity: AlertSeverity.Error,
                open: true,
                message: ErrorMessages.DeleteEventMsg,
            }));
        }

        const body = {
            uuid: clickedEventId,
        };

        if (dispatch && dispatch !== null && dispatch !== undefined) {
            dispatch(deleteAnActivity(body));
        }
        
        resetActivityModal();
    };

    // Below is helper functions.

    /*
        Helper function that resets the values in the activity modal to their original values.
    */
    const resetActivityModal = () => {
        setEventData({
            title: '',
            start: '',
            end: '', 
            repeat: 'never',
            until: ''
        });
        setAllDayEvent(false);
    };

    /*
        Helper function that calculates how many hours and minutes an events is and returns that information in an string.
    */
    const calcEventDuration = (startDate: Date, endDate: Date) => {
        if(!repeat) {
            const startMinutes = startDate.getMinutes()  % 60;
            const endMinutes  = endDate.getMinutes() % 60;
            const startHours = Math.floor(startDate.getHours() + (startDate.getMinutes() / 60));
            const endHours = Math.floor(endDate.getHours() + (endDate.getMinutes() / 60));
            const hours = endHours - startHours;
            const minutes = endMinutes - startMinutes;

            return hours.toString() + ':' + minutes.toString();
        }
        return ''; // Duration is not used in repeated events.
    };

    /*
        Helper function that resets the values in the activity modal to their original values.
    */
    const setStartValuesForActivityModal = (clickedDate: string) => {
        setEventData({
            title: '',
            start: clickedDate,
            end: '', 
            repeat: 'never',
            until: ''
        });
        setAllDayEvent(false);
    };

    /*
        Helper function that clears the value for the end date in the activity modal.
    */
    const clearEndDate = () => {
        setEventData({
            title: eventData.title,
            start: eventData.start,
            end: '', 
            repeat: eventData.repeat,
            until: eventData.until
        });
    };

    const onChange = (e: { target: { name: string; value: string; }; }) => setEventData({ ...eventData, [e.target.name]: e.target.value });

    /*
        Helper function that shows an modal, called activityModal, to the user.
    */
    const showActivityModal = (e: selectionInfo) => {
        setEventHasBeenClicked(false);

        const clickedDate = e.start.toLocaleString(); // Gets the date and what time span the user clicked on in the calendar.
        setStartValuesForActivityModal(clickedDate); // Sets the clicked start date for the modal and refreshes it.

        const { Modal } = require('bootstrap');
        const activityModal = new Modal('#activityModal');
        activityModal.show();
    };

    return (
        <div>
            <div className='modal fade' id='activityModal' tabIndex={-1} role='dialog' aria-labelledby='exampleModalCenterTitle' aria-hidden='true'>
                <div className='modal-dialog modal-dialog-centered' role='document'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h5 className='modal-title' id='exampleModalLongTitle'>Add new activity</h5>
                        </div>
                        <form onSubmit={oldEventClicked ? updateEvent : createNewActivity}>
                            <div className='modal-body'>
                                <div className='form-group'>
                                    <label className='form-label' htmlFor='title'>
                                        <strong>Title</strong>
                                    </label>

                                    <input
                                        className='form-control'
                                        type='text'
                                        name='title'
                                        placeholder='Title'
                                        onChange={onChange}
                                        value={title}
                                        required
                                    />
                                </div>

                                <div className='form-check form-switch mt-2'>
                                    <label className='form-label' htmlFor='allDay'>
                                        <strong>All day event</strong>
                                    </label>

                                    <input
                                        className='form-check-input'
                                        type='checkbox'
                                        name='allDay'
                                        onChange={handleAllDayChecked}
                                    />
                                </div>

                                <div className='form-group'>
                                    <label className='form-label' htmlFor='start'>
                                        <strong>Start</strong>
                                    </label>

                                    <input
                                        className='form-control'
                                        type='datetime-local'
                                        name='start'
                                        placeholder='Start'
                                        onChange={onChange}
                                        value={start}
                                        required
                                    />

                                </div>

                                <div className='form-group mt-2'>
                                    <label className='form-label' htmlFor='end'>
                                        <strong>End</strong>
                                    </label>

                                    <input
                                        className='form-control'
                                        type='datetime-local'
                                        name='end'
                                        placeholder='End'
                                        onChange={onChange}
                                        value={end}
                                        disabled={allDayEvent}
                                        required
                                    />

                                </div>

                                <div className='form-group mt-2'>
                                    <label className='form-label' htmlFor='repeat'>
                                        <strong>Repeat activity</strong>
                                    </label>
                                    <select className='form-select' name='repeat' value={repeat} onChange={onChange}>
                                        <option value='never'>Never</option>
                                        <option value='daily'>Every day</option>
                                        <option value='weekly'>Every week</option>
                                        <option value='monthly'>Every month</option>
                                        <option value='yearly'>Every year</option>
                                    </select>
                                </div>

                                {
                                    repeat !== 'never' ? (
                                        <div className='form-group mt-2'>
                                            <label className='form-label' htmlFor='until'>
                                                <strong>Until</strong>
                                            </label>

                                            <input
                                                className='form-control'
                                                type='date'
                                                name='until'
                                                onChange={onChange}
                                                value={until}
                                                required
                                            />
                                        </div>
                                    ) : 
                                    (null)
                                }
                            </div>

                            {
                                loading ? (
                                    <div className='d-flex justify-content-center align-items-center mt-5'>
                                        <Oval
                                            color='#00bfff'
                                            width={50}
                                            height={50}
                                        />
                                    </div>
                                ) : (
                                    oldEventClicked ? (
                                        <div className='container'>
                                            <div className='row'>
                                                <div className='modal-footer col-sm'>
                                                    <button type='submit' className='btn btn-primary'>Update activity</button>
                                                </div>
                                                <div className='modal-footer col-sm'>
                                                    <button onClick={deleteEvent} className='btn btn-danger'>Delete activity</button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className='modal-footer'>
                                            <button type='submit' className='btn btn-primary'>Save activity</button>
                                        </div>
                                    )
                                )
                            }
                        </form>
                    </div>
                </div>
            </div>

            <Navbar />

            <div className='container-fluid p-3 mb-2 bg-dark text-white'>
                <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, rrulePlugin]}
                    initialView='timeGridWeek'
                    headerToolbar={{
                        left: 'prev,next',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    eventBackgroundColor={'#FF4500'}
                    select={showActivityModal}
                    editable={true}
                    selectable={true}
                    height={850}
                    eventClick={eventClicked} // Called when user clicks on an event on the calendar.
                    eventChange={eventDragged} // Called after an event has been modified in some way ie dragged.
                    scrollTime={'6:00:00'} // Sets which time will be first in the calendar.
                    events={events}
                />
            </div>
        </div>
    )
};

export default Calendar;