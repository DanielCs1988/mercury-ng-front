import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Event, User} from '../../models';
import {faBackward, faCheck, faEdit, faMapMarkerAlt, faTimes, faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import {UserService} from '../../services/user.service';
import {Subscription} from 'rxjs';
import {Store} from '@ngrx/store';
import {AppState} from '../../store/app.reducers';
import {EventState} from '../../store/event/event.reducers';
import {ChangeParticipation, DeleteEvent} from '../../store/event/event.actions';

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
    private eventSub: Subscription;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private store: Store<AppState>,
        private userService: UserService
    ) { }

    ngOnInit() {
        this.userSub = this.userService.currentUser.subscribe(user => this.currentUser = user);
        this.route.params.subscribe((params: Params) => {
            this.eventSub = this.store.select('events').subscribe((eventState: EventState) => {
                const id = params['id'];
                this.event = eventState.events.find(event => event.id === id);
            })
        });
    }

    joinedEvent(): boolean {
        // todo: Should convert this to a Set in the future
        return this.event.participants.find(user => user.id === this.currentUser.id) !== undefined;
    }

    onDelete() {
        if (confirm('Are you sure you want to delete your event?')) {
            this.store.dispatch(new DeleteEvent(this.event.id));
        }
    }

    onChangeParticipation() {
        this.store.dispatch(new ChangeParticipation(this.event.id));
    }

    navigateBack() {
        this.router.navigate(['../'], {relativeTo: this.route});
    }

    ngOnDestroy(): void {
        this.userSub.unsubscribe();
        this.eventSub.unsubscribe();
    }
}
