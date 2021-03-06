import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ProfileService} from '../../services/profile.service';
import {UserDetails} from '../../models';
import {getCurrentDate} from '../../utils/time';

@Component({
    selector: 'app-edit-profile',
    templateUrl: './edit-profile.component.html',
    styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

    @Input('profile') user: UserDetails;
    @Output('onSave') onSave = new EventEmitter<void>();

    profileForm: FormGroup;

    constructor(private profileService: ProfileService) { }

    ngOnInit() {
        const profile = this.user.profile ? { ...this.user.profile } : {};
        this.profileForm = new FormGroup({
            'id': new FormControl(profile.id),
            'introduction': new FormControl(profile.introduction, Validators.maxLength(1000)),
            'birthday': new FormControl(getCurrentDate(profile.birthday, false)),
            'address': new FormControl(profile.address, Validators.maxLength(100)),
            'email': new FormControl(profile.email, Validators.email),
            'phone': new FormControl(profile.phone, Validators.maxLength(30))
        });
    }

    onSubmit() {
        if (!this.profileForm.valid) {
            this.closeEditor();
        }
        const profile = {
            ...this.profileForm.value,
            birthday: new Date(this.profileForm.value.birthday).getTime() / 1000
        };
        if (this.user.profile) {
            this.profileService.updateProfile(profile);
        } else {
            this.profileService.createProfile(this.user.id, profile);
        }
        this.closeEditor();
    }

    closeEditor() {
        this.onSave.emit();
    }
}
