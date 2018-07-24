import {Action} from '@ngrx/store';
import {Message} from '../../models';

export const FETCH_HISTORY = 'FETCH_HISTORY';
export const HISTORY_FETCHED = 'HISTORY_FETCHED';

export const SEND_MESSAGE = 'SEND_MESSAGE';
export const MESSAGE_SENT = 'MESSAGE_SENT';
export const RECEIVE_MESSAGE = 'RECEIVE_MESSAGE';

export class FetchHistory implements Action {
    readonly type = FETCH_HISTORY;
    constructor(public payload: string) {}
}

export class HistoryFetched implements Action {
    readonly type = HISTORY_FETCHED;
    constructor(public payload: {id: string, messages: Message[]}) {}
}

export class SendMessage implements Action {
    readonly type = SEND_MESSAGE;
    constructor(public payload: string) {}
}

// This is for own messages, they are registered with a key equal to 'to' field
export class MessageSent implements Action {
    readonly type = MESSAGE_SENT;
    constructor(public payload: Message) {}
}

// This is for others' messages, they are registered with a key equal to 'from' field
export class ReceiveMessage implements Action {
    readonly type = RECEIVE_MESSAGE;
    constructor(public payload: Message) {}
}

export type ChatActions = FetchHistory | HistoryFetched | SendMessage | MessageSent | ReceiveMessage;
