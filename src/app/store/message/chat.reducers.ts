import {Message} from '../../models';
import * as chatActions from './chat.actions';

export interface ChatState {
    history: { [id: string]: Message[] };
    target: string;
    openChannels: string[]
}

export const defaultState: ChatState = {
    history: {},
    target: null,
    openChannels: []
};

export function chatReducer(state = defaultState, action: chatActions.ChatActions) {
    switch (action.type) {
        case chatActions.HISTORY_FETCHED:
            // Currently bound to the current target. This might change in the future!
            return {
                ...state, history: {...state.history, ...{[state.target]: action.payload} }
            };
        case chatActions.MESSAGE_SENT:
            const ownMessage = action.payload;
            // Getting rid of all the optimistic UI messages if the new message is not one itself.
            const filteredHistory = ownMessage.id !== -1 ?
                [...state.history[ownMessage.to]].filter(msg => msg.id !== -1) :
                [...state.history[ownMessage.to]];
            return {
                ...state,
                history: {
                    ...state.history,
                    [ownMessage.to]: [...filteredHistory, ownMessage]
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
        case chatActions.CHANGE_TARGET:
            // This is an O(n) check, stores should support Set structure
            return state.openChannels.includes(action.payload) ? {
                ...state, target: action.payload
            } : {
                ...state,
                openChannels: [...state.openChannels, action.payload],
                target: action.payload
            };
        case chatActions.CLOSE_CHAT:
            return {
                ...state,
                target: null
            };
        default:
            return state;
    }
}
