import {Action} from '@ngrx/store';
import {Message} from '../../models';

export const enum ActionTypes {
    FETCH_HISTORY = 'FETCH_HISTORY',
    HISTORY_FETCHED = 'HISTORY_FETCHED',
    SEND_MESSAGE = 'SEND_MESSAGE',
    MESSAGE_SENT = 'MESSAGE_SENT',
    RECEIVE_MESSAGE = 'RECEIVE_MESSAGE',
    CHANGE_TARGET = 'CHANGE_TARGET',
    CLOSE_CHAT = 'CLOSE_CHAT',
    RESET_CHAT = 'RESET_CHAT'
}

export class HistoryFetched implements Action {
    readonly type = ActionTypes.HISTORY_FETCHED;
    constructor(public payload: Message[]) {}
}

export class SendMessage implements Action {
    readonly type = ActionTypes.SEND_MESSAGE;
    constructor(public payload: Message) {}
}

// This is for own messages, they are registered with a key equal to 'to' field
export class MessageSent implements Action {
    readonly type = ActionTypes.MESSAGE_SENT;
    constructor(public payload: Message) {}
}

// This is for others' messages, they are registered with a key equal to 'from' field
export class ReceiveMessage implements Action {
    readonly type = ActionTypes.RECEIVE_MESSAGE;
    constructor(public payload: Message) {}
}

export class FetchHistory implements Action {
    readonly type = ActionTypes.FETCH_HISTORY;
    constructor(public payload: string) {}
}

export class CloseChat implements Action {
    readonly type = ActionTypes.CLOSE_CHAT;
}

export class ChangeTarget implements Action {
    readonly type = ActionTypes.CHANGE_TARGET;
    constructor(public payload: string) {}
}

export class ResetChat implements Action {
    readonly type = ActionTypes.RESET_CHAT;
}

export type ChatActions = HistoryFetched | SendMessage | MessageSent | ReceiveMessage |
                          FetchHistory | ChangeTarget | CloseChat | ResetChat;
