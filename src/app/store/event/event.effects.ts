import {Injectable, OnDestroy} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../app.reducers';
import {Actions, Effect} from '@ngrx/effects';
import {map, switchMap, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {UserService} from '../../services/user.service';
import {Endpoints} from '../../utils/endpoints';
import {Subscription} from 'rxjs';
import {User} from '../../models';
import {Router} from '@angular/router';
import {
    ActionTypes,
    EventCreated,
    EventUpdated,
    CreateEvent,
    UpdateEvent,
    DeleteEvent,
    ChangeParticipation,
    EventDeleted
} from './event.actions';

@Injectable()
export class EventEffects implements OnDestroy {

    @Effect()
    fetchEvents = this.actions$.ofType(ActionTypes.FETCH_EVENTS).pipe(
        switchMap(() => this.http.get<any>(Endpoints.EVENTS)),
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
                id: -1,
                createdAt: new Date().getTime(),
                organizer: this.currentUser,
                participants: []
            };
            this.store.dispatch(new EventCreated(optimisticResponse));
        }),
        switchMap((action: CreateEvent) => {
            return this.http.post<any>(Endpoints.EVENTS, action.payload);
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
        map((action: UpdateEvent) => ({
            ...action, payload: {
                ...action.payload, organizer: '', participants: []
            }
        })),
        switchMap((action: UpdateEvent) => {
            const event = action.payload;
            return this.http.put<any>(`${Endpoints.EVENTS}/${event.id}`, event);
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

    @Effect({ dispatch: false })
    deleteEvent = this.actions$.ofType(ActionTypes.DELETE_EVENT).pipe(
        tap((action: DeleteEvent) => {
            this.store.dispatch(new EventDeleted(action.payload));
            this.router.navigate(['/events']);
        }),
        switchMap((action: DeleteEvent) => {
            const id = action.payload;
            return this.http.delete<any>(`${Endpoints.EVENTS}/${id}`);
        })
    );

    @Effect()
    changeParticipation = this.actions$.ofType(ActionTypes.CHANGE_PARTICIPATION).pipe(
        switchMap((action: ChangeParticipation) => {
            const id = action.payload;
            return this.http.post<any>(`${Endpoints.EVENTS}/${id}`, {});
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
