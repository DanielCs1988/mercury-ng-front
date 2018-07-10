import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {EventService} from '../../services/event.service';
import {Event} from '../../models';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styles: []
})
export class EventDetailsComponent implements OnInit {

    event: Event;

    constructor(private route: ActivatedRoute, private eventService: EventService) { }

    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            this.eventService.getEvent(params['id'])
                .then(event => {this.event = event; console.log(event);})
                .catch(err => console.log(err));
        });
    }

}
