import {Component, OnDestroy, OnInit} from '@angular/core';
import {Friendship, User} from '../models';
import {UserService} from '../services/user.service';
import {Subscription} from 'rxjs';
import {faCheckCircle, faComments, faHandshake, faSignal, faTimesCircle, faUserFriends} from '@fortawesome/free-solid-svg-icons';
import {Apollo, QueryRef} from 'apollo-angular';
import {FETCH_FRIENDS, FRIENDSHIP_SUBSCRIPTION} from '../queries/friendship';
import {FriendService} from '../services/friend.service';
import {FriendshipSubscription} from '../services/subscriptions/friendship.subscription';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {

    private onlineUsersSub: Subscription;
    private usersSubscription: Subscription;
    private currentUserSub: Subscription;
    private unreadMsgSub: Subscription;
    private friendsQuery: QueryRef<any>;

    unreadMessages = new Map<string, number>();
    friendRequests = new Map<string, Friendship>();
    friends = new Map<string, Friendship>();
    onlineUsers = new Set<string>();
    users: User[] = [];
    currentUser: User;

    onlineIcon = faSignal;
    unreadIcon = faComments;
    friendIcon = faUserFriends;
    addFriendIcon = faCheckCircle;
    acceptFriendIcon = faHandshake;
    removeFriendIcon = faTimesCircle;

    constructor(
        private userService: UserService,
        private apollo: Apollo,
        private friendService: FriendService,
        private friendshipReducer: FriendshipSubscription
    ) { }

    ngOnInit() {
        this.currentUserSub = this.userService.currentUser.subscribe(user => this.currentUser = user);
        this.onlineUsersSub = this.userService.onlineUsers.subscribe(users => this.onlineUsers = users);
        this.usersSubscription = this.userService.users.subscribe(users => this.users = Array.from(users.values()));
        this.unreadMsgSub = this.userService.onUnreadMessagesChange.subscribe(unread => this.unreadMessages = unread);
        this.processFriends();
    }

    private processFriends() {
        this.friendsQuery = this.apollo.watchQuery<any>({ query: FETCH_FRIENDS });
        this.friendsQuery.valueChanges.subscribe(({ data }) => {
            this.updateFriendList(data);
            this.updateFriendRequestList(data);
        });
        this.friendsQuery.subscribeToMore({
            document: FRIENDSHIP_SUBSCRIPTION,
            updateQuery: this.friendshipReducer.friendshipReducer
        });
    }

    private updateFriendList(data: any) {
        this.friends.clear();
        data.currentUser.addedFriends
            .forEach(friendship => this.friends.set(
                friendship.target.id,
                {id: friendship.id, accepted: friendship.accepted, createdAt: friendship.createdAt}
            ));
        data.currentUser.acceptedFriends
            .filter(friendship => friendship.accepted)
            .forEach(friendship => this.friends.set(
                friendship.initiator.id,
                {id: friendship.id, accepted: friendship.accepted, createdAt: friendship.createdAt}
            ));
    }

    private updateFriendRequestList(data: any) {
        this.friendRequests.clear();
        data.currentUser.acceptedFriends
            .filter(friendship => !friendship.accepted)
            .forEach(friendship => this.friendRequests.set(
                friendship.initiator.id,
                {id: friendship.id, createdAt: friendship.createdAt}
            ));
    }

    onAddFriend(target: User) {
        this.friendService.addFriend(target);
    }

    onAcceptFriend(targetId: string) {
        const friendShipId = this.friendRequests.get(targetId).id;
        this.friendService.acceptFriend(friendShipId);
    }

    onRemoveFriend(targetId: string) {
        const friendShipId = this.friends.get(targetId).id;
        this.friendService.removeFriend(friendShipId);
    }

    ngOnDestroy(): void {
        this.currentUserSub.unsubscribe();
        this.usersSubscription.unsubscribe();
        this.unreadMsgSub.unsubscribe();
        this.onlineUsersSub.unsubscribe();
    }
}
