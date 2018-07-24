import {eventReducer, EventState} from './event/event.reducers';
import {chatReducer, ChatState} from './message/chat.reducers';

export interface AppState {
    events: EventState,
    chat: ChatState
}

export const reducers = {
    events: eventReducer,
    chat: chatReducer
};
