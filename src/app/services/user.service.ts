import {Injectable, OnDestroy} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {CURRENT_USER_QUERY, USERS_QUERY} from '../queries/users';
import {BehaviorSubject, Subscription} from 'rxjs';
import {User} from '../models';

@Injectable({
    providedIn: 'root'
})
export class UserService implements OnDestroy {

    private querySubscription: Subscription;
    users = new BehaviorSubject<Map<string, User>>(new Map<string, User>());
    currentUser = new BehaviorSubject<User>(null);
    usersLoaded = false;

    constructor(private apollo: Apollo) {
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

    async getUserProfile() {
        const {data} = await this.apollo.query<any>({ query: CURRENT_USER_QUERY }).toPromise();
        this.currentUser.next(data.currentUser);
    }

    removeUserProfile() {
        this.currentUser.next(null);
    }

    ngOnDestroy(): void {
        this.querySubscription.unsubscribe();
    }
}
