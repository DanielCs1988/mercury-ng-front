import {Injectable, OnDestroy} from '@angular/core';
import {Apollo, QueryRef} from 'apollo-angular';
import {CURRENT_USER_QUERY, NEW_USER_SUBSCRIPTION, USER_FRAGMENT, USERS_QUERY} from '../queries/users';
import {BehaviorSubject, Subject, Subscription} from 'rxjs';
import {User} from '../models';
import {SocketClient} from './SocketClient';
import {Store} from '@ngrx/store';
import {AppState} from '../store/app.reducers';
import {Endpoints} from '../utils/endpoints';
import {Chat} from '../utils/chat.routes';

@Injectable({
    providedIn: 'root'
})
export class UserService implements OnDestroy {

    private userQuery: QueryRef<any>;
    private querySubscription: Subscription;
    private onlineUsersSub: Subscription;

    users = new BehaviorSubject<Map<string, User>>(new Map<string, User>());
    onlineUsers = new BehaviorSubject<Set<string>>(new Set<string>());
    currentUser = new BehaviorSubject<User>(null);
    usersLoaded = false;

    private unreadMessages = new Map<string, number>();
    onUnreadMessagesChange = new Subject<Map<string, number>>();

    constructor(private apollo: Apollo, private socket: SocketClient, private store: Store<AppState>) { }

    initUserList() {
        this.getUserProfile();
        this.userQuery = this.apollo.watchQuery<any>({query: USERS_QUERY});
        this.querySubscription = this.userQuery
            .valueChanges
            .subscribe(({data}) => {
                const users = new Map<string, User>();
                data.users.forEach((user: User) => users.set(user.googleId, user));
                this.users.next(users);
                this.usersLoaded = true;
            });
        this.initNewUserSubscription();
    }

    private initNewUserSubscription() {
        this.userQuery.subscribeToMore({
            document: NEW_USER_SUBSCRIPTION,
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data.newUser) {
                    return;
                }
                return {...prev, users: [...prev.users, subscriptionData.data.newUser.node]};
            }
        });
    }

    /**
     * Called after logging in with Auth0 or when a valid token is found in the cache.
     * Can initiate user-info-dependent processes here.
     */
    private async getUserProfile() {
        const {data} = await this.apollo.query<any>({ query: CURRENT_USER_QUERY }).toPromise();
        this.currentUser.next(data.currentUser);
        this.initSocketConnection();
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
        this.socket.connect(Endpoints.CHAT, token);
        if (!this.onlineUsersSub) {
            this.onlineUsersSub = this.socket.on<string[]>(Chat.GET_USERLIST).subscribe(users => {
                this.onlineUsers.next(new Set<string>(users));
            });
        }
    }

    ngOnDestroy(): void {
        this.querySubscription.unsubscribe();
        this.onlineUsersSub.unsubscribe();
    }
}
