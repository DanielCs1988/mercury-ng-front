import {Injectable, OnDestroy} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {CURRENT_USER_QUERY, USER_FRAGMENT, USERS_QUERY} from '../queries/users';
import {BehaviorSubject, Subject, Subscription} from 'rxjs';
import {User} from '../models';
import {SocketClient} from './SocketClient';

@Injectable({
    providedIn: 'root'
})
export class UserService implements OnDestroy {

    private SOCKET_URL = 'localhost';
    private SOCKET_PORT = 8080;

    private querySubscription: Subscription;
    private onlineUsersSub: Subscription;

    users = new BehaviorSubject<Map<string, User>>(new Map<string, User>());
    onlineUsers = new BehaviorSubject<Set<string>>(new Set<string>());
    currentUser = new BehaviorSubject<User>(null);
    usersLoaded = false;

    private unreadMessages = new Map<string, number>();
    onUnreadMessagesChange = new Subject<Map<string, number>>();

    constructor(private apollo: Apollo, private socket: SocketClient) {
        this.querySubscription = this.apollo
            .watchQuery<any>({ query: USERS_QUERY })
                .valueChanges
                .subscribe(({data}) => {
                    const users = new Map<string, User>();
                    data.users.forEach((user: User) => users.set(user.googleId, user));
                    this.users.next(users);
                    this.usersLoaded = true;
                });
    }

    /**
     * Called after logging in with Auth0 or when a valid token is found in the cache.
     * Can initiate user-info-dependent processes here.
     */
    async getUserProfile() {
        const {data} = await this.apollo.query<any>({ query: CURRENT_USER_QUERY }).toPromise();
        this.currentUser.next(data.currentUser);
        this.initSocketConnection();
    }

    /**
     * Called when user is logged out. Cleanup processes should be called here.
     */
    removeUserProfile() {
        this.currentUser.next(null);
        this.socket.disconnect();
    }

    getUserById(id: string): User {
        return this.apollo.getClient().readFragment({
            id: `User:${id}`,
            fragment: USER_FRAGMENT
        });
    }

    markUnreadMessages(from: string) {
        const unread = this.unreadMessages.get(from);
        if (!unread) {
            this.unreadMessages.set(from, 1);
        } else {
            this.unreadMessages.set(from, unread + 1);
        }
        this.onUnreadMessagesChange.next(this.unreadMessages);
    }

    markMessagesRead(from: string) {
        if (this.unreadMessages.get(from)) {
            this.unreadMessages.delete(from);
            this.onUnreadMessagesChange.next(this.unreadMessages);
        }
    }

    private initSocketConnection() {
        const token = localStorage.getItem('access_token');
        this.socket.connect(this.SOCKET_URL, this.SOCKET_PORT, token);
        if (!this.onlineUsersSub) {
            this.onlineUsersSub = this.socket.on('users').subscribe(users => {
                this.onlineUsers.next(new Set<string>(users));
            });
        }
    }

    ngOnDestroy(): void {
        this.querySubscription.unsubscribe();
        this.onlineUsersSub.unsubscribe();
    }
}
