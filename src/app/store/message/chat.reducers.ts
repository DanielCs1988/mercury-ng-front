import {Message} from '../../models';
import * as chatActions from './chat.actions';

export interface ChatState {
    history: { [id: string]: Message[] };
    target: string;
}

export const defaultState: ChatState = {
    history: {},
    target: null
};

export function chatReducer(state = defaultState, action: chatActions.ChatActions) {
    switch (action.type) {
        case chatActions.HISTORY_FETCHED:
            return {
                ...state, history: {...state.history, ...{[action.payload.id]: action.payload.messages} }
            };
        case chatActions.MESSAGE_SENT:
            const ownMessage = action.payload;
            return {
                ...state,
                history: {
                    ...state.history,
                    [ownMessage.to]: [...state.history[ownMessage.to], ownMessage]
                }
            };
        case chatActions.RECEIVE_MESSAGE:
            const message = action.payload;
            return {
                ...state,
                history: {
                    ...state.history,
                    [message.from]: [...state.history[message.from], message]
                }
            };
        default:
            return state;
    }
}
