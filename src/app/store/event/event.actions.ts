import {Action} from '@ngrx/store';
import {Event} from '../../models';

export const FETCH_EVENTS = 'FETCH_EVENTS';
export const EVENTS_FETCHED = 'EVENTS_FETCHED';

export const CREATE_EVENT = 'CREATE_EVENT';
export const EVENT_CREATED = 'EVENT_CREATED';

export const CHANGE_PARTICIPATION = 'CHANGE_PARTICIPATION';
export const UPDATE_EVENT = 'UPDATE_EVENT';
export const EVENT_UPDATED = 'EVENT_UPDATED';

export const DELETE_EVENT = 'DELETE_EVENT';
export const EVENT_DELETED = 'EVENT_DELETED';

export class FetchEvents implements Action {
    readonly type = FETCH_EVENTS;
}

export class EventsFetched implements Action {
    readonly type = EVENTS_FETCHED;
    constructor(public payload: Event[]) {}
}

export class CreateEvent implements Action {
    readonly type = CREATE_EVENT;
    constructor(public payload: Event) {}
}

export class EventCreated implements Action {
    readonly type = EVENT_CREATED;
    constructor(public payload: Event) {}
}

export class UpdateEvent implements Action {
    readonly type = UPDATE_EVENT;
    constructor(public payload: Event) {}
}

export class EventUpdated implements Action {
    readonly type = EVENT_UPDATED;
    constructor(public payload: Event) {}
}

export class DeleteEvent implements Action {
    readonly type = DELETE_EVENT;
    constructor(public payload: string) {}
}

export class EventDeleted implements Action {
    readonly type = EVENT_DELETED;
    constructor(public payload: string) {}
}

export class ChangeParticipation implements Action {
    readonly type = CHANGE_PARTICIPATION;
    constructor(public payload: string) {}
}

export type EventActions = FetchEvents | EventsFetched | CreateEvent | EventCreated | UpdateEvent | EventUpdated |
                           DeleteEvent | EventDeleted | ChangeParticipation;
