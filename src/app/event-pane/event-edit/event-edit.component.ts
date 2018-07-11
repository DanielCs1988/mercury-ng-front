import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {EventService} from '../../services/event.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Event} from '../../models';
import {getCurrentDate, validateDatetimes} from '../../utils/time';

@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.css']
})
export class EventEditComponent implements OnInit {

    eventForm: FormGroup;
    editing: boolean;

    constructor(private eventService: EventService, private route: ActivatedRoute, private router: Router) { }

    ngOnInit() {
        this.route.params.subscribe(async (param: Params) => {
            const id = param['id'];
            this.editing = id !== undefined;
            if (this.editing) {
                const event = await this.eventService.getEvent(id);
                if (event === undefined) {
                    return this.router.navigate(['../'], {relativeTo: this.route});
                }
                return this.initForm(event);
            }
            this.initForm();
        });
    }

    private initForm(event?: Event) {
        let id = '';
        let name = '';
        let description = '';
        let pictureUrl = '';
        let startDate = getCurrentDate();
        let endDate = getCurrentDate();

        if (this.editing) {
            id = event._id;
            name = event.name;
            description = event.description;
            pictureUrl = event.pictureUrl;
            startDate = getCurrentDate(event.startDate);
            endDate = getCurrentDate(event.endDate);
        }

        this.eventForm = new FormGroup({
            '_id': new FormControl(id),
            'name': new FormControl(name, Validators.required),
            'description': new FormControl(description, Validators.required),
            'pictureUrl': new FormControl(pictureUrl),
            'startDate': new FormControl(startDate, Validators.required),
            'endDate': new FormControl(endDate, Validators.required)
        });
    }

    async onSubmit() {
        if (!(this.eventForm.valid && validateDatetimes(this.eventForm.value.startDate, this.eventForm.value.endDate))) {
            return;
        }
        const formValue: any = this.eventForm.value;
        const event = {...formValue, startDate: new Date(formValue.startDate).getTime(), endDate: new Date(formValue.endDate).getTime()};
        if (this.editing) {
            await this.eventService.updateEvent(event);
        } else {
            await this.eventService.createEvent(event);
        }
        this.closeEditor();
    }

    closeEditor() {
        this.router.navigate(['/events']);
    }
}
