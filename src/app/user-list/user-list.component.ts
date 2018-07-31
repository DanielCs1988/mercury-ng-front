import {Component, OnDestroy, OnInit} from '@angular/core';
import {Friendship, User} from '../models';
import {UserService} from '../services/user.service';
import {Subscription} from 'rxjs';
import {faCheckCircle, faComments, faHandshake, faSignal, faTimesCircle, faUserAlt, faUserFriends} from '@fortawesome/free-solid-svg-icons';
import {Apollo} from 'apollo-angular';
import {FriendService} from '../services/friend.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {

    private friendlistSub: Subscription;
    private friendRequestSub: Subscription;
    private onlineUsersSub: Subscription;
    private usersSubscription: Subscription;
    private currentUserSub: Subscription;
    private unreadMsgSub: Subscription;

    friendRequests: Map<string, Friendship>;
    friendlist: Map<string, Friendship>;
    unreadMessages = new Map<string, number>();
    onlineUsers = new Set<string>();
    users: User[] = [];
    currentUser: User;

    onlineIcon = faSignal;
    unreadIcon = faComments;
    friendIcon = faUserFriends;
    addFriendIcon = faCheckCircle;
    acceptFriendIcon = faHandshake;
    removeFriendIcon = faTimesCircle;
    profileIcon = faUserAlt;

    constructor(private userService: UserService, private apollo: Apollo, private friendService: FriendService) { }

    ngOnInit() {
        this.currentUserSub = this.userService.currentUser.subscribe(user => this.currentUser = user);
        this.onlineUsersSub = this.userService.onlineUsers.subscribe(users => this.onlineUsers = users);
        this.usersSubscription = this.userService.users.subscribe(users => this.users = Array.from(users.values()));
        this.unreadMsgSub = this.userService.onUnreadMessagesChange.subscribe(unread => this.unreadMessages = unread);
        this.friendlistSub = this.friendService.friendlist.subscribe(friends => this.friendlist = friends);
        this.friendRequestSub = this.friendService.friendRequests.subscribe(requests => this.friendRequests = requests);
    }

    onAddFriend(target: User) {
        this.friendService.addFriend(target);
    }

    onAcceptFriend(targetId: string) {
        const friendShipId = this.friendRequests.get(targetId).id;
        this.friendService.acceptFriend(friendShipId);
    }

    onRemoveFriend(targetId: string) {
        if (confirm('Are you sure you want to destroy your friendship? :-(')) {
            const friendShipId = this.friendlist.get(targetId).id;
            this.friendService.removeFriend(friendShipId);
        }
    }

    ngOnDestroy(): void {
        this.friendlistSub.unsubscribe();
        this.friendRequestSub.unsubscribe();
        this.currentUserSub.unsubscribe();
        this.usersSubscription.unsubscribe();
        this.unreadMsgSub.unsubscribe();
        this.onlineUsersSub.unsubscribe();
    }
}
