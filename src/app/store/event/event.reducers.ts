import {Event} from '../../models';
import * as eventActions from './event.actions';

export interface EventState {
    events: Event[];
    editedEvent: Event;
}

const defaultState: EventState = {
    events: [],
    editedEvent: null
};

export function eventReducer(state = defaultState, action: eventActions.EventActions) {
    switch (action.type) {
        case eventActions.EVENTS_FETCHED:
            return {
                ...state, events: [...state.events, ...action.payload]
            };
        case eventActions.EVENT_CREATED:
            return {
                ...state, events: [...state.events, {...action.payload}]
            };
        case eventActions.EVENT_UPDATED:
            const updatedEvents = [...state.events];
            const indexOfEvent = updatedEvents.findIndex(event => event._id === state.editedEvent._id);
            updatedEvents[indexOfEvent] = {...action.payload};
            return {
                ...state, events: updatedEvents
            };
        case eventActions.EVENT_DELETED:
            return {
                ...state, events: state.events.filter(event => event._id !== action.payload)
            };
        case eventActions.START_EDITING:
            return {
                ...state, editedEvent: state.events.find(event => event._id === action.payload)
            };
        case eventActions.CANCEL_EDITING:
            return {
                ...state, editedEvent: null
            };
        default:
            return state;
    }
}
