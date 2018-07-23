import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {faMapMarkerAlt} from '@fortawesome/free-solid-svg-icons';
import {Store} from '@ngrx/store';
import {AppState} from '../../store/app.reducers';
import {EventState} from '../../store/event/event.reducers';
import {Event} from '../../models';
import {FetchEvents} from '../../store/event/event.actions';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit, OnDestroy {

    private eventSub: Subscription;
    events: Event[];
    locationIcon = faMapMarkerAlt;

    constructor(private store: Store<AppState>) { }

    ngOnInit() {
        this.eventSub = this.store.select('events').subscribe((eventState: EventState) => {
            this.events = eventState.events;
            if (!eventState.fetchedEvents) {
                this.store.dispatch(new FetchEvents());
            }
        });
    }

    ngOnDestroy(): void {
        this.eventSub.unsubscribe();
    }
}
