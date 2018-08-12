import {Event} from '../../models';
import {ActionTypes, EventActions} from './event.actions';

export interface EventState {
    events: Event[];
    fetchedEvents: boolean;
}

export const defaultState: EventState = {
    events: [],
    fetchedEvents: false
};

export function eventReducer(state = defaultState, action: EventActions) {
    switch (action.type) {
        case ActionTypes.EVENTS_FETCHED:
            return {
                ...state, events: [...state.events, ...action.payload], fetchedEvents: true
            };
        case ActionTypes.EVENT_CREATED:
            const newEvent = action.payload;
            const events = newEvent.id !== -1 ?
                [...state.events].filter(event => event.id !== -1) :
                [...state.events];
            return {
                ...state, events: [...events, {...newEvent}]
            };
        case ActionTypes.EVENT_UPDATED:
            const updatedEvents = [...state.events];
            const indexOfEvent = updatedEvents.findIndex(event => event.id === action.payload.id);
            updatedEvents[indexOfEvent] = {...action.payload};
            return {
                ...state, events: updatedEvents
            };
        case ActionTypes.EVENT_DELETED:
            return {
                ...state, events: state.events.filter(event => event.id !== action.payload)
            };
        default:
            return state;
    }
}
