import {Injectable, OnDestroy} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../app.reducers';
import {Actions, Effect} from '@ngrx/effects';
import * as actions from './event.actions';
import {map, switchMap, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {UserService} from '../../services/user.service';
import {EVENTS_ENDPOINT} from '../../utils/endpoints';
import {Subscription} from 'rxjs';
import {User} from '../../models';
import {Router} from '@angular/router';

@Injectable()
export class EventEffects implements OnDestroy {

    @Effect()
    fetchEvents = this.actions$.ofType(actions.FETCH_EVENTS).pipe(
        switchMap(() => this.http.get<any>(EVENTS_ENDPOINT)),
        map(events => {
            const mappedEvents = events.map(event => {
                event.organizer = this.users.get(event.organizer);
                event.participants = event.participants.map(participant => this.users.get(participant));
                return event;
            });
            return {
                type: actions.EVENTS_FETCHED,
                payload: mappedEvents
            }
        })
    );

    @Effect()
    createEvent = this.actions$.ofType(actions.CREATE_EVENT).pipe(
        switchMap((action: actions.CreateEvent) => {
            return this.http.post<any>(EVENTS_ENDPOINT, action.payload);
        }),
        map(event => ({ ...event, organizer: this.users.get(event.organizer) })),
        map(event => ({
            type: actions.EVENT_CREATED,
            payload: event
        }))
    );

    @Effect()
    updateEvent = this.actions$.ofType(actions.UPDATE_EVENT).pipe(
        switchMap((action: actions.UpdateEvent) => {
            const event = action.payload;
            return this.http.put<any>(`${EVENTS_ENDPOINT}/${event._id}`, event);
        }),
        map(event => ({
            ...event,
            organizer: this.users.get(event.organizer),
            participants: event.participants.map(participant => this.users.get(participant))
        })),
        map(event => ({
            type: actions.EVENT_UPDATED,
            payload: event
        }))
    );

    @Effect()
    deleteEvent = this.actions$.ofType(actions.DELETE_EVENT).pipe(
        switchMap((action: actions.DeleteEvent) => {
            const id = action.payload;
            return this.http.delete<any>(`${EVENTS_ENDPOINT}/${id}`);
        }),
        tap(() => this.router.navigate(['/events'])),
        map(event => ({
            type: actions.EVENT_DELETED,
            payload: event._id
        }))
    );

    @Effect()
    changeParticipation = this.actions$.ofType(actions.CHANGE_PARTICIPATION).pipe(
        switchMap((action: actions.ChangeParticipation) => {
            const id = action.payload;
            return this.http.post<any>(`${EVENTS_ENDPOINT}/${id}`, {});
        }),
        map(event => ({
            ...event,
            organizer: this.users.get(event.organizer),
            participants: event.participants.map(participant => this.users.get(participant))
        })),
        map(event => ({
            type: actions.EVENT_UPDATED,
            payload: event
        }))
    );

    private userSub: Subscription;
    private users: Map<string, User>;

    constructor(
        private store: Store<AppState>,
        private actions$: Actions,
        private http: HttpClient,
        private userService: UserService,
        private router: Router
    ) {
        this.userSub = userService.users.subscribe(users => this.users = users);
    }

    ngOnDestroy(): void {
        this.userSub.unsubscribe();
    }
}
