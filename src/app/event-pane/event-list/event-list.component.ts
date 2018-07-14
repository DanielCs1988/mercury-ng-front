import { Component, OnInit } from '@angular/core';
import {EventService} from '../../services/event.service';
import {Observable} from 'rxjs';
import {Event} from '../../models';
import {faMapMarkerAlt} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {

    events: Observable<Event[]>;
    locationIcon = faMapMarkerAlt;

    constructor(private eventService: EventService) { }

    ngOnInit() {
        this.events = this.eventService.getAllEvents();
    }

}
