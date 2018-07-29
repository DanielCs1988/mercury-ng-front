import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Event} from '../../models';
import {getCurrentDate, validateDatetimes} from '../../utils/time';
import {Store} from '@ngrx/store';
import {AppState} from '../../store/app.reducers';
import {take} from 'rxjs/operators';
import {EventState} from '../../store/event/event.reducers';
import {CreateEvent, UpdateEvent} from '../../store/event/event.actions';

@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.css']
})
export class EventEditComponent implements OnInit {

    eventForm: FormGroup;
    editedEvent: Event;
    editing: boolean;

    constructor(private store: Store<AppState>, private route: ActivatedRoute, private router: Router) { }

    ngOnInit() {
        this.route.params.subscribe((param: Params) => {
            const id = param['id'];
            this.editing = id !== undefined;
            if (this.editing) {
                this.store.select('events').pipe(take(1)).subscribe((eventState: EventState) => {
                    this.editedEvent = eventState.events.find(event => event._id === id);
                    if (this.editedEvent === undefined) {
                        this.router.navigate(['../'], {relativeTo: this.route});
                    } else {
                        this.initForm(this.editedEvent);
                    }
                });
            } else {
                this.initForm();
            }
        });
    }

    private initForm(event?: Event) {
        let name = '';
        let description = '';
        let pictureUrl = '';
        let location = '';
        let startDate = getCurrentDate();
        let endDate = getCurrentDate();

        if (this.editing) {
            name = event.name;
            description = event.description;
            pictureUrl = event.pictureUrl;
            startDate = getCurrentDate(event.startDate);
            endDate = getCurrentDate(event.endDate);
            location = event.location;
        }

        this.eventForm = new FormGroup({
            'name': new FormControl(name, [Validators.required, Validators.pattern(/.{1,50}/)]),
            'description': new FormControl(description, [Validators.required, Validators.pattern(/.{1,1000}/)]),
            'pictureUrl': new FormControl(pictureUrl, Validators.maxLength(100)),
            'startDate': new FormControl(startDate, Validators.required),
            'endDate': new FormControl(endDate, Validators.required),
            'location': new FormControl(location, [Validators.required, Validators.pattern(/.{1,100}/)])
        });
    }

    async onSubmit() {
        if (!(this.eventForm.valid && validateDatetimes(this.eventForm.value.startDate, this.eventForm.value.endDate))) {
            return;
        }
        const formValue: any = this.eventForm.value;
        const event = {...formValue, startDate: new Date(formValue.startDate).getTime(), endDate: new Date(formValue.endDate).getTime()};
        if (this.editing) {
            const updatedEvent = {...this.editedEvent, ...event};
            this.store.dispatch(new UpdateEvent(updatedEvent));
        } else {
            this.store.dispatch(new CreateEvent(event));
        }
        this.closeEditor();
    }

    closeEditor() {
        this.router.navigate(['../'], {relativeTo: this.route});
    }
}
