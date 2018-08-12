import {Action} from '@ngrx/store';
import {Event} from '../../models';

export const enum ActionTypes {
    FETCH_EVENTS = 'FETCH_EVENTS',
    EVENTS_FETCHED = 'EVENTS_FETCHED',
    CREATE_EVENT = 'CREATE_EVENT',
    EVENT_CREATED = 'EVENT_CREATED',
    CHANGE_PARTICIPATION = 'CHANGE_PARTICIPATION',
    UPDATE_EVENT = 'UPDATE_EVENT',
    EVENT_UPDATED = 'EVENT_UPDATED',
    DELETE_EVENT = 'DELETE_EVENT',
    EVENT_DELETED = 'EVENT_DELETED'
}

export class FetchEvents implements Action {
    readonly type = ActionTypes.FETCH_EVENTS;
}

export class EventsFetched implements Action {
    readonly type = ActionTypes.EVENTS_FETCHED;
    constructor(public payload: Event[]) {}
}

export class CreateEvent implements Action {
    readonly type = ActionTypes.CREATE_EVENT;
    constructor(public payload: Event) {}
}

export class EventCreated implements Action {
    readonly type = ActionTypes.EVENT_CREATED;
    constructor(public payload: Event) {}
}

export class UpdateEvent implements Action {
    readonly type = ActionTypes.UPDATE_EVENT;
    constructor(public payload: Event) {}
}

export class EventUpdated implements Action {
    readonly type = ActionTypes.EVENT_UPDATED;
    constructor(public payload: Event) {}
}

export class DeleteEvent implements Action {
    readonly type = ActionTypes.DELETE_EVENT;
    constructor(public payload: number) {}
}

export class EventDeleted implements Action {
    readonly type = ActionTypes.EVENT_DELETED;
    constructor(public payload: number) {}
}

export class ChangeParticipation implements Action {
    readonly type = ActionTypes.CHANGE_PARTICIPATION;
    constructor(public payload: number) {}
}

export type EventActions = FetchEvents | EventsFetched | CreateEvent | EventCreated | UpdateEvent | EventUpdated |
                           DeleteEvent | EventDeleted | ChangeParticipation;
