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
    editing: boolean;

    constructor(private store: Store<AppState>, private route: ActivatedRoute, private router: Router) { }

    ngOnInit() {
        this.route.params.subscribe((param: Params) => {
            const id = param['id'];
            this.editing = id !== undefined;
            if (this.editing) {
                this.store.select('events').pipe(take(1)).subscribe((eventState: EventState) => {
                    const event = eventState.events.find(event => event._id === id);
                    if (event === undefined) {
                        this.router.navigate(['../'], {relativeTo: this.route});
                    } else {
                        this.initForm(event);
                    }
                });
            } else {
                this.initForm();
            }
        });
    }

    private initForm(event?: Event) {
        let id = '';
        let name = '';
        let description = '';
        let pictureUrl = '';
        let location = '';
        let startDate = getCurrentDate();
        let endDate = getCurrentDate();

        if (this.editing) {
            id = event._id;
            name = event.name;
            description = event.description;
            pictureUrl = event.pictureUrl;
            startDate = getCurrentDate(event.startDate);
            endDate = getCurrentDate(event.endDate);
            location = event.location;
        }

        this.eventForm = new FormGroup({
            '_id': new FormControl(id),
            'name': new FormControl(name, [Validators.required, Validators.minLength(1)]),
            'description': new FormControl(description, [Validators.required, Validators.minLength(1)]),
            'pictureUrl': new FormControl(pictureUrl),
            'startDate': new FormControl(startDate, Validators.required),
            'endDate': new FormControl(endDate, Validators.required),
            'location': new FormControl(location, [Validators.required, Validators.minLength(1)])
        });
    }

    async onSubmit() {
        if (!(this.eventForm.valid && validateDatetimes(this.eventForm.value.startDate, this.eventForm.value.endDate))) {
            return;
        }
        const formValue: any = this.eventForm.value;
        const event = {...formValue, startDate: new Date(formValue.startDate).getTime(), endDate: new Date(formValue.endDate).getTime()};
        if (this.editing) {
            this.store.dispatch(new UpdateEvent(event));
        } else {
            this.store.dispatch(new CreateEvent(event));
        }
        this.closeEditor();
    }

    closeEditor() {
        this.router.navigate(['../'], {relativeTo: this.route});
    }
}
