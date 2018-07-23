import {eventReducer, EventState} from './event/event.reducers';

export interface AppState {
    events: EventState
}

export const reducers = {
    events: eventReducer
};
