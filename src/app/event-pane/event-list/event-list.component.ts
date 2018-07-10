import { Component, OnInit } from '@angular/core';
import {EventService} from '../../services/event.service';
import {Observable} from 'rxjs';
import {Event} from '../../models';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styles: []
})
export class EventListComponent implements OnInit {

    events: Observable<Event[]>;

    constructor(private eventService: EventService) { }

    ngOnInit() {
        this.events = this.eventService.getAllEvents();
    }

}
