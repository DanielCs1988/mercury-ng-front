import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from '../models';
import {UserService} from '../services/user.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {

  private usersSubscription: Subscription;
  users: User[] = [];

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.usersSubscription = this.userService.users.subscribe(users => this.users = Array.from(users.values()));
  }

  ngOnDestroy(): void {
    this.usersSubscription.unsubscribe();
  }
}
