import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {EventService} from '../../services/event.service';
import {Event, User} from '../../models';
import {faBackward, faCheck, faEdit, faMapMarkerAlt, faTimes, faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import {UserService} from '../../services/user.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit, OnDestroy {

    event: Event;
    currentUser: User;
    locationIcon = faMapMarkerAlt;
    editIcon = faEdit;
    deleteIcon = faTrashAlt;
    backIcon = faBackward;
    joinIcon = faCheck;
    leaveIcon = faTimes;

    private userSub: Subscription;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private eventService: EventService,
        private userService: UserService
    ) { }

    ngOnInit() {
        this.userSub = this.userService.currentUser.subscribe(user => this.currentUser = user);
        this.route.params.subscribe((params: Params) => {
            this.eventService.getEvent(params['id'])
                .then(event => this.event = event)
                .catch(err => console.log(err));
        });
    }

    joinedEvent(): boolean {
        // todo: Should convert this to a Set in the future
        return this.event.participants.find(user => user.id === this.currentUser.id) !== undefined;
    }

    async onDelete() {
        await this.eventService.deleteEvent(this.event._id);
        this.navigateBack();
    }

    navigateBack() {
        this.router.navigate(['../'], {relativeTo: this.route});
    }

    onChangeParticipation() {
        this.eventService.changeParticipation(this.event._id)
            .then(event => this.event = event)
            .catch(err => console.error(err));
    }

    ngOnDestroy(): void {
        this.userSub.unsubscribe();
    }
}
