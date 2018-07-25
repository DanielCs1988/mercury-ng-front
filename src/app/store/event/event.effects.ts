import {Injectable, OnDestroy} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../app.reducers';
import {Actions, Effect} from '@ngrx/effects';
import {map, switchMap, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {UserService} from '../../services/user.service';
import {EVENTS_ENDPOINT} from '../../utils/endpoints';
import {Subscription} from 'rxjs';
import {User} from '../../models';
import {Router} from '@angular/router';
import {ActionTypes, EventCreated, EventUpdated, CreateEvent, UpdateEvent, DeleteEvent, ChangeParticipation} from './event.actions';

@Injectable()
export class EventEffects implements OnDestroy {

    @Effect()
    fetchEvents = this.actions$.ofType(ActionTypes.FETCH_EVENTS).pipe(
        switchMap(() => this.http.get<any>(EVENTS_ENDPOINT)),
        map(events => {
            const mappedEvents = events.map(event => {
                event.organizer = this.users.get(event.organizer);
                event.participants = event.participants.map(participant => this.users.get(participant));
                return event;
            });
            return {
                type: ActionTypes.EVENTS_FETCHED,
                payload: mappedEvents
            };
        })
    );

    @Effect()
    createEvent = this.actions$.ofType(ActionTypes.CREATE_EVENT).pipe(
        tap((action: CreateEvent) => {
            const optimisticResponse = {
                ...action.payload,
                _id: '',
                createdAt: new Date().getTime(),
                organizer: this.currentUser,
                participants: []
            };
            this.store.dispatch(new EventCreated(optimisticResponse));
        }),
        switchMap((action: CreateEvent) => {
            return this.http.post<any>(EVENTS_ENDPOINT, action.payload);
        }),
        map(event => ({ ...event, organizer: this.users.get(event.organizer) })),
        map(event => ({
            type: ActionTypes.EVENT_CREATED,
            payload: event
        }))
    );

    @Effect()
    updateEvent = this.actions$.ofType(ActionTypes.UPDATE_EVENT).pipe(
        tap((action: UpdateEvent) => {
            this.store.dispatch(new EventUpdated(action.payload));
        }),
        switchMap((action: UpdateEvent) => {
            const event = action.payload;
            return this.http.put<any>(`${EVENTS_ENDPOINT}/${event._id}`, event);
        }),
        map(event => ({
            ...event,
            organizer: this.users.get(event.organizer),
            participants: event.participants.map(participant => this.users.get(participant))
        })),
        map(event => ({
            type: ActionTypes.EVENT_UPDATED,
            payload: event
        }))
    );

    @Effect()
    deleteEvent = this.actions$.ofType(ActionTypes.DELETE_EVENT).pipe(
        switchMap((action: DeleteEvent) => {
            const id = action.payload;
            return this.http.delete<any>(`${EVENTS_ENDPOINT}/${id}`);
        }),
        tap(() => this.router.navigate(['/events'])),
        map(event => ({
            type: ActionTypes.EVENT_DELETED,
            payload: event._id
        }))
    );

    @Effect()
    changeParticipation = this.actions$.ofType(ActionTypes.CHANGE_PARTICIPATION).pipe(
        switchMap((action: ChangeParticipation) => {
            const id = action.payload;
            return this.http.post<any>(`${EVENTS_ENDPOINT}/${id}`, {});
        }),
        map(event => ({
            ...event,
            organizer: this.users.get(event.organizer),
            participants: event.participants.map(participant => this.users.get(participant))
        })),
        map(event => ({
            type: ActionTypes.EVENT_UPDATED,
            payload: event
        }))
    );

    private usersSub: Subscription;
    private userSub: Subscription;
    private users: Map<string, User>;
    private currentUser: User;

    constructor(
        private store: Store<AppState>,
        private actions$: Actions,
        private http: HttpClient,
        private userService: UserService,
        private router: Router
    ) {
        this.usersSub = userService.users.subscribe(users => this.users = users);
        this.userSub = userService.currentUser.subscribe(user => this.currentUser = user);
    }

    ngOnDestroy(): void {
        this.usersSub.unsubscribe();
        this.userSub.unsubscribe();
    }
}
