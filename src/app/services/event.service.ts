import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of, Subscription} from 'rxjs';
import {Event, User} from '../models';
import {map, tap} from 'rxjs/operators';
import {UserService} from './user.service';

@Injectable({
  providedIn: 'root'
})
export class EventService implements OnDestroy {

    private EVENTS_ENDPOINT = 'https://mercury-events.herokuapp.com/events';
    private userSub: Subscription;
    private events = new Map<string, Event>();
    private users: Map<string, User>;

    constructor(private http: HttpClient, private userService: UserService) {
        this.userSub = userService.users.subscribe(users => this.users = users);
    }

    getAllEvents(): Observable<Event[]> {
        if (this.events.size > 0) {
            return of(Array.from(this.events.values()));
        }

        return this.http.get<any>(this.EVENTS_ENDPOINT).pipe(
            map(events => events.map(event => {
                event.organizer = this.users.get(event.organizer);
                event.participants = event.participants.map(participant => this.users.get(participant));
                return event;
            })),
            tap(events => events.forEach(event => this.events.set(event._id, event)))
        );
    }

    async getEvent(id: string): Promise<Event> {
        const event = this.events.get(id);

        if (!event) {
            await this.getAllEvents().toPromise();
            return this.getEvent(id);
        }
        return event;
    }

    createEvent(event: Event): Promise<any> {
        return this.http.post<any>(this.EVENTS_ENDPOINT, event).pipe(
            map(event => {return {...event, organizer: this.users.get(event.organizer)}}),
            tap((event: Event) => this.events.set(event._id, event))
        ).toPromise();
    }

    updateEvent(event: Event): Promise<any> {
        return this.http.put<any>(`${this.EVENTS_ENDPOINT}/${event._id}`, event).pipe(
            map(event => {return {...event, organizer: this.users.get(event.organizer)}}),
            tap((event: Event) => this.events.set(event._id, event))
        ).toPromise();
    }

    deleteEvent(id: string): Promise<any> {
        return this.http.delete<any>(`${this.EVENTS_ENDPOINT}/${id}`).pipe(
            tap(() => this.events.delete(id))
        ).toPromise();
    }

    ngOnDestroy(): void {
        this.userSub.unsubscribe();
    }
}
