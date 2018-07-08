import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {UserService} from '../services/user.service';
import {Subscription} from 'rxjs';
import {User} from '../models';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit, OnDestroy {

    private userSub: Subscription;
    user: User;

    constructor(private authService: AuthService, private userService: UserService) { }

    ngOnInit() {
        this.userSub = this.userService.currentUser.subscribe(user => this.user = user);
    }

    login() {
        this.authService.login();
    }

    logout() {
        this.authService.logout();
    }

    isLoggedIn(): boolean {
        return this.authService.isAuthenticated();
    }

    ngOnDestroy(): void {
        this.userSub.unsubscribe();
    }
}
