import {Action} from '@ngrx/store';
import {Message} from '../../models';

export const SEND_MESSAGE = 'SEND_MESSAGE';
export const MESSAGE_SENT = 'MESSAGE_SENT';
export const RECEIVE_MESSAGE = 'RECEIVE_MESSAGE';

export const FETCH_HISTORY = 'FETCH_HISTORY';
export const HISTORY_FETCHED = 'HISTORY_FETCHED';

export const CHANGE_TARGET = 'CHANGE_TARGET';
export const CLOSE_CHAT = 'CLOSE_CHAT';
export const RESET_CHAT = 'RESET_CHAT';

export class HistoryFetched implements Action {
    readonly type = HISTORY_FETCHED;
    constructor(public payload: Message[]) {}
}

export class SendMessage implements Action {
    readonly type = SEND_MESSAGE;
    constructor(public payload: Message) {}
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

export class FetchHistory implements Action {
    readonly type = FETCH_HISTORY;
    constructor(public payload: string) {}
}

export class CloseChat implements Action {
    readonly type = CLOSE_CHAT;
}

export class ChangeTarget implements Action {
    readonly type = CHANGE_TARGET;
    constructor(public payload: string) {}
}

// Store needs a full clear when someone logs out. We wouldn't want any else to see their private message now, wouldn't we? ;)
export class ResetChat implements Action {
    readonly type = RESET_CHAT;
}

export type ChatActions = HistoryFetched | SendMessage | MessageSent | ReceiveMessage |
                          FetchHistory | ChangeTarget | CloseChat | ResetChat;
