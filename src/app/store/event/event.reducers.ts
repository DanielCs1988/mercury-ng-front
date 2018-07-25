import {Event} from '../../models';
import * as eventActions from './event.actions';

export interface EventState {
    events: Event[];
    fetchedEvents: boolean;
}

const defaultState: EventState = {
    events: [],
    fetchedEvents: false
};

export function eventReducer(state = defaultState, action: eventActions.EventActions) {
    switch (action.type) {
        case eventActions.EVENTS_FETCHED:
            return {
                ...state, events: [...state.events, ...action.payload], fetchedEvents: true
            };
        case eventActions.EVENT_CREATED:
            const newEvent = action.payload;
            const events = newEvent._id !== '' ?
                [...state.events].filter(event => event._id !== '') :
                [...state.events];
            return {
                ...state, events: [...events, {...newEvent}]
            };
        case eventActions.EVENT_UPDATED:
            const updatedEvents = [...state.events];
            const indexOfEvent = updatedEvents.findIndex(event => event._id === action.payload._id);
            updatedEvents[indexOfEvent] = {...action.payload};
            return {
                ...state, events: updatedEvents
            };
        case eventActions.EVENT_DELETED:
            return {
                ...state, events: state.events.filter(event => event._id !== action.payload)
            };
        default:
            return state;
    }
}
