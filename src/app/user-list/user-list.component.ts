import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from '../models';
import {UserService} from '../services/user.service';
import {Subscription} from 'rxjs';
import {faComments, faSignal} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {

    private onlineUsersSub: Subscription;
    private usersSubscription: Subscription;
    private unreadMsgSub: Subscription;

    unreadMessages = new Map<string, number>();
    onlineUsers: Set<string>;
    users: User[] = [];
    onlineIcon = faSignal;
    unreadIcon = faComments;

    constructor(private userService: UserService) { }

    ngOnInit() {
        this.onlineUsersSub = this.userService.onlineUsers.subscribe(users => this.onlineUsers = users);
        this.usersSubscription = this.userService.users.subscribe(users => this.users = Array.from(users.values()));
        this.unreadMsgSub = this.userService.onUnreadMessagesChange.subscribe(unread => this.unreadMessages = unread);
    }

    ngOnDestroy(): void {
        this.usersSubscription.unsubscribe();
        this.unreadMsgSub.unsubscribe();
        this.onlineUsersSub.unsubscribe();
    }
}
